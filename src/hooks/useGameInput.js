import { useEffect, useRef } from 'react';

export function useGameInput(onAction) {
  const keysRef = useRef(new Set());
  const callbackRef = useRef(onAction);
  callbackRef.current = onAction;

  useEffect(() => {
    const onDown = (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current.add(e.key.toLowerCase());

      if (e.key === ' ' || e.key === 'Enter') {
        callbackRef.current({ type: 'ACTION' });
      }
      if (e.key === 'Escape') {
        callbackRef.current({ type: 'ESCAPE' });
      }
      if (e.key === 'x' || e.key === 'X') {
        callbackRef.current({ type: 'MENU' });
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

  return keysRef;
}
