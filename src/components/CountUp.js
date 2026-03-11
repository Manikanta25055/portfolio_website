import { useState, useEffect, useRef } from 'react';

function parseValue(str) {
  const s = String(str);
  const m = s.match(/^([<>±+]?\s*)(\d+(?:\.\d+)?)(.*)/);
  if (!m) return null;
  // Skip ordinal numbers: 1st, 2nd, 3rd, 4th etc.
  if (/^(st|nd|rd|th)/i.test(m[3])) return null;
  return {
    prefix: m[1],
    number: parseFloat(m[2]),
    decimals: (m[2].split('.')[1] || '').length,
    suffix: m[3],
  };
}

const CountUp = ({ value, duration = 900, trigger = true }) => {
  const parsed = parseValue(value);
  const [display, setDisplay] = useState(
    parsed ? parsed.prefix + (0).toFixed(parsed.decimals) + parsed.suffix : String(value)
  );
  const rafRef = useRef(null);

  useEffect(() => {
    if (!trigger || !parsed) {
      setDisplay(String(value));
      return;
    }

    cancelAnimationFrame(rafRef.current);
    const { prefix, number, decimals, suffix } = parsed;
    const startTime = performance.now();

    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(prefix + (eased * number).toFixed(decimals) + suffix);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    setDisplay(prefix + (0).toFixed(decimals) + suffix);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger]); // eslint-disable-line

  return display;
};

export default CountUp;
