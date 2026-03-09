import { useEffect, useCallback } from 'react';

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const heading = id === 'home' ? null : el.querySelector('.section-title');
  const target = heading || el;
  const top = target.getBoundingClientRect().top + window.scrollY - 24;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

export const SHORTCUTS = [
  { key: 'g', label: 'G', description: 'Open GitHub' },
  { key: 'e', label: 'E', description: 'Send email' },
  { key: '1', label: '1', description: 'Home' },
  { key: '2', label: '2', description: 'About' },
  { key: '3', label: '3', description: 'Work' },
  { key: '4', label: '4', description: 'Projects' },
  { key: '5', label: '5', description: 'Blog' },
  { key: '6', label: '6', description: 'Contact' },
  { key: '?', label: '?', description: 'Toggle this panel' },
];

const ACTIONS = {
  g: () => window.open('https://github.com/Manikanta25055', '_blank'),
  e: () => window.open('mailto:mgonugondlamanikanta@gmail.com'),
  '1': () => scrollToSection('home'),
  '2': () => scrollToSection('about'),
  '3': () => scrollToSection('experience'),
  '4': () => scrollToSection('projects'),
  '5': () => scrollToSection('blog'),
  '6': () => scrollToSection('contact'),
};

export function useKeyboardShortcuts(onToggleHint) {
  const handleKeyDown = useCallback((e) => {
    if (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.isContentEditable
    ) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const k = e.key === '?' ? '?' : e.key.toLowerCase();

    if (k === '?') {
      onToggleHint();
      return;
    }

    const action = ACTIONS[k];
    if (action) {
      e.preventDefault();
      action();
    }
  }, [onToggleHint]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
