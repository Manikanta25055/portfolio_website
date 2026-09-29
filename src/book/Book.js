import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BOOK_TITLE, RESUME, buildBook } from './pages';
import { BackCover, FrontCover, Pastedown } from './Covers';
import Desk from './Desk';
import {
  apply,
  bezier,
  clamp,
  constrain,
  fold,
  identity,
  inverse,
  lerp,
  linear,
  mirror,
  multiply,
  toCss,
  translate,
} from './geometry';
import './book.css';

// Page and board dimensions, in the book's own units. The whole object is
// scaled to the window afterwards, so pagination never changes.
export const W = 540;
export const H = 760;
const OV = 14; // how far the boards overhang the text block
const CAST_LAYERS = [1.5, 4, 8]; // how far each shadow layer spreads, px
const SPAN = 4000; // side of the square frames that clip along the fold

// An affine frame whose x axis runs along `dir` from a line through `mid`
// (direction `t`). As a clipping box it keeps everything on the `dir` side.
const halfPlane = (mid, dir, t) => [
  dir[0], dir[1], t[0], t[1],
  mid[0] - (SPAN / 2) * t[0], mid[1] - (SPAN / 2) * t[1],
];

// The same frame, stretched so 100 units across span `width` px.
const band = (mid, dir, t, width) => [
  (dir[0] * width) / 100, (dir[1] * width) / 100, t[0], t[1],
  mid[0] - (SPAN / 2) * t[0], mid[1] - (SPAN / 2) * t[1],
];

// Clip a leaf's frame to one side of the fold, or release it (m = null).
const setClip = (frame, m) => {
  if (!frame) return;
  const inner = frame.firstElementChild;
  if (!m) {
    frame.classList.remove('is-clipping');
    frame.style.transform = '';
    if (inner) inner.style.transform = '';
    return;
  }
  frame.classList.add('is-clipping');
  frame.style.transform = toCss(m);
  if (inner) inner.style.transform = toCss(inverse(m));
};
const SHIFT = (W + OV) / 2; // closed books sit centred on their cover
const CLOSED_FRONT = -1;

// Motion: a page is carried by a spring when released, and follows an
// ease-in-out curve when the book turns it for you.
const TURN_EASE = bezier(0.42, 0, 0.18, 1);
const BOARD_EASE = bezier(0.45, 0.05, 0.2, 1);
const SPRING_K = 170;
const SPRING_C = 2 * Math.sqrt(SPRING_K) * 0.96;
const TURN_MS = 700;
const JUMP_MS = 760;
const BOARD_MS = 1000;
const FLICK = 380; // px/s in book units

const smooth = (a) => (1 - Math.cos(Math.PI * a)) / 2;
const prefersReducedMotion = () => (
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
);

const RIBBONS = ['#1d3a5c', '#b8862b', '#2e6a4c', '#6d2b55', '#c0492f'];
const BOOKMARK_KEY = 'gvm-journal-bookmarks';
const CHAPTERS = [
  { key: 'contents', label: 'Contents' },
  { key: 'ch-education', label: 'Education' },
  { key: 'ch-experience', label: 'Experience' },
  { key: 'ch-projects', label: 'Projects' },
  { key: 'ch-toolkit', label: 'Toolkit' },
  { key: 'ch-research', label: 'Research' },
  { key: 'ch-correspondence', label: 'Correspondence' },
  { key: 'index', label: 'Index' },
];
const FRONT_NAMES = { title: 'Title page', colophon: 'Colophon' };

// The floor shadow under each board covers only the board's footprint, so
// nothing is left hanging in the air while a cover swings.
const setFloor = (node, k) => {
  if (!node) return;
  node.style.transform = `scaleX(${k.toFixed(4)})`;
  node.style.opacity = k > 0.002 ? '1' : '0';
};

const loadBookmarks = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(BOOKMARK_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((b) => Number.isInteger(b.spread) && typeof b.color === 'string') : [];
  } catch (error) {
    return [];
  }
};

/* ------------------------------------------------------------------ */
/* A single leaf side                                                  */
/* ------------------------------------------------------------------ */

// Measured type scale per page, so a page mounted again for a turn does not
// have to be laid out repeatedly while the turn is starting.
const FIT_CACHE = new Map();

const Leaf = memo(forwardRef(function Leaf({ page, ctx, left, fontsVersion }, ref) {
  const bodyRef = useRef(null);
  const recto = page.index % 2 === 0;

  // Keep every page inside its text block: if a font renders wider than
  // expected, ease the type down a little rather than letting it spill.
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const cacheKey = `${page.key}:${fontsVersion}`;
    if (FIT_CACHE.has(cacheKey)) {
      body.style.setProperty('--fit', FIT_CACHE.get(cacheKey));
      return;
    }
    let fit = 1;
    body.style.setProperty('--fit', '1');
    while (body.scrollHeight > body.clientHeight + 1 && fit > 0.8) {
      fit -= 0.015;
      body.style.setProperty('--fit', fit.toFixed(3));
    }
    if (body.clientHeight > 0) FIT_CACHE.set(cacheKey, fit.toFixed(3));
  }, [page, fontsVersion]);

  const showHead = !page.plain && !page.opener;
  const showFolio = !page.plain;

  return (
    <div
      ref={ref}
      className={`bk-leaf ${recto ? 'is-recto' : 'is-verso'} ${page.opener ? 'is-opener' : ''}`}
      style={{ left }}
      data-page={page.key}
    >
      {showHead && (
        <div className="bk-runhead" aria-hidden="true">
          {recto ? page.head : <em>{BOOK_TITLE}</em>}
        </div>
      )}
      <div className="bk-body" ref={bodyRef}>
        {page.render(ctx)}
      </div>
      {showFolio && <div className="bk-folio">{page.folio}</div>}
      <div className="bk-gutter" aria-hidden="true" />
      <div className="bk-leaf-shade" aria-hidden="true" />
    </div>
  );
}));

/* ------------------------------------------------------------------ */
/* The text block beneath the open pages                               */
/* ------------------------------------------------------------------ */

