// Page-turn geometry.
//
// A turning leaf is modelled as a sheet folded along a straight line. All
// maths happens in a "leaf frame": the leaf lies flat on u ∈ [0, W], y ∈ [0, H]
// with the spine at u = 0. The point the reader grabbed (G) is carried to the
// pointer (P); the fold is the perpendicular bisector of G and P. Everything
// on G's side of that line is lifted and laid back over the rest of the page.
//
// Forward turns (right-hand leaf) map the frame to the spread with X = W + u;
// backward turns (left-hand leaf) mirror it with X = W - u.

export const identity = [1, 0, 0, 1, 0, 0];

// CSS matrix(a, b, c, d, e, f): x' = a·x + c·y + e, y' = b·x + d·y + f
export function multiply(m, n) {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
}

export function apply(m, [x, y]) {
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

export const mirror = (W) => [-1, 0, 0, 1, W, 0];
export const translate = (x, y = 0) => [1, 0, 0, 1, x, y];

export function toCss(m) {
  return `matrix(${m.map((v) => (Math.abs(v) < 1e-9 ? 0 : +v.toFixed(5))).join(',')})`;
}

export function polygonCss(points) {
  if (points.length < 3) return 'polygon(0 0, 0 0, 0 0)';
  return `polygon(${points.map(([x, y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`).join(',')})`;
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const len = (a) => Math.hypot(a[0], a[1]);

// Keep the leaf attached to the spine: neither spine corner may be lifted,
// so P must stay within a disc around each one whose radius is its distance
// to G. Alternating projections settle quickly for two discs.
export function constrain(P, G, W, H) {
  const anchors = [[0, 0], [0, H]];
  let p = P;
  for (let pass = 0; pass < 4; pass += 1) {
    let moved = false;
    for (let i = 0; i < anchors.length; i += 1) {
      const S = anchors[i];
      const r = len(sub(G, S)) - 0.01;
      const d = sub(p, S);
      const l = len(d);
      if (l > r) {
        p = [S[0] + (d[0] / l) * r, S[1] + (d[1] / l) * r];
        moved = true;
      }
    }
    if (!moved) break;
  }
  return p;
}

// Split the leaf rectangle by the fold line into the part that stays down and
// the part that lifts.
function clip(points, keep) {
  const out = [];
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const da = keep(a);
    const db = keep(b);
    if (da <= 0) out.push(a);
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
      const t = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}

export function fold(G, P, W, H) {
  const axis = sub(G, P);
  const distance = len(axis);
  const rect = [[0, 0], [W, 0], [W, H], [0, H]];

  if (distance < 0.01) {
    return { flat: true, stay: rect, lifted: [], reflect: identity, normal: [1, 0], mid: G, width: 0 };
  }

  const n = [axis[0] / distance, axis[1] / distance];
  const mid = [(G[0] + P[0]) / 2, (G[1] + P[1]) / 2];
  const side = (X) => dot(sub(X, mid), n);

  const stay = clip(rect, side);
  const lifted = clip(rect, (X) => -side(X));

  const c = dot(mid, n);
  const reflect = [
    1 - 2 * n[0] * n[0],
    -2 * n[0] * n[1],
    -2 * n[0] * n[1],
    1 - 2 * n[1] * n[1],
    2 * c * n[0],
    2 * c * n[1],
  ];

  // How far the lifted flap reaches from the fold: drives shadow widths.
  const width = lifted.reduce((max, X) => Math.max(max, side(X)), 0);

  return { flat: false, stay, lifted, reflect, normal: n, mid, width };
}

// A linear-gradient whose stops are measured in pixels from a line through
// `origin`, running along the unit vector `dir`, inside a box of w × h.
export function gradientFrom(w, h, origin, dir, stops) {
  const angle = Math.atan2(dir[0], -dir[1]);
  const span = Math.abs(w * dir[0]) + Math.abs(h * dir[1]);
  const start = [w / 2 - (dir[0] * span) / 2, h / 2 - (dir[1] * span) / 2];
  const offset = dot(sub(origin, start), dir);
  const list = stops.map(([at, colour]) => `${colour} ${(offset + at).toFixed(1)}px`).join(',');
  return `linear-gradient(${angle.toFixed(4)}rad, ${list})`;
}

export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOut = (t) => 1 - (1 - t) ** 3;
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
