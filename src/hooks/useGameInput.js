import { useEffect, useRef } from 'react';

// Tracks which keys are currently held down
export function useGameInput(onAction) {
  const keysRef = useRef(new Set());
  const callbackRef = useRef(onAction);
  callbackRef.current = onAction;

  useEffect(() => {
    const onDown = (e) => {
      // Prevent page scroll
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current.add(e.key.toLowerCase());

      // Immediate action keys (not held)
      if (e.key === ' ' || e.key === 'Enter') {
        callbackRef.current({ type: 'ACTION' });
      }
      if (e.key === 'Escape') {
        callbackRef.current({ type: 'ESCAPE' });
      }
    };
    const onUp = (e) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  return keysRef; // consumer reads .current to check held keys
}
