/* global React, PORTFOLIO_DATA, THEMES, Circuit */
const { useState, useEffect, useRef } = React;

const NAV_ITEMS = [
  { id: 'home',    label: 'Home' },
  { id: 'work',    label: 'Work' },
  { id: 'projects',label: 'Projects' },
  { id: 'skills',  label: 'Skills' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
];

// Draggable nav pill
function Nav({ active, setActive }) {
  const wrapRef = useRef(null);
  const pillRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });
  const dragRef = useRef({ on: false, startX: 0, startLeft: 0, moved: 0 });
  const [dragging, setDragging] = useState(false);

  const measure = (id) => {
    const wrap = wrapRef.current; if (!wrap) return null;
    const el = wrap.querySelector(`[data-nav="${id}"]`);
    if (!el) return null;
    const wr = wrap.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return { left: er.left - wr.left, width: er.width };
  };

  useEffect(() => {
    if (dragRef.current.on) return;
    const m = measure(active); if (m) setPill(m);
  }, [active]);

  useEffect(() => {
    const onResize = () => { const m = measure(active); if (m) setPill(m); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active]);

  const jump = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const items = () => Array.from(wrapRef.current?.querySelectorAll('.nav-item') || []);

  const closestId = (centerX) => {
    const wrap = wrapRef.current; if (!wrap) return active;
    const wr = wrap.getBoundingClientRect();
    let best = NAV_ITEMS[0].id, dist = Infinity;
    items().forEach(el => {
      const r = el.getBoundingClientRect();
      const c = (r.left - wr.left) + r.width / 2;
      const d = Math.abs(c - centerX);
      if (d < dist) { dist = d; best = el.dataset.nav; }
    });
    return best;
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    dragRef.current = { on: true, startX: x, startLeft: pill.left, moved: 0 };
    setDragging(true);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.on) return;
    const x = e.clientX;
    const dx = x - dragRef.current.startX;
    dragRef.current.moved = Math.abs(dx);
    const wrap = wrapRef.current; if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    const minL = 6;
    const maxL = wr.width - pill.width - 6;
    let nextLeft = Math.max(minL, Math.min(maxL, dragRef.current.startLeft + dx));
    setPill(p => ({ ...p, left: nextLeft }));
  };

  const onPointerUp = () => {
    if (!dragRef.current.on) return;
    dragRef.current.on = false;
    setDragging(false);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    const wrap = wrapRef.current;
    if (wrap && dragRef.current.moved > 6) {
      const centerX = pill.left + pill.width / 2;
      const id = closestId(centerX);
      jump(id);
    }
  };

  return (
    <nav className={`nav ${dragging ? 'dragging' : ''}`} ref={wrapRef}>
      <span
        ref={pillRef}
        className="nav-pill"
        style={{ left: pill.left, width: pill.width }}
        onPointerDown={onPointerDown}
      />
      {NAV_ITEMS.map(n => (
        <button
          key={n.id}
          data-nav={n.id}
          className={`nav-item ${active === n.id ? 'active' : ''}`}
          onClick={() => jump(n.id)}
        >
          {n.label}
        </button>
      ))}
    </nav>
  );
}

function Top({ theme }) {
  const { personal } = PORTFOLIO_DATA;
  return (
    <div className="top">
      <div className="top-mark">
        <span className="top-mark-dot" />
        <span>{personal.initials} · {personal.location}</span>
      </div>
      <div className="top-meta">{THEMES[theme].label} · v26</div>
    </div>
  );
}

function Hero() {
  const { personal, inProgress } = PORTFOLIO_DATA;
  return (
    <section id="home" className="hero" data-screen-label="01 Home">
      <Circuit />
      <div className="hero-eyebrow">
        <span className="hero-eyebrow-bar" />
        <span className="eyebrow">Electrical &amp; Electronics Engineer · Hyderabad</span>
      </div>
      <div className="hero-name">{personal.name}</div>
      <div className="hero-grid">
        <div>
          <h1>Building where hardware meets <span className="accent-word">software.</span></h1>
          <p className="hero-sub">
            Dual-degree at MIT Manipal &amp; IIT Madras. Deep in FPGAs, embedded
            systems, and AI on the edge — from sub-100ms vision on a Pi 5 to a
            full MODBUS RTU stack on an ESP32-S3.
          </p>
          <div className="hero-cta-row">
            <a className="btn btn-primary" href={`mailto:${personal.email}`}>Get in touch →</a>
            <a className="btn" href={`https://${personal.github}`} target="_blank" rel="noreferrer">View GitHub</a>
          </div>
          <div className="inprog">
            <div className="inprog-h"><span className="inprog-pulse" /> Currently writing</div>
            <div className="inprog-list">
              {inProgress.map((w, i) => (
                <div className="inprog-item" key={i}>
                  <div className="inprog-kind">{w.kind}</div>
                  <div className="inprog-title">{w.title}</div>
                  <div className="inprog-note">{w.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="hero-card">
          <div className="hero-card-h"><span>Status</span></div>
          <div className="hero-card-row"><span>Role</span><strong>{personal.role}</strong></div>
          <div className="hero-card-row"><span>Based</span><strong>{personal.location}</strong></div>
          <div className="hero-card-row"><span>Open to</span><strong>Hardware · Embedded · Silicon</strong></div>
          <div className="hero-card-row"><span>Notable</span><strong>Patent filed · IIT-M 1st place</strong></div>
          <div className="hero-card-row"><span>Available</span><strong>Summer 2026</strong></div>
        </aside>
      </div>
      <div className="stats">
        {PORTFOLIO_DATA.stats.map((s, i) => (
          <div className="stat" key={i}>
            <div className="stat-k">{s.k}</div>
            <div className="stat-v">{s.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SH({ num, eyebrow, title, right }) {
  return (
    <header className="sh">
      <div className="sh-l">
        <span className="sh-counter">{num} · {eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {right && <div className="sh-r">{right}</div>}
    </header>
  );
}

window.UI = { Nav, Top, Hero, SH, NAV_ITEMS };
