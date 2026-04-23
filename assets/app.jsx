/* global React, ReactDOM, UI, SECTIONS, THEMES */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "editorial"
}/*EDITMODE-END*/;

function Tweaks({ theme, setTheme, onClose }) {
  return (
    <div className="tw">
      <div className="tw-h">
        <span>Tweaks · Theme</span>
        <button className="tw-x" onClick={onClose}>×</button>
      </div>
      <div className="tw-opts">
        {Object.entries(THEMES).map(([k, v]) => (
          <button key={k} className={`tw-opt ${theme === k ? 'on' : ''}`} onClick={() => setTheme(k)}>
            <span className="tw-opt-dot" />
            <span className="tw-opt-body">
              <span className="tw-opt-title">{v.label}</span>
              <span className="tw-opt-desc">{v.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  const saved = (() => { try { return localStorage.getItem('portfolio.theme'); } catch(e) { return null; } })();
  const [theme, setThemeState] = useState(saved || TWEAK_DEFAULTS.theme);
  const [active, setActive] = useState('home');
  const [editMode, setEditMode] = useState(false);

  const setTheme = (t) => {
    setThemeState(t);
    try { localStorage.setItem('portfolio.theme', t); } catch(e) {}
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { theme: t } }, '*');
  };

  useEffect(() => { document.body.setAttribute('data-theme', theme); }, [theme]);

  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => {
    const ids = UI.NAV_ITEMS.map(n => n.id);
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        let closest = ids[0], dist = Infinity;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          const d = Math.abs(top - 120);
          if (top < window.innerHeight * 0.5 && d < dist) { dist = d; closest = id; }
        }
        setActive(closest);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { Top, Hero, Nav } = UI;
  const { Work, Projects, Skills, Writing, Contact } = SECTIONS;

  return (
    <>
      <div className="page">
        <Top theme={theme} />
        <Hero />
        <Work />
        <Projects />
        <Skills />
        <Writing />
        <Contact />
      </div>
      <Nav active={active} setActive={setActive} />
      {editMode && <Tweaks theme={theme} setTheme={setTheme} onClose={() => setEditMode(false)} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