// Leaves still to read (or already read) show as sheets stepping out from
// under the open page, following the same curve into the binding.
const Sheets = memo(function Sheets({ side, count }) {
  if (!count) return null;
  const layers = clamp(Math.round(2 + count * 0.55), 2, 8);
  const dx = side === 'right' ? 1.35 : -1.35;
  return (
    <div className="bk-sheets" aria-hidden="true">
      {Array.from({ length: layers }, (_, n) => {
        const i = layers - n;
        return (
          <div
            key={i}
            className={`bk-sheet is-${side}`}
            style={{ left: side === 'right' ? W : 0, transform: `translate(${(dx * i).toFixed(2)}px, ${(i * 1.05).toFixed(2)}px)` }}
          >
            <span style={{ backgroundColor: `rgb(${244 - i * 2.6}, ${238 - i * 3}, ${226 - i * 3.6})` }} />
          </div>
        );
      })}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Bookmarks                                                           */
/* ------------------------------------------------------------------ */

// Satin ribbon with stitched edges, a foil-stamped folio and, when it lies
// across the page, a small brass charm.
function Ribbon({ color, folio, drape = false }) {
  return (
    <span className={`bk-ribbon ${drape ? 'is-drape' : 'is-tab'}`} style={{ '--silk': color }}>
      <span className="bk-silk">
        <span className="bk-silk-folio">{folio}</span>
      </span>
      {drape && <i className="bk-charm" aria-hidden="true"><b>G</b></i>}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Icons for the reading bar                                           */
/* ------------------------------------------------------------------ */

const Icon = ({ name }) => {
  const paths = {
    prev: <path d="M10 3.5L5.5 8l4.5 4.5" />,
    next: <path d="M6 3.5L10.5 8 6 12.5" />,
    mark: <path d="M4.5 2.5h7v11L8 10.6l-3.5 2.9z" />,
    marks: <><path d="M3 2.5h6v10L6 10l-3 2.5z" /><path d="M11 4.5h2v9l-2-1.6" /></>,
    undo: <><path d="M5.5 5H10a3.5 3.5 0 010 7H6.5" /><path d="M7.5 2.5L5 5l2.5 2.5" /></>,
    full: <path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10" />,
    exit: <path d="M6 2.5V6H2.5M13.5 6H10V2.5M10 13.5V10h3.5M2.5 10H6v3.5" />,
    help: <><circle cx="8" cy="8" r="6" /><path d="M6.4 6.3a1.7 1.7 0 113 1.1c-.6.5-1.4.8-1.4 1.8M8 11.4v.1" /></>,
    close: <path d="M4 4l8 8M12 4l-8 8" />,
    doc: <><path d="M4 2.5h5.5L12 5v8.5H4z" /><path d="M9.5 2.5V5H12M6 8.5h4M6 11h4" /></>,
  };
  return <svg viewBox="0 0 16 16" aria-hidden="true">{paths[name]}</svg>;
};

/* ------------------------------------------------------------------ */
/* The book                                                            */
/* ------------------------------------------------------------------ */

export default function Book() {
  const book = useMemo(() => buildBook(), []);
  const { pages } = book;
  const LAST = pages.length / 2; // spread showing the back pastedown
  const CLOSED_BACK = LAST + 1;

  const [spread, setSpread] = useState(CLOSED_FRONT);
  const [turn, setTurn] = useState(null);
  const [scale, setScale] = useState(1);
  const [fontsVersion, setFontsVersion] = useState(0);
  const [idle, setIdle] = useState(false);
  const [opened, setOpened] = useState(false);
  const [preview, setPreview] = useState(null);
  const [undo, setUndo] = useState(null);
  const [bookmarks, setBookmarks] = useState(loadBookmarks);
  const [menu, setMenu] = useState(null);
  const [pick, setPick] = useState('');
  const [fullscreen, setFullscreen] = useState(false);

  const stageRef = useRef(null);
  const blockRef = useRef(null);
  const shiftRef = useRef(null);
  const dockRef = useRef(null);
  const leafNodes = useRef(new Map());
  const underShadeRef = useRef(null);
  const underFoldRef = useRef(null);
  const underGradRef = useRef(null);
  const castRef = useRef(null);
  const castWrapRef = useRef(null);
  const frontBoardRef = useRef(null);
  const backBoardRef = useRef(null);
  const hardShadeRef = useRef(null);
  const floorLeftRef = useRef(null);
  const floorRightRef = useRef(null);

  const spreadRef = useRef(spread);
  spreadRef.current = spread;

  // Everything the animation loop touches lives here, outside React state.
  const engine = useRef({
    kind: null,
    dir: 0,
    mode: null,
    G: [W, H],
    P: [W, H],
    a: 0,
    raf: 0,
    queue: null,
    press: null,
    moves: [],
    peelTarget: null,
  });

  const reduced = useRef(prefersReducedMotion());

  /* ---------------------------- layout ---------------------------- */

  useEffect(() => {
    document.body.classList.add('is-reading');
    const fit = () => {
      const width = 2 * W + 2 * OV + 40;
      const height = H + 2 * OV + 30;
      const next = Math.min((window.innerWidth - 96) / width, (window.innerHeight - 170) / height);
      setScale(clamp(next, 0.45, 1.5));
    };
    fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setFontsVersion((v) => v + 1));
    }
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreen);
    const state = engine.current;
    return () => {
      document.body.classList.remove('is-reading');
      window.removeEventListener('resize', fit);
      document.removeEventListener('fullscreenchange', onFullscreen);
      cancelAnimationFrame(state.raf);
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      // Bookmarks simply won't survive a reload.
    }
  }, [bookmarks]);

  /* ------------------------- what is shown ------------------------ */

  const leftOf = useCallback((s) => (s <= 0 ? null : pages[2 * s - 1] || null), [pages]);
  const rightOf = useCallback((s) => (s < 0 ? pages[0] : pages[2 * s] || null), [pages]);

  const spreadOfKey = useCallback((key) => {
    const index = book.indexOf(key);
    return index === undefined ? null : Math.floor((index + 1) / 2);
  }, [book]);

  const describe = useCallback((s) => {
    if (s === CLOSED_FRONT) return { folios: 'Cover', head: BOOK_TITLE };
    if (s === CLOSED_BACK) return { folios: 'Back cover', head: BOOK_TITLE };
    const l = leftOf(s);
    const r = rightOf(s);
    const folios = [l, r].filter((page) => page && page.key !== 'blank').map((page) => page.folio).join('–');
    const headOf = (page) => (page ? page.head || FRONT_NAMES[page.key] || '' : '');
    return { folios, head: headOf(r) || headOf(l) };
  }, [leftOf, rightOf, CLOSED_BACK]);

  let staticLeft = spread === CLOSED_BACK ? pages[pages.length - 1] : leftOf(spread);
  let staticRight = spread === CLOSED_BACK ? null : rightOf(spread);
  let front = null;
  let back = null;

  if (turn && turn.kind === 'soft') {
    if (turn.dir > 0) {
      staticRight = rightOf(turn.to);
      front = rightOf(turn.from);
      back = leftOf(turn.to);
    } else {
      staticLeft = leftOf(turn.to);
      front = leftOf(turn.from);
      back = rightOf(turn.to);
    }
  }

  const leaves = [];
  if (staticLeft) leaves.push({ page: staticLeft, role: 'left', left: 0 });
  if (staticRight) leaves.push({ page: staticRight, role: 'right', left: W });
  if (front) leaves.push({ page: front, role: 'front', left: turn.dir > 0 ? W : 0 });
  if (back) leaves.push({ page: back, role: 'back', left: 0 });

  // Keep the neighbouring spreads mounted but hidden, so starting a turn only
  // moves pages that are already laid out instead of building new ones.
  const shownKeys = new Set(leaves.map((leaf) => leaf.page.key));
  const around = [spread, turn ? turn.to : spread];
  around.forEach((s) => {
    if (s < 0 || s > LAST) return;
    [leftOf(s - 1), rightOf(s - 1), leftOf(s + 1), rightOf(s + 1)].forEach((page) => {
      if (!page || shownKeys.has(page.key)) return;
      shownKeys.add(page.key);
      leaves.push({ page, role: 'warm', left: page.index % 2 === 0 ? W : 0 });
    });
  });
  const roles = useRef({});
  roles.current = Object.fromEntries(leaves.map((leaf) => [leaf.role, leaf.page.key]));

  const leafRef = useCallback((key) => (node) => {
    if (node) leafNodes.current.set(key, node);
    else leafNodes.current.delete(key);
  }, []);
  const leafRefs = useRef(new Map());
  const refFor = (key) => {
    if (!leafRefs.current.has(key)) leafRefs.current.set(key, leafRef(key));
    return leafRefs.current.get(key);
  };

  /* --------------------------- drawing ---------------------------- */

  const nodeFor = (role) => leafNodes.current.get(roles.current[role]);

  const drawSoft = useCallback(() => {
    const e = engine.current;
    const frontNode = nodeFor('front');
    const backNode = nodeFor('back');
    const under = underShadeRef.current;
    const castFold = castWrapRef.current;
    const castInner = castRef.current;
    if (!frontNode || !backNode || !under || !castFold) return;

    const P = constrain(e.P, e.G, W, H);
    const f = fold(e.G, P, W, H);
    const forward = e.dir > 0;
    const Lb = forward ? mirror(W) : identity;
    const FS = forward ? translate(W) : mirror(W);
    const q = clamp((e.G[0] - P[0]) / (2 * e.G[0]), 0, 1);
    const rise = Math.sin(Math.PI * q);
    const settle = q < 0.5 ? 1 : clamp((1 - q) * 2.4, 0, 1);
    const frontFold = frontNode.parentNode.parentNode;
    const backFold = backNode.parentNode.parentNode;

    if (f.flat || f.lifted.length < 3) {
      setClip(frontFold, null);
      backNode.style.visibility = 'hidden';
      under.style.visibility = 'hidden';
      castFold.style.visibility = 'hidden';
      return;
    }
    backNode.style.visibility = 'visible';
    under.style.visibility = 'visible';
    castFold.style.visibility = 'visible';

    // Everything here only moves layers that are already drawn: the fold is a
    // rotated clipping frame, the flap is a transform, and the light and
    // shadows are fixed gradients placed along the fold. Nothing is redrawn.
    const mid = apply(FS, f.mid);
    const n = linear(FS, f.normal); // toward the lifted corner
    const t = [-n[1], n[0]];
    const staySide = halfPlane(mid, [-n[0], -n[1]], t);
    setClip(frontFold, staySide);
    setClip(backFold, staySide);
    setClip(castFold, staySide);

    // The lifted flap, reflected across the fold onto the spine's side.
    const flap = multiply(FS, multiply(f.reflect, Lb));
    backNode.style.transform = toCss(flap);

    // Light across the curl: a tight dark crease, a bright roll where the
    // paper turns toward the lamp, then the flat of the flap.
    const shade = backNode.lastElementChild;
    const nLeaf = linear(Lb, f.normal);
    shade.style.transform = toCss(band(apply(Lb, f.mid), nLeaf, [-nLeaf[1], nLeaf[0]], Math.max(f.width, 1)));
    shade.style.opacity = String(settle);

    // Shadow the lifted page throws on the page it uncovers.
    const reach = 22 + 90 * rise;
    const depth = q < 0.5 ? Math.min(1, 0.4 + q * 2) : settle;
    const left = forward ? W : 0;
    under.style.left = `${left}px`;
    underFoldRef.current.style.transform = toCss(halfPlane([mid[0] - left, mid[1]], n, t));
    underGradRef.current.style.transform = `scaleX(${(reach / 100).toFixed(4)})`;
    underGradRef.current.style.opacity = depth.toFixed(3);

    // Soft contact shadow around the flap: faint, slightly larger copies of
    // the flap itself, stacked beneath it.
    const lift = 1 + 1.6 * rise;
    Array.from(castInner.children).forEach((copy, i) => {
      const grow = CAST_LAYERS[i] * lift;
      const sx = 1 + (2 * grow) / W;
      const sy = 1 + (2 * grow) / H;
      const grown = [sx, 0, 0, sy, (W / 2) * (1 - sx), (H / 2) * (1 - sy)];
      copy.style.transform = toCss(multiply(translate(1.5, 2.5), multiply(flap, grown)));
    });
    castInner.style.opacity = String(Math.min(1, q * 5) * settle);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const drawHard = useCallback(() => {
    const e = engine.current;
    const a = clamp(e.a, 0, 1);
    const angle = -180 * a;
    const board = e.kind === 'front' ? frontBoardRef.current : backBoardRef.current;
    if (!board) return;
    board.style.transform = `rotateY(${angle.toFixed(3)}deg)`;

    // Faces dim as they tilt away from the reading light.
    const tilt = Math.sin(Math.PI * a);
    board.style.setProperty('--tilt', tilt.toFixed(3));
    board.style.setProperty('--turned', a > 0.5 ? '1' : '0');

    const shift = e.kind === 'front' ? lerp(-SHIFT, 0, smooth(a)) : lerp(0, SHIFT, smooth(a));
    shiftRef.current.style.transform = `translateX(${shift.toFixed(2)}px)`;

    const across = Math.cos(Math.PI * a); // +1 lying right, −1 lying left
    if (e.kind === 'front') {
      setFloor(floorLeftRef.current, Math.max(0, -across));
      setFloor(floorRightRef.current, 1);
    } else {
      setFloor(floorLeftRef.current, 1);
      setFloor(floorRightRef.current, Math.max(0, across));
    }

    // Shadow of the standing board on the pages next to the spine.
    const hard = hardShadeRef.current;
    const reach = (W + OV) * Math.abs(across);
    const onRight = a < 0.5;
    const alpha = 0.34 * tilt;
    hard.style.visibility = 'visible';
    hard.style.background = onRight
      ? `linear-gradient(90deg, transparent ${W}px, rgba(33,24,14,${alpha.toFixed(3)}) ${W + 1}px, rgba(33,24,14,${(alpha * 0.5).toFixed(3)}) ${(W + reach).toFixed(1)}px, transparent ${(W + reach + 70 * tilt + 12).toFixed(1)}px)`
      : `linear-gradient(270deg, transparent ${W}px, rgba(33,24,14,${alpha.toFixed(3)}) ${W + 1}px, rgba(33,24,14,${(alpha * 0.5).toFixed(3)}) ${(W + reach).toFixed(1)}px, transparent ${(W + reach + 70 * tilt + 12).toFixed(1)}px)`;
  }, []);

  const draw = useCallback(() => {
    if (engine.current.kind === 'soft') drawSoft();
    else if (engine.current.kind) drawHard();
  }, [drawSoft, drawHard]);

  /* ------------------------- animation ---------------------------- */

  const stopLoop = () => {
    cancelAnimationFrame(engine.current.raf);
    engine.current.raf = 0;
  };

  const finish = useCallback((completed) => {
    const e = engine.current;
    stopLoop();
    const target = completed ? e.to : e.from;
    e.mode = null;
    e.kind = null;
    setTurn(null);
    setSpread(target);
    if (completed && target >= 0) setOpened(true);
  }, []);

  const animateSoft = useCallback((to, duration, { lift = 0, ease = TURN_EASE, completed }) => {
    const e = engine.current;
    stopLoop();
    e.mode = 'anim';
    const from = e.P.slice();
    const start = performance.now();
    const time = reduced.current ? 1 : duration;
    const step = (now) => {
      const t = clamp((now - start) / time, 0, 1);
      const k = ease(t);
      e.P = [lerp(from[0], to[0], k), lerp(from[1], to[1], k) + lift * Math.sin(Math.PI * k)];
      drawSoft();
      if (t < 1) e.raf = requestAnimationFrame(step);
      else finish(completed);
    };
    e.raf = requestAnimationFrame(step);
  }, [drawSoft, finish]);

  // After a drag, the page keeps the speed the hand gave it and settles on a
  // critically damped spring: no fixed duration, no jolt at the start.
  const animateSpring = useCallback((target, velocity, completed) => {
    const e = engine.current;
    stopLoop();
    e.mode = 'anim';
    if (reduced.current) {
      e.P = target.slice();
      drawSoft();
      finish(completed);
      return;
    }
    let [x, y] = e.P;
    let [vx, vy] = velocity;
    let last = performance.now();
    const start = last;
    const step = (now) => {
      const dt = Math.min(0.034, (now - last) / 1000);
      last = now;
      const h = dt / 3;
      for (let i = 0; i < 3; i += 1) {
        vx += (-SPRING_K * (x - target[0]) - SPRING_C * vx) * h;
        vy += (-SPRING_K * (y - target[1]) - SPRING_C * vy) * h;
        x += vx * h;
        y += vy * h;
      }
      e.P = [x, y];
      drawSoft();
      const settled = Math.hypot(x - target[0], y - target[1]) < 1.5 && Math.hypot(vx, vy) < 30;
      if (!settled && now - start < 1400) {
        e.raf = requestAnimationFrame(step);
      } else {
        e.P = target.slice();
        drawSoft();
        finish(completed);
      }
    };
    e.raf = requestAnimationFrame(step);
  }, [drawSoft, finish]);

  const animateHard = useCallback((to, duration, completed) => {
    const e = engine.current;
    stopLoop();
    e.mode = 'anim';
    const from = e.a;
    const start = performance.now();
    const time = reduced.current ? 1 : duration * Math.max(0.35, Math.abs(to - from));
    const step = (now) => {
      const t = clamp((now - start) / time, 0, 1);
      e.a = lerp(from, to, BOARD_EASE(t));
      drawHard();
      if (t < 1) e.raf = requestAnimationFrame(step);
      else finish(completed);
    };
    e.raf = requestAnimationFrame(step);
  }, [drawHard, finish]);

  // Where a gesture ends: over the spine (or flicked) completes the turn.
  const release = useCallback((velocity = [0, 0]) => {
    const e = engine.current;
    if (e.kind === 'soft') {
      const [vx] = velocity;
      const passed = e.P[0] < 0;
      const complete = (passed || vx < -FLICK) && vx <= FLICK;
      const target = complete ? [-e.G[0], e.G[1]] : e.G.slice();
      animateSpring(target, velocity, complete);
    } else if (e.kind) {
      const v = velocity[0];
      const forwardish = e.dir > 0;
      const progress = forwardish ? e.a : 1 - e.a;
      const complete = (progress > 0.3 || v < -0.3) && v < 0.3;
      const to = complete === forwardish ? 1 : 0;
      animateHard(to, BOARD_MS, complete);
    }
  }, [animateSpring, animateHard]);

  /* --------------------------- turning ---------------------------- */

  const kindFor = useCallback((dir, s = spreadRef.current) => {
    if (dir > 0) {
      if (s === CLOSED_FRONT) return 'front';
      if (s < LAST) return 'soft';
      if (s === LAST) return 'back';
      return null;
    }
    if (s === CLOSED_BACK) return 'back';
    if (s > 0) return 'soft';
    if (s === 0) return 'front';
    return null;
  }, [LAST, CLOSED_BACK]);

  // Begin a turn. `plan` says what happens once the leaves are on screen.
  const begin = useCallback((dir, { to, G, mode = 'auto' } = {}) => {
    const e = engine.current;
    const s = spreadRef.current;
    const kind = kindFor(dir, s);
    if (!kind || e.kind) return false;

    e.kind = kind;
    e.dir = dir;
    e.from = s;
    e.plan = null;
    e.mode = mode;
    e.moves = [];
    if (kind === 'soft') {
      e.to = to !== undefined ? to : s + dir;
      e.G = G ? G.slice() : [W, H];
      e.P = e.G.slice();
    } else {
      e.to = s + dir;
      // a runs 0 → 1 as a board swings from the right-hand side to the left.
      e.a = dir > 0 ? 0 : 1;
    }
    setTurn({ kind, dir, from: e.from, to: e.to });
    return true;
  }, [kindFor]);

  const autoTurn = useCallback((dir, options = {}) => {
    const e = engine.current;
    if (e.mode === 'anim') {
      e.queue = () => autoTurn(dir, options);
      return;
    }
    if (e.kind === 'soft' && e.mode === 'peel' && e.dir === dir && options.to === undefined) {
      e.mode = 'auto';
      const target = [-e.G[0], e.G[1]];
      animateSoft(target, TURN_MS, { lift: e.G[1] > H / 2 ? -H * 0.12 : H * 0.12, completed: true });
      return;
    }
    if (e.kind === 'soft' && e.mode === 'peel') {
      // Drop the peel instantly and start the requested turn.
      e.kind = null;
      e.mode = null;
      stopLoop();
      setTurn(null);
      e.queue = () => autoTurn(dir, options);
      return;
    }
    const corner = options.corner === 'top' ? [W, 0] : [W, H];
    if (begin(dir, { ...options, G: corner, mode: 'auto' })) e.plan = 'auto';
  }, [begin, animateSoft]);

  // Move to any spread. Jumps of more than one spread can be undone.
  const jumpTo = useCallback((target, { record = true } = {}) => {
    const s = spreadRef.current;
    const goal = clamp(target, 0, LAST);
    if (s === CLOSED_FRONT || s === CLOSED_BACK) {
      autoTurn(s === CLOSED_FRONT ? 1 : -1);
      engine.current.queue = () => jumpTo(goal, { record: false });
      return;
    }
    if (goal === s) return;
    if (record && Math.abs(goal - s) > 1) setUndo({ spread: s, stamp: Date.now() });
    const dir = goal > s ? 1 : -1;
    autoTurn(dir, goal === s + dir ? {} : { to: goal });
  }, [autoTurn, LAST, CLOSED_BACK]);

  const go = useCallback((key) => {
    const target = spreadOfKey(key);
    if (target !== null) jumpTo(target);
  }, [spreadOfKey, jumpTo]);

  const ctx = useMemo(() => ({
    go,
    folio: book.folioOf,
    index: book.index,
    indexSplit: book.indexSplit,
  }), [go, book]);

  // The undo chip waits a while, then quietly leaves.
  useEffect(() => {
    if (!undo) return undefined;
    const timer = setTimeout(() => setUndo(null), 12000);
    return () => clearTimeout(timer);
  }, [undo]);

  const goBack = () => {
    if (!undo) return;
    const target = undo.spread;
    setUndo(null);
    jumpTo(target, { record: false });
  };

  /* --------------------------- bookmarks -------------------------- */

  const isOpen = spread >= 0 && spread <= LAST;
  const marked = (s) => bookmarks.some((b) => b.spread === s);

  const addBookmark = useCallback((s) => {
    setBookmarks((list) => {
      if (list.some((b) => b.spread === s)) return list;
      const used = new Set(list.map((b) => b.color));
      const color = RIBBONS.find((c) => !used.has(c)) || RIBBONS[list.length % RIBBONS.length];
      return [...list, { spread: s, color }].sort((a, b) => a.spread - b.spread);
    });
  }, []);

  const removeBookmark = useCallback((s) => {
    setBookmarks((list) => list.filter((b) => b.spread !== s));
  }, []);

  const toggleBookmark = useCallback(() => {
    const s = spreadRef.current;
    if (s < 0 || s > LAST) return;
    if (bookmarks.some((b) => b.spread === s)) removeBookmark(s);
    else addBookmark(s);
  }, [bookmarks, addBookmark, removeBookmark, LAST]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  // Once the leaves for a turn are mounted, put them in place before paint.
  useLayoutEffect(() => {
    // Clear anything a previous turn left on the leaves.
    leafNodes.current.forEach((node) => {
      const key = node.dataset.page;
      const role = Object.keys(roles.current).find((r) => roles.current[r] === key);
      if (role === 'front' || role === 'back') return;
      node.style.transform = '';
      node.style.visibility = '';
      setClip(node.parentNode?.parentNode, null);
      if (node.lastElementChild) {
        node.lastElementChild.style.transform = '';
        node.lastElementChild.style.opacity = '';
      }
    });

    const e = engine.current;
    if (!turn) {
      if (underShadeRef.current) underShadeRef.current.style.visibility = 'hidden';
      if (castWrapRef.current) castWrapRef.current.style.visibility = 'hidden';
      if (hardShadeRef.current) hardShadeRef.current.style.visibility = 'hidden';
      if (shiftRef.current) {
        const shift = spread === CLOSED_FRONT ? -SHIFT : spread === CLOSED_BACK ? SHIFT : 0;
        shiftRef.current.style.transform = `translateX(${shift}px)`;
      }
      setFloor(floorLeftRef.current, spread === CLOSED_FRONT ? 0 : 1);
      setFloor(floorRightRef.current, spread === CLOSED_BACK ? 0 : 1);
      [frontBoardRef.current, backBoardRef.current].forEach((board, i) => {
        if (!board) return;
        const turned = i === 0 ? spread !== CLOSED_FRONT : spread === CLOSED_BACK;
        board.style.transform = `rotateY(${turned ? -180 : 0}deg)`;
        board.style.setProperty('--tilt', '0');
        board.style.setProperty('--turned', turned ? '1' : '0');
      });
      if (e.queue) {
        const next = e.queue;
        e.queue = null;
        next();
      }
      return;
    }

    draw();
    if (e.plan === 'auto') {
      e.plan = null;
      if (turn.kind === 'soft') {
        const target = [-e.G[0], e.G[1]];
        const far = Math.abs(turn.to - turn.from) > 1;
        animateSoft(target, far ? JUMP_MS : TURN_MS, {
          lift: e.G[1] > H / 2 ? -H * 0.12 : H * 0.12,
          completed: true,
        });
      } else {
        animateHard(turn.dir > 0 ? 1 : 0, BOARD_MS, true);
      }
    } else if (e.plan === 'peel') {
      e.plan = null;
      runPeel(); // eslint-disable-line no-use-before-define
    }
  }, [turn, spread]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ------------------------- pointer input ------------------------ */

  const toBook = (clientX, clientY) => {
    const rect = blockRef.current.getBoundingClientRect();
    const k = rect.width / (2 * W);
    return [(clientX - rect.left) / k, (clientY - rect.top) / k, k];
  };
  const toFrame = (X, Y, dir) => [dir > 0 ? X - W : W - X, Y];

  // The corner eases toward the pointer while hovering near it.
  const runPeel = useCallback(() => {
    const e = engine.current;
    stopLoop();
    const step = () => {
      if (e.mode !== 'peel') return;
      const target = e.peelTarget || e.G;
      e.P = [lerp(e.P[0], target[0], 0.2), lerp(e.P[1], target[1], 0.2)];
      drawSoft();
      const settled = Math.hypot(e.P[0] - e.G[0], e.P[1] - e.G[1]) < 0.6;
      if (!e.peelTarget && settled) {
        e.kind = null;
        e.mode = null;
        setTurn(null);
        return;
      }
      e.raf = requestAnimationFrame(step);
    };
    e.raf = requestAnimationFrame(step);
  }, [drawSoft]);

  const peelAt = (X, Y) => {
    const e = engine.current;
    if (reduced.current) return;
    if (e.mode && e.mode !== 'peel') return;
    const s = spreadRef.current;
    const onRight = X > W;
    const dir = onRight ? 1 : -1;
    const [u, y] = toFrame(X, Y, dir);
    const near = kindFor(dir, s) === 'soft' && u > W - 120 && u <= W + 6 && y > -6 && y < H + 6
      && (y < 120 || y > H - 120);
    if (!near) {
      if (e.mode === 'peel') e.peelTarget = null;
      return;
    }
    const corner = [W, y < H / 2 ? 0 : H];
    let v = [u - corner[0], y - corner[1]];
    const length = Math.hypot(v[0], v[1]) || 1;
    if (length < 4) v = [-1, corner[1] ? -0.6 : 0.6];
    const unit = [v[0] / (Math.hypot(v[0], v[1]) || 1), v[1] / (Math.hypot(v[0], v[1]) || 1)];
    const reach = clamp(length * 0.55, 26, 64);
    const target = [corner[0] + unit[0] * reach, corner[1] + unit[1] * reach];

    if (e.mode === 'peel' && e.dir === dir && e.G[1] === corner[1]) {
      e.peelTarget = target;
      return;
    }
    if (e.mode === 'peel') return; // let the other corner settle first
    if (e.kind) return;
    e.peelTarget = target;
    if (begin(dir, { G: corner, mode: 'peel' })) e.plan = 'peel';
  };

  const onPointerMove = (event) => {
    if (idle) setIdle(false);
    const e = engine.current;
    const [X, Y, k] = toBook(event.clientX, event.clientY);

    if (e.press) {
      const dx = event.clientX - e.press.x;
      const dy = event.clientY - e.press.y;
      if (!e.press.dragging && Math.hypot(dx, dy) > 6) {
        e.press.dragging = true;
        if (e.kind === 'soft' && e.mode === 'peel' && e.dir === e.press.dir) {
          e.mode = 'drag';
          stopLoop();
          const [pu, py] = toFrame(e.press.X, e.press.Y, e.dir);
          e.press.offset = [e.P[0] - pu, e.P[1] - py];
        } else if (!e.kind) {
          const [pu, py] = toFrame(e.press.X, e.press.Y, e.press.dir);
          const gy = py < H * 0.2 ? 0 : py > H * 0.8 ? H : clamp(py, 0, H);
          if (e.press.kind === 'soft') {
            begin(e.press.dir, { G: [W, gy], mode: 'drag' });
            e.press.offset = [W - pu, gy - py];
          } else {
            begin(e.press.dir, { mode: 'drag' });
          }
        } else {
          e.press = null;
          return;
        }
      }
      if (e.press.dragging && e.mode === 'drag') {
        const now = performance.now();
        if (e.kind === 'soft') {
          const [u, y] = toFrame(X, Y, e.dir);
          e.P = [u + e.press.offset[0], y + e.press.offset[1]];
          e.moves.push({ t: now, x: e.P[0], y: e.P[1] });
          drawSoft();
        } else {
          const travel = (event.clientX - e.press.x) / k / ((W + OV) * 1.15);
          e.a = clamp(e.dir > 0 ? -travel : 1 - travel, 0, 1);
          e.moves.push({ t: now, x: e.dir > 0 ? -e.a : e.a, y: 0 });
          drawHard();
        }
        e.moves = e.moves.slice(-8);
      }
      return;
    }

    if (event.pointerType === 'mouse') peelAt(X, Y);
    const stage = stageRef.current;
    const s = spreadRef.current;
    const dir = X > W ? 1 : -1;
    const [u] = toFrame(X, Y, dir);
    const inside = Y >= -OV && Y <= H + OV && u >= -OV && u <= W + OV;
    const kind = inside && !event.target.closest('a, button') ? kindFor(dir, s) : null;
    stage.style.cursor = !kind ? '' : kind !== 'soft' || u > W * 0.5 ? 'pointer' : 'grab';
  };

  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    if (event.target.closest('a, button, input, select')) return;
    if (menu) setMenu(null);
    const e = engine.current;
    const [X, Y] = toBook(event.clientX, event.clientY);
    const dir = X > W ? 1 : -1;
    const kind = kindFor(dir);
    const [u] = toFrame(X, Y, dir);
    if (!kind || Y < -OV || Y > H + OV || u < -OV || u > W + OV) return;
    if (e.mode === 'anim' || (e.kind && e.mode !== 'peel')) {
      e.queue = () => autoTurn(dir, { corner: Y < H / 2 ? 'top' : 'bottom' });
      return;
    }
    e.press = { x: event.clientX, y: event.clientY, X, Y, dir, kind, dragging: false, t: performance.now() };
    stageRef.current.setPointerCapture?.(event.pointerId);
  };

  const onPointerUp = (event) => {
    const e = engine.current;
    const press = e.press;
    e.press = null;
    if (!press) return;
    stageRef.current.releasePointerCapture?.(event.pointerId);
    if (press.dragging && e.mode === 'drag') {
      // Speed over the last ~100 ms of movement. Sparse pointer events fall
      // back to the previous sample; a pause before letting go means no flick.
      const moves = e.moves;
      let velocity = [0, 0];
      const last = moves[moves.length - 1];
      if (last && performance.now() - last.t < 120) {
        let first = moves.find((m) => last.t - m.t <= 100);
        if (first === last && moves.length > 1 && last.t - moves[moves.length - 2].t < 250) {
          first = moves[moves.length - 2];
        }
        if (first !== last) {
          const span = Math.max(1, last.t - first.t);
          velocity = [((last.x - first.x) / span) * 1000, ((last.y - first.y) / span) * 1000];
        }
      }
      if (e.kind !== 'soft') velocity = [velocity[0] / 1000 * W, 0]; // board travel is in fractions of a turn
      release(velocity);
      return;
    }
    if (press.dragging) return;
    // A click. Near the outer edge (or anywhere on a cover) turns the page.
    const [u] = toFrame(press.X, press.Y, press.dir);
    if (press.kind !== 'soft' || u > W * 0.5) {
      autoTurn(press.dir, { corner: press.Y < H / 2 ? 'top' : 'bottom' });
    }
  };

  const onPointerLeave = () => {
    const e = engine.current;
    if (e.mode === 'peel') e.peelTarget = null;
    if (stageRef.current) stageRef.current.style.cursor = '';
  };

  /* --------------------------- keyboard --------------------------- */

  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'Escape') {
        setMenu(null);
        return;
      }
      if (event.target.closest?.('input, select, textarea')) return;
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        autoTurn(1);
      } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        autoTurn(-1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        go('contents');
      } else if (event.key === 'b' || event.key === 'B') {
        toggleBookmark();
      } else if (event.key === 'f' || event.key === 'F') {
        toggleFullscreen();
      } else if ((event.key === 'u' || event.key === 'U') && undo) {
        goBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }); // re-bound each render so it always sees the latest state

  // Menus close when the reader clicks elsewhere.
  useEffect(() => {
    if (!menu) return undefined;
    const close = (event) => {
      if (!dockRef.current?.contains(event.target)) setMenu(null);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [menu]);

  // Reading controls step back when the reader is reading.
  useEffect(() => {
    if (idle) return undefined;
    const timer = setTimeout(() => setIdle(true), 2600);
    return () => clearTimeout(timer);
  }, [idle, spread]);

  /* --------------------------- rendering -------------------------- */

  const shown = turn && turn.kind === 'soft' ? turn.from : spread;
  const leftLeaves = clamp(shown, 0, LAST);
  const rightLeaves = shown === CLOSED_BACK ? 0 : LAST - clamp(shown, 0, LAST);
  const frontBoardUp = spread === CLOSED_FRONT || (turn && turn.kind === 'front');
  const backBoardUp = spread === CLOSED_BACK || (turn && turn.kind === 'back');
  const bookOpen = shown >= 0 && shown <= LAST && (!turn || turn.kind === 'soft');

  const here = describe(spread);
  const liveLabel = spread === CLOSED_FRONT || spread === CLOSED_BACK
    ? here.folios
    : `Pages ${here.folios.replace('–', ' and ')}`;

  const scrubValue = preview ?? clamp(spread, 0, LAST);
  const scrubInfo = describe(scrubValue);
  // Positions along the scrubber, matching where the thumb's centre sits.
  const pct = (s) => `calc(7px + (100% - 14px) * ${(s / LAST).toFixed(4)})`;
  const commitScrub = () => {
    if (preview === null) return;
    const target = preview;
    setPreview(null);
    jumpTo(target);
  };

  // Ribbons: on the open spread one drapes over the page and then slides up
  // out of the way; the others peek above the pages on the side they are on.
  const tabs = [];
  if (bookOpen) {
    const ahead = bookmarks.filter((b) => b.spread > shown);
    const behind = bookmarks.filter((b) => b.spread < shown).reverse();
    ahead.forEach((b, k) => tabs.push({ ...b, x: W + 58 + ((k * 54) % 360) }));
    behind.forEach((b, k) => tabs.push({ ...b, x: W - 74 - ((k * 54) % 360) }));
  }
  const drape = !turn && isOpen ? bookmarks.find((b) => b.spread === spread) : null;
  const drapeX = rightOf(spread) ? W + 446 : 78;

  const chapterTicks = CHAPTERS
    .map((chapter) => ({ ...chapter, spread: spreadOfKey(chapter.key) }))
    .filter((chapter) => chapter.spread !== null);

  return (
    <div className={`bk-room ${idle && !menu ? 'is-idle' : ''} ${spread === CLOSED_FRONT ? 'is-closed' : ''}`}>
      <Desk />
      <div
        ref={stageRef}
        className="bk-stage"
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerLeave}
      >
        <div className="bk-scale" style={{ transform: `scale(${scale})` }}>
          <div ref={shiftRef} className="bk-shift">
            <div ref={blockRef} className="bk-block" style={{ width: 2 * W, height: H }} role="region" aria-label={BOOK_TITLE}>
              <div ref={floorLeftRef} className="bk-floor is-left" style={{ left: -OV, top: -OV, width: W + OV, height: H + 2 * OV }} />
              <div ref={floorRightRef} className="bk-floor is-right" style={{ left: W, top: -OV, width: W + OV, height: H + 2 * OV }} />

              <div
                ref={backBoardRef}
                className="bk-board is-back"
                style={{ left: W, top: -OV, width: W + OV, height: H + 2 * OV, zIndex: backBoardUp ? 40 : 1 }}
              >
                <div className="bk-board-face is-inside"><Pastedown side="right" /></div>
                <div className="bk-board-face is-outside is-flipped"><BackCover /></div>
                <div className="bk-board-edge" />
              </div>

              <div
                className={`bk-thickness ${spread === CLOSED_FRONT && !turn ? '' : 'is-hidden'}`}
                style={{ left: W, top: -OV, width: W + OV, height: H + 2 * OV }}
                aria-hidden="true"
              >
                <span className="is-back" />
                <span className="is-pages" />
                <span className="is-board" />
              </div>

              <div
                ref={frontBoardRef}
                className="bk-board is-front"
                style={{ left: W, top: -OV, width: W + OV, height: H + 2 * OV, zIndex: frontBoardUp ? 40 : 1 }}
              >
                <div className="bk-board-face is-outside"><FrontCover /></div>
                <div className="bk-board-face is-inside is-flipped"><Pastedown side="left" /></div>
                <div className="bk-board-edge" />
              </div>

              {bookOpen && (
                <>
                  <span className="bk-headband is-top" aria-hidden="true" />
                  <span className="bk-headband is-bottom" aria-hidden="true" />
                </>
              )}
              <Sheets side="left" count={shown === CLOSED_FRONT ? 0 : leftLeaves} />
              <Sheets side="right" count={shown === CLOSED_BACK ? 0 : rightLeaves} />

              {tabs.map((b) => {
                const info = describe(b.spread);
                return (
                  <button
                    key={b.spread}
                    type="button"
                    className="bk-mark is-tab"
                    style={{ left: b.x }}
                    onClick={() => jumpTo(b.spread)}
                    aria-label={`Go to bookmark, ${info.head}, pages ${info.folios}`}
                    data-tip={`${info.head} · ${info.folios}`}
                  >
                    <Ribbon color={b.color} folio={info.folios.split('–')[0]} />
                  </button>
                );
              })}

              {leaves.map(({ page, role, left }) => (
                <div key={page.key} className={`bk-slot is-${role}`}>
                  <div className="bk-fold">
                    <div className="bk-fold-inner">
                      <Leaf ref={refFor(page.key)} page={page} ctx={ctx} left={left} fontsVersion={fontsVersion} />
                    </div>
                  </div>
                </div>
              ))}

              {drape && (
                <button
                  key={`drape-${drape.spread}`}
                  type="button"
                  className="bk-mark is-drape"
                  style={{ left: drapeX }}
                  onClick={() => removeBookmark(drape.spread)}
                  aria-label="Remove the bookmark on these pages"
                  data-tip="Bookmarked · click to remove"
                >
                  <Ribbon color={drape.color} folio={here.folios.split('–')[0]} drape />
                </button>
              )}

              <div ref={underShadeRef} className="bk-under-shade">
                <div ref={underFoldRef} className="bk-under-fold">
                  <span ref={underGradRef} className="bk-under-grad" />
                </div>
              </div>
              <div ref={castWrapRef} className="bk-cast bk-fold">
                <div ref={castRef} className="bk-fold-inner">
                  {CAST_LAYERS.map((grow) => <span key={grow} className="bk-cast-copy" />)}
                </div>
              </div>
              <div ref={hardShadeRef} className="bk-hard-shade" />
            </div>
          </div>
        </div>
      </div>

      <p className={`bk-hint ${opened ? 'is-gone' : ''}`}>
        Open the cover, or press <kbd>→</kbd>
      </p>

      <div className="bk-dock" ref={dockRef}>
        {undo && (
          <button type="button" className="bk-undo" onClick={goBack} key={undo.stamp}>
            <Icon name="undo" />
            <span>Back to {describe(undo.spread).head}</span>
            <em>{describe(undo.spread).folios}</em>
          </button>
        )}

        {menu === 'marks' && (
          <div className="bk-pop" role="dialog" aria-label="Bookmarks">
            <div className="bk-pop-head">
              <span>Bookmarks</span>
              <button type="button" onClick={() => setMenu(null)} aria-label="Close"><Icon name="close" /></button>
            </div>
            {bookmarks.length ? (
              <ul className="bk-marklist">
                {bookmarks.map((b) => {
                  const info = describe(b.spread);
                  return (
                    <li key={b.spread} className={b.spread === spread ? 'is-here' : ''}>
                      <button type="button" className="bk-marklist-go" onClick={() => { setMenu(null); jumpTo(b.spread); }}>
                        <i style={{ '--silk': b.color }} aria-hidden="true" />
                        <span>{info.head}</span>
                        <em>{info.folios}</em>
                      </button>
                      <button type="button" className="bk-marklist-remove" onClick={() => removeBookmark(b.spread)} aria-label={`Remove bookmark, pages ${info.folios}`}>
                        <Icon name="close" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="bk-pop-empty">No bookmarks yet. Mark these pages with the ribbon button, or press <kbd>B</kbd>.</p>
            )}
            <form
              className="bk-pop-add"
              onSubmit={(event) => {
                event.preventDefault();
                if (pick === '') return;
                addBookmark(Number(pick));
                setPick('');
              }}
            >
              <label htmlFor="bk-pick">Add a bookmark at</label>
              <div>
                <select id="bk-pick" value={pick} onChange={(event) => setPick(event.target.value)}>
                  <option value="">Choose pages…</option>
                  {Array.from({ length: LAST + 1 }, (_, s) => s).filter((s) => !marked(s)).map((s) => {
                    const info = describe(s);
                    return <option key={s} value={s}>{info.folios} · {info.head}</option>;
                  })}
                </select>
                <button type="submit" disabled={pick === ''}>Add</button>
              </div>
            </form>
          </div>
        )}

        {menu === 'help' && (
          <div className="bk-pop is-help" role="dialog" aria-label="Reading shortcuts">
            <div className="bk-pop-head">
              <span>Reading this journal</span>
              <button type="button" onClick={() => setMenu(null)} aria-label="Close"><Icon name="close" /></button>
            </div>
            <dl className="bk-keys">
              <div><dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Turn the page</dd></div>
              <div><dt>Drag a corner</dt><dd>Turn it by hand; let go to finish</dd></div>
              <div><dt><kbd>Home</kbd></dt><dd>Contents</dd></div>
              <div><dt><kbd>B</kbd></dt><dd>Bookmark these pages</dd></div>
              <div><dt><kbd>U</kbd></dt><dd>Back to where you jumped from</dd></div>
              <div><dt><kbd>F</kbd></dt><dd>Full screen</dd></div>
            </dl>
          </div>
        )}

        <nav className="bk-controls" aria-label="Book controls">
          <button type="button" onClick={() => autoTurn(-1)} disabled={spread === CLOSED_FRONT} aria-label="Previous page">
            <Icon name="prev" />
          </button>
          <button type="button" className="bk-controls-text" onClick={() => go('contents')}>Contents</button>

          <div className={`bk-scrub ${preview !== null ? 'is-scrubbing' : ''}`}>
            <span className="bk-scrub-head">{here.head}</span>
            <div className="bk-scrub-track">
              {chapterTicks.map((chapter) => (
                <i key={chapter.key} className="bk-scrub-tick" style={{ left: pct(chapter.spread) }} />
              ))}
              {bookmarks.map((b) => (
                <i key={b.spread} className="bk-scrub-mark" style={{ left: pct(b.spread), '--silk': b.color }} />
              ))}
              <input
                type="range"
                min={0}
                max={LAST}
                step={1}
                value={scrubValue}
                aria-label="Go to page"
                aria-valuetext={`${scrubInfo.head}, pages ${scrubInfo.folios}`}
                onChange={(event) => setPreview(Number(event.target.value))}
                onPointerUp={commitScrub}
                onKeyUp={commitScrub}
                onBlur={commitScrub}
                style={{ '--fill': pct(clamp(spread, 0, LAST)) }}
              />
              {preview !== null && (
                <span className="bk-scrub-bubble" style={{ left: pct(preview) }}>
                  <strong>{scrubInfo.head}</strong>
                  <em>{scrubInfo.folios}</em>
                </span>
              )}
            </div>
            <span className="bk-scrub-folio">{here.folios}</span>
          </div>

          <button
            type="button"
            className={marked(spread) ? 'is-on' : ''}
            onClick={toggleBookmark}
            disabled={!isOpen}
            aria-pressed={marked(spread)}
            aria-label={marked(spread) ? 'Remove bookmark' : 'Bookmark these pages'}
            title={marked(spread) ? 'Remove bookmark (B)' : 'Bookmark these pages (B)'}
          >
            <Icon name="mark" />
          </button>
          <button
            type="button"
            className={menu === 'marks' ? 'is-active' : ''}
            onClick={() => setMenu(menu === 'marks' ? null : 'marks')}
            aria-expanded={menu === 'marks'}
            aria-label="Bookmarks"
            title="Bookmarks"
          >
            <Icon name="marks" />
            {bookmarks.length > 0 && <span className="bk-count">{bookmarks.length}</span>}
          </button>
          <span className="bk-controls-rule" aria-hidden="true" />
          <a href={RESUME} target="_blank" rel="noreferrer" aria-label="Résumé (PDF)" title="Résumé (PDF)">
            <Icon name="doc" />
          </a>
          {typeof document !== 'undefined' && document.fullscreenEnabled && (
            <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Leave full screen' : 'Full screen'} title="Full screen (F)">
              <Icon name={fullscreen ? 'exit' : 'full'} />
            </button>
          )}
          <button
            type="button"
            className={menu === 'help' ? 'is-active' : ''}
            onClick={() => setMenu(menu === 'help' ? null : 'help')}
            aria-expanded={menu === 'help'}
            aria-label="Reading shortcuts"
            title="Shortcuts"
          >
            <Icon name="help" />
          </button>
          <button type="button" onClick={() => autoTurn(1)} disabled={spread === CLOSED_BACK} aria-label="Next page">
            <Icon name="next" />
          </button>
        </nav>
      </div>
      <p className="bk-visually-hidden" aria-live="polite">{liveLabel}</p>
    </div>
  );
}
