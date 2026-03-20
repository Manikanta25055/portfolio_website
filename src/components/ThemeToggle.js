import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('portfolio-theme');
    if (stored === 'light') {
      setIsDark(false);
      document.body.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('portfolio-theme', 'light');
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle-label">{isDark ? 'LIGHT' : 'DARK'}</span>
      <span className="theme-toggle-icon">
        {isDark ? (
          /* Sun icon */
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="3"/>
            <line x1="8" y1="1" x2="8" y2="3"/>
            <line x1="8" y1="13" x2="8" y2="15"/>
            <line x1="1" y1="8" x2="3" y2="8"/>
            <line x1="13" y1="8" x2="15" y2="8"/>
            <line x1="3.05" y1="3.05" x2="4.46" y2="4.46"/>
            <line x1="11.54" y1="11.54" x2="12.95" y2="12.95"/>
            <line x1="12.95" y1="3.05" x2="11.54" y2="4.46"/>
            <line x1="4.46" y1="11.54" x2="3.05" y2="12.95"/>
          </svg>
        ) : (
          /* Moon icon */
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M13 10A6 6 0 0 1 6 3a6 6 0 1 0 7 7z"/>
          </svg>
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
