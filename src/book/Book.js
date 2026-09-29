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
import {
  apply,
  clamp,
  constrain,
  easeInOut,
  easeOut,
  fold,
  gradientFrom,
  identity,
  lerp,
  mirror,
  multiply,
  polygonCss,
  toCss,
  translate,
} from './geometry';
import './book.css';

// Page and board dimensions, in the book's own units. The whole object is
// scaled to the window afterwards, so pagination never changes.
export const W = 540;
export const H = 760;
const OV = 14; // how far the boards overhang the text block
const CAST_PAD = 160;
const SHIFT = (W + OV) / 2; // closed books sit centred on their cover
const CLOSED_FRONT = -1;

const smooth = (a) => (1 - Math.cos(Math.PI * a)) / 2;
const prefersReducedMotion = () => (
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
);

/* ------------------------------------------------------------------ */
/* A single leaf side                                                  */
/* ------------------------------------------------------------------ */

const Leaf = memo(forwardRef(function Leaf({ page, ctx, left, fontsVersion }, ref) {
  const bodyRef = useRef(null);
  const recto = page.index % 2 === 0;

  // Keep every page inside its text block: if a font renders wider than
  // expected, ease the type down a little rather than letting it spill.
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    let fit = 1;
    body.style.setProperty('--fit', '1');
    while (body.scrollHeight > body.clientHeight + 1 && fit > 0.8) {
      fit -= 0.015;
      body.style.setProperty('--fit', fit.toFixed(3));
    }
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

  const stageRef = useRef(null);
  const blockRef = useRef(null);
  const shiftRef = useRef(null);
  const leafNodes = useRef(new Map());
  const underShadeRef = useRef(null);
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
      const next = Math.min((window.innerWidth - 96) / width, (window.innerHeight - 150) / height);
      setScale(clamp(next, 0.45, 1.5));
    };
    fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setFontsVersion((v) => v + 1));
    }
    const state = engine.current;
    return () => {
      document.body.classList.remove('is-reading');
      window.removeEventListener('resize', fit);
      cancelAnimationFrame(state.raf);
    };
  }, []);

  /* ------------------------- what is shown ------------------------ */

  const leftOf = useCallback((s) => (s <= 0 ? null : pages[2 * s - 1] || null), [pages]);
  const rightOf = useCallback((s) => (s < 0 ? pages[0] : pages[2 * s] || null), [pages]);

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
    const cast = castRef.current;
    const castWrap = castWrapRef.current;
    if (!frontNode || !backNode || !under || !cast) return;

    const P = constrain(e.P, e.G, W, H);
    e.P = P;
    const f = fold(e.G, P, W, H);
    const forward = e.dir > 0;
    const Lf = forward ? identity : mirror(W);
    const Lb = forward ? mirror(W) : identity;
    const FS = forward ? translate(W) : mirror(W);
    const q = clamp((e.G[0] - P[0]) / (2 * e.G[0]), 0, 1);
    const rise = Math.sin(Math.PI * q);
    const settle = q < 0.5 ? 1 : clamp((1 - q) * 2.4, 0, 1);

    frontNode.style.clipPath = polygonCss(f.stay.map((p) => apply(Lf, p)));

    if (f.flat || f.lifted.length < 3) {
      backNode.style.visibility = 'hidden';
      under.style.visibility = 'hidden';
      castWrap.style.visibility = 'hidden';
      return;
    }
    backNode.style.visibility = 'visible';
    under.style.visibility = 'visible';
    castWrap.style.visibility = 'visible';

    // The lifted flap, laid back over the page.
    backNode.style.transform = toCss(multiply(FS, multiply(f.reflect, Lb)));
    backNode.style.clipPath = polygonCss(f.lifted.map((p) => apply(Lb, p)));

    // Light across the curl: a tight dark crease, a soft highlight where the
    // paper rolls toward the light, then the flat of the flap.
    const w = Math.max(f.width, 1);
    const shade = backNode.lastElementChild;
    shade.style.opacity = String(settle);
    shade.style.background = gradientFrom(W, H, apply(Lb, f.mid), [Lb[0] * f.normal[0], f.normal[1]], [
      [0, 'rgba(52, 38, 22, 0.24)'],
      [Math.min(7, w * 0.08), 'rgba(52, 38, 22, 0.08)'],
      [w * 0.17, 'rgba(255, 252, 244, 0.26)'],
      [w * 0.45, 'rgba(255, 252, 244, 0)'],
      [w * 0.82, 'rgba(52, 38, 22, 0)'],
      [w, 'rgba(52, 38, 22, 0.07)'],
    ]);

    // Shadow the lifted page throws on the page it uncovers.
    const reach = 22 + 90 * rise;
    const depth = 0.42 * (q < 0.5 ? Math.min(1, 0.4 + q * 2) : settle);
    under.style.left = `${forward ? W : 0}px`;
    under.style.clipPath = polygonCss(f.lifted.map((p) => apply(Lf, p)));
    under.style.background = gradientFrom(W, H, apply(Lf, f.mid), [Lf[0] * f.normal[0], f.normal[1]], [
      [0, `rgba(33, 24, 14, ${depth.toFixed(3)})`],
      [reach * 0.35, `rgba(33, 24, 14, ${(depth * 0.45).toFixed(3)})`],
      [reach, 'rgba(33, 24, 14, 0)'],
    ]);

    // Soft contact shadow around the flap on whatever lies beneath it.
    const FR = multiply(FS, f.reflect);
    cast.style.clipPath = polygonCss(f.lifted.map((p) => {
      const [x, y] = apply(FR, p);
      return [x + CAST_PAD, y + CAST_PAD];
    }));
    castWrap.style.opacity = String(Math.min(1, q * 5) * settle);
    castWrap.style.filter = `blur(${(5 + 9 * rise).toFixed(1)}px)`;
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

    if (e.kind === 'front') {
      floorLeftRef.current.style.opacity = String(smooth(a));
      floorRightRef.current.style.opacity = '1';
    } else {
      floorLeftRef.current.style.opacity = '1';
      floorRightRef.current.style.opacity = String(1 - smooth(a));
    }

    // Shadow of the standing board on the pages next to the spine.
    const hard = hardShadeRef.current;
    const reach = (W + OV) * Math.abs(Math.cos(Math.PI * a));
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

  const animateSoft = useCallback((to, duration, { lift = 0, ease = easeOut, completed }) => {
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

  const animateHard = useCallback((to, duration, completed) => {
    const e = engine.current;
    stopLoop();
    e.mode = 'anim';
    const from = e.a;
    const start = performance.now();
    const time = reduced.current ? 1 : duration * Math.max(0.35, Math.abs(to - from));
    const step = (now) => {
      const t = clamp((now - start) / time, 0, 1);
      e.a = lerp(from, to, easeInOut(t));
      drawHard();
      if (t < 1) e.raf = requestAnimationFrame(step);
      else finish(completed);
    };
    e.raf = requestAnimationFrame(step);
  }, [drawHard, finish]);

  // Where a gesture ends: over the spine (or flicked) completes the turn.
  const release = useCallback((velocity = 0) => {
    const e = engine.current;
    if (e.kind === 'soft') {
      const passed = e.P[0] < 0;
      const flicked = velocity < -0.35;
      const pulledBack = velocity > 0.35;
      const complete = (passed || flicked) && !pulledBack;
      const target = complete ? [-e.G[0], e.G[1]] : e.G.slice();
      const distance = Math.hypot(target[0] - e.P[0], target[1] - e.P[1]);
      animateSoft(target, 240 + 420 * (distance / (2 * W)), { completed: complete });
    } else if (e.kind) {
      const forwardish = e.dir > 0;
      const progress = forwardish ? e.a : 1 - e.a;
      const complete = (progress > 0.3 || velocity < -0.3) && velocity < 0.3;
      const to = complete === forwardish ? 1 : 0;
      animateHard(to, 1150, complete);
    }
  }, [animateSoft, animateHard]);

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
      animateSoft(target, 820, { lift: e.G[1] > H / 2 ? -H * 0.14 : H * 0.14, ease: easeInOut, completed: true });
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

  const go = useCallback((key) => {
    const index = book.indexOf(key);
    if (index === undefined) return;
    const target = Math.floor((index + 1) / 2);
    const s = spreadRef.current;
    if (s === CLOSED_FRONT || s === CLOSED_BACK) {
      autoTurn(s === CLOSED_FRONT ? 1 : -1);
      engine.current.queue = () => go(key);
      return;
    }
    if (target === s) return;
    autoTurn(target > s ? 1 : -1, { to: target });
  }, [book, autoTurn, CLOSED_BACK]);

  const ctx = useMemo(() => ({
    go,
    folio: book.folioOf,
    index: book.index,
    indexSplit: book.indexSplit,
  }), [go, book]);

  // Once the leaves for a turn are mounted, put them in place before paint.
  useLayoutEffect(() => {
    // Clear anything a previous turn left on the leaves.
    leafNodes.current.forEach((node) => {
      const key = node.dataset.page;
      const role = Object.keys(roles.current).find((r) => roles.current[r] === key);
      if (role === 'front' || role === 'back') return;
      node.style.clipPath = '';
      node.style.transform = '';
      node.style.visibility = '';
      if (node.lastElementChild) {
        node.lastElementChild.style.background = '';
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
      if (floorLeftRef.current) floorLeftRef.current.style.opacity = spread === CLOSED_FRONT ? '0' : '1';
      if (floorRightRef.current) floorRightRef.current.style.opacity = spread === CLOSED_BACK ? '0' : '1';
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
        animateSoft(target, far ? 980 : 820, {
          lift: e.G[1] > H / 2 ? -H * 0.14 : H * 0.14,
          ease: easeInOut,
          completed: true,
        });
      } else {
        animateHard(turn.dir > 0 ? 1 : 0, 1150, true);
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
          e.moves.push({ t: now, v: e.P[0] });
          drawSoft();
        } else {
          const travel = (event.clientX - e.press.x) / k / ((W + OV) * 1.15);
          e.a = clamp(e.dir > 0 ? -travel : 1 - travel, 0, 1);
          e.moves.push({ t: now, v: e.dir > 0 ? -e.a : e.a });
          drawHard();
        }
        e.moves = e.moves.filter((m) => now - m.t < 90);
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
    if (event.target.closest('a, button, input')) return;
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
      const moves = e.moves;
      let velocity = 0;
      if (moves.length > 1) {
        const first = moves[0];
        const last = moves[moves.length - 1];
        velocity = (last.v - first.v) / Math.max(1, last.t - first.t);
      }
      if (e.kind !== 'soft') velocity *= W; // board travel is in fractions of a turn
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
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        autoTurn(1);
      } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        autoTurn(-1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        go('contents');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [autoTurn, go]);

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
  const edge = (count) => (count ? 1.5 + count * 0.34 : 0);
  const frontBoardUp = spread === CLOSED_FRONT || (turn && turn.kind === 'front');
  const backBoardUp = spread === CLOSED_BACK || (turn && turn.kind === 'back');

  const label = (() => {
    if (spread === CLOSED_FRONT) return 'Cover';
    if (spread === CLOSED_BACK) return 'Back cover';
    const l = leftOf(spread);
    const r = rightOf(spread);
    if (l && r) return `${l.folio}–${r.folio}`;
    return (l || r)?.folio || '';
  })();

  const liveLabel = spread === CLOSED_FRONT || spread === CLOSED_BACK
    ? label
    : `Pages ${label.replace('–', ' and ')}`;

  return (
    <div className={`bk-room ${idle ? 'is-idle' : ''}`}>
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
                ref={frontBoardRef}
                className="bk-board is-front"
                style={{ left: W, top: -OV, width: W + OV, height: H + 2 * OV, zIndex: frontBoardUp ? 40 : 1 }}
              >
                <div className="bk-board-face is-outside"><FrontCover /></div>
                <div className="bk-board-face is-inside is-flipped"><Pastedown side="left" /></div>
                <div className="bk-board-edge" />
              </div>

              <div className="bk-stack is-left" style={{ width: edge(leftLeaves), left: -edge(leftLeaves) }} />
              <div className="bk-stack is-right" style={{ width: edge(rightLeaves), left: 2 * W }} />
              <div className={`bk-ribbon ${spread === CLOSED_BACK || (turn && turn.kind === 'back') ? 'is-hidden' : ''}`} />

              {leaves.map(({ page, role, left }) => (
                <div key={page.key} className={`bk-slot is-${role}`}>
                  <Leaf ref={refFor(page.key)} page={page} ctx={ctx} left={left} fontsVersion={fontsVersion} />
                </div>
              ))}

              <div ref={underShadeRef} className="bk-under-shade" />
              <div ref={castWrapRef} className="bk-cast">
                <div ref={castRef} className="bk-cast-shape" style={{ left: -CAST_PAD, top: -CAST_PAD, width: 2 * W + 2 * CAST_PAD, height: H + 2 * CAST_PAD }} />
              </div>
              <div ref={hardShadeRef} className="bk-hard-shade" />
            </div>
          </div>
        </div>
      </div>

      <p className={`bk-hint ${opened ? 'is-gone' : ''}`}>
        Open the cover, or press <kbd>→</kbd>
      </p>

      <nav className="bk-controls" aria-label="Book controls">
        <button type="button" onClick={() => autoTurn(-1)} disabled={spread === CLOSED_FRONT} aria-label="Previous page">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5L5.5 8l4.5 4.5" /></svg>
        </button>
        <button type="button" className="bk-controls-text" onClick={() => go('contents')}>Contents</button>
        <span className="bk-controls-folio">{label}</span>
        <a className="bk-controls-text" href={RESUME} target="_blank" rel="noreferrer">Résumé</a>
        <button type="button" onClick={() => autoTurn(1)} disabled={spread === CLOSED_BACK} aria-label="Next page">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5" /></svg>
        </button>
      </nav>
      <p className="bk-visually-hidden" aria-live="polite">{liveLabel}</p>
    </div>
  );
}
