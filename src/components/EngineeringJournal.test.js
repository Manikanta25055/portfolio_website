import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import EngineeringJournal from './EngineeringJournal';

class IntersectionObserverStub {
  observe() {}

  unobserve() {}

  disconnect() {}
}

describe('EngineeringJournal interface enhancements', () => {
  let container;
  let root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    global.IntersectionObserver = IntersectionObserverStub;
    window.IntersectionObserver = IntersectionObserverStub;
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
    window.requestAnimationFrame = jest.fn(() => 1);
    window.cancelAnimationFrame = jest.fn();
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root.render(<EngineeringJournal />);
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  test('uses one consistent presentation without a theme switch', () => {
    expect(container.querySelector('.theme-toggle')).toBeNull();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  test('presents the engineering disciplines as parallel areas, not a false sequence', () => {
    const areas = Array.from(container.querySelectorAll('.practice-area strong'))
      .map((element) => element.textContent);

    expect(areas).toEqual([
      'Digital hardware',
      'Embedded & edge AI',
      'Engineering analytics',
      'Operations',
    ]);
  });

  test('uses the current LinkedIn profile URL', () => {
    const linkedin = container.querySelector('a[href="https://www.linkedin.com/in/veera-manikanta-gonugondla-349bb729a/"]');

    expect(linkedin).not.toBeNull();
  });

  test('filters certifications by issuer without removing the complete source list', () => {
    const input = container.querySelector('[aria-label="Filter certifications"]');

    expect(input).not.toBeNull();
    act(() => {
      const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setValue.call(input, 'Anthropic');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const visibleCertificates = container.querySelectorAll('.certificate');
    expect(visibleCertificates).toHaveLength(2);
    expect(container.textContent).toContain('Claude Code in Action');
    expect(container.textContent).toContain('Introduction to MCP');
  });

  test('gives every project a separate non-text illustration region', () => {
    const illustrations = container.querySelectorAll('.project-illustration[aria-hidden="true"]');

    expect(illustrations).toHaveLength(6);
  });

  test('hides the header while scrolling down and restores it while scrolling up', () => {
    const header = container.querySelector('.site-header');

    expect(header.classList.contains('is-hidden')).toBe(false);
    window.scrollY = 220;
    act(() => window.dispatchEvent(new Event('scroll')));
    expect(header.classList.contains('is-hidden')).toBe(true);

    window.scrollY = 140;
    act(() => window.dispatchEvent(new Event('scroll')));
    expect(header.classList.contains('is-hidden')).toBe(false);
  });
});
