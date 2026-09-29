import { apply, bezier, constrain, fold, multiply, mirror } from './geometry';

const W = 540;
const H = 760;

const area = (points) => Math.abs(points.reduce((sum, [x1, y1], i) => {
  const [x2, y2] = points[(i + 1) % points.length];
  return sum + (x1 * y2 - x2 * y1);
}, 0)) / 2;

describe('page fold geometry', () => {
  test('a leaf that has not moved stays flat', () => {
    const f = fold([W, H], [W, H], W, H);
    expect(f.flat).toBe(true);
    expect(area(f.stay)).toBeCloseTo(W * H);
  });

  test('the reflection carries the grabbed corner to the pointer', () => {
    const G = [W, H];
    const P = [220, 610];
    const f = fold(G, P, W, H);
    const [x, y] = apply(f.reflect, G);
    expect(x).toBeCloseTo(P[0]);
    expect(y).toBeCloseTo(P[1]);
  });

  test('the two parts of a folded leaf add up to the whole leaf', () => {
    const f = fold([W, H], [160, 520], W, H);
    expect(area(f.stay) + area(f.lifted)).toBeCloseTo(W * H);
  });

  test('a full turn lays the whole leaf on the facing side', () => {
    const G = [W, H];
    const f = fold(G, [-W, H], W, H);
    expect(area(f.lifted)).toBeCloseTo(W * H);
    // Back face of a forward turn: mirrored, reflected across the spine,
    // then placed right of the spine. It must land exactly on the left slot.
    const place = multiply([1, 0, 0, 1, W, 0], multiply(f.reflect, mirror(W)));
    const [x0] = apply(place, [0, 0]);
    const [x1] = apply(place, [W, 0]);
    expect(x0).toBeCloseTo(0);
    expect(x1).toBeCloseTo(W);
  });

  test('the leaf never tears away from the spine', () => {
    const G = [W, H];
    const P = constrain([-900, -400], G, W, H);
    expect(Math.hypot(P[0], P[1] - H)).toBeLessThanOrEqual(W);
    expect(Math.hypot(P[0], P[1])).toBeLessThanOrEqual(Math.hypot(W, H));
  });

  test('the timing curve starts at rest, ends at rest and never runs backwards', () => {
    const ease = bezier(0.42, 0, 0.18, 1);
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    let previous = 0;
    for (let i = 1; i <= 100; i += 1) {
      const value = ease(i / 100);
      expect(value).toBeGreaterThanOrEqual(previous - 1e-9);
      previous = value;
    }
    // Symmetric curves cross the middle at the middle.
    expect(bezier(0.42, 0, 0.58, 1)(0.5)).toBeCloseTo(0.5, 4);
  });
});
