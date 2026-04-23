import React, { useState, useEffect, useRef } from 'react';
import * as DATA from '../data/portfolio';

const NAV_ITEMS = [
  { id: 'home',      label: 'Home' },
  { id: 'education', label: 'Education' },
  { id: 'work',      label: 'Work' },
  { id: 'projects',  label: 'Projects' },
  { id: 'skills',    label: 'Skills' },
  { id: 'writing',   label: 'Writing' },
  { id: 'contact',   label: 'Contact' },
];

// Animated PCB-style circuit background — traces, vias, pulses
function Circuit() {
  const ref = useRef(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const pulses = svg.querySelectorAll('.circuit-pulse');
    pulses.forEach((p, i) => {
      const dur = 4 + (i % 3);
      p.animate(
        [{ offsetDistance: '0%' }, { offsetDistance: '100%' }],
        { duration: dur * 1000, iterations: Infinity, delay: i * 700, easing: 'linear' }
      );
    });
  }, []);
  return (
    <div className="circuit" aria-hidden>
      <svg ref={ref} viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".15"/>
          </pattern>
        </defs>
        <rect width="1200" height="700" fill="url(#grid)" color="var(--ink)" />

        {/* PCB traces */}
        <path className="circuit-trace" id="t1" d="M 50 120 L 280 120 L 280 240 L 540 240 L 540 80 L 820 80 L 820 200 L 1150 200" />
        <path className="circuit-trace" id="t2" d="M 80 580 L 320 580 L 320 460 L 600 460 L 600 620 L 900 620 L 900 500 L 1140 500" />
        <path className="circuit-trace" id="t3" d="M 50 360 L 200 360 L 200 300 L 460 300 L 460 400 L 720 400 L 720 360 L 1100 360" />
        <path className="circuit-trace" id="t4" d="M 200 80 L 200 180 L 360 180 L 360 360" />
        <path className="circuit-trace" id="t5" d="M 700 80 L 700 200 L 880 200 L 880 320" />
        <path className="circuit-trace" id="t6" d="M 1000 580 L 1000 480 L 800 480 L 800 360" />

        {/* Vias / pads */}
        <circle className="circuit-via" cx="280" cy="120" r="4"/>
        <circle className="circuit-via" cx="540" cy="240" r="4"/>
        <circle className="circuit-via" cx="820" cy="80"  r="4"/>
        <circle className="circuit-via" cx="320" cy="580" r="4"/>
        <circle className="circuit-via" cx="600" cy="460" r="4"/>
        <circle className="circuit-via" cx="900" cy="620" r="4"/>
        <circle className="circuit-via" cx="200" cy="360" r="4"/>
        <circle className="circuit-via" cx="460" cy="300" r="4"/>
        <circle className="circuit-via" cx="720" cy="400" r="4"/>

        {/* Chip outlines */}
        <g opacity=".55">
          <rect x="380" y="180" width="120" height="80" fill="none" stroke="currentColor" strokeWidth="1"/>
          <text x="440" y="225" fill="currentColor" fontSize="9" textAnchor="middle" fontFamily="monospace" opacity=".6">FPGA</text>
          {Array.from({length:6}).map((_,i)=>(
            <line key={'p'+i} x1={395+i*18} y1="178" x2={395+i*18} y2="170" stroke="currentColor" strokeWidth=".8"/>
          ))}
          {Array.from({length:6}).map((_,i)=>(
            <line key={'q'+i} x1={395+i*18} y1="262" x2={395+i*18} y2="270" stroke="currentColor" strokeWidth=".8"/>
          ))}
        </g>
        <g opacity=".55">
          <rect x="780" y="290" width="100" height="60" fill="none" stroke="currentColor" strokeWidth="1"/>
          <text x="830" y="325" fill="currentColor" fontSize="9" textAnchor="middle" fontFamily="monospace" opacity=".6">MCU</text>
        </g>
        <g opacity=".55">
          <rect x="160" y="500" width="80" height="50" fill="none" stroke="currentColor" strokeWidth="1"/>
          <text x="200" y="530" fill="currentColor" fontSize="9" textAnchor="middle" fontFamily="monospace" opacity=".6">DSP</text>
        </g>

        {/* Pulses moving along traces */}
        <circle className="circuit-pulse" r="3" style={{offsetPath:"path('M 50 120 L 280 120 L 280 240 L 540 240 L 540 80 L 820 80 L 820 200 L 1150 200')"}} />
        <circle className="circuit-pulse" r="3" style={{offsetPath:"path('M 80 580 L 320 580 L 320 460 L 600 460 L 600 620 L 900 620 L 900 500 L 1140 500')"}} />
        <circle className="circuit-pulse" r="3" style={{offsetPath:"path('M 50 360 L 200 360 L 200 300 L 460 300 L 460 400 L 720 400 L 720 360 L 1100 360')"}} />
        <circle className="circuit-pulse" r="2" style={{offsetPath:"path('M 200 80 L 200 180 L 360 180 L 360 360')"}} />
        <circle className="circuit-pulse" r="2" style={{offsetPath:"path('M 700 80 L 700 200 L 880 200 L 880 320')"}} />
      </svg>
    </div>
  );
}

// Paper grain SVG overlay — subtle crumpled paper texture
function PaperGrain() {
  return (
    <svg className="paper-grain-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <filter id="pg-fine" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.72 0.54" numOctaves="4" seed="7"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <filter id="pg-coarse" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.09 0.07" numOctaves="3" seed="3"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncR type="linear" slope="0.35" intercept="0.58"/>
          <feFuncG type="linear" slope="0.35" intercept="0.58"/>
          <feFuncB type="linear" slope="0.35" intercept="0.58"/>
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#pg-fine)" opacity="0.048"/>
      <rect width="100%" height="100%" filter="url(#pg-coarse)" opacity="0.07" style={{mixBlendMode:'multiply'}}/>
    </svg>
  );
}

// Draggable nav pill
function Nav({ active, setActive }) {
  const wrapRef = useRef(null);
  const pillRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });
  const dragRef = useRef({ on: false, startX: 0, startLeft: 0, moved: 0 });
  const [dragging, setDragging] = useState(false);

  const measure = React.useCallback((id) => {
    const wrap = wrapRef.current; if (!wrap) return null;
    const el = wrap.querySelector(`[data-nav="${id}"]`);
    if (!el) return null;
    const wr = wrap.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return { left: er.left - wr.left, width: er.width };
  }, []);

  useEffect(() => {
    if (dragRef.current.on) return;
    const m = measure(active); if (m) setPill(m);
    const el = pillRef.current;
    if (el) {
      el.classList.remove('active-pulse');
      // eslint-disable-next-line no-unused-expressions
      el.offsetWidth;
      el.classList.add('active-pulse');
    }
  }, [active, measure]);

  useEffect(() => {
    const t = setTimeout(() => {
      const m = measure(active); if (m) setPill(m);
    }, 60);
    const onResize = () => { const m = measure(active); if (m) setPill(m); };
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); };
  }, [active, measure]);

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
    
    if (pillRef.current) {
      pillRef.current.style.transition = 'none';
      pillRef.current.style.transform = `translateX(${nextLeft}px) scale(1.06)`;
    }
    const centerX = nextLeft + pill.width / 2;
    const id = closestId(centerX);
    if (id !== active) setActive(id);
    setPill(p => ({ ...p, left: nextLeft }));
  };

  const onPointerUp = () => {
    if (!dragRef.current.on) return;
    dragRef.current.on = false;
    setDragging(false);
    if (pillRef.current) {
      pillRef.current.style.transition = '';
      pillRef.current.style.transform = '';
    }
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    const wrap = wrapRef.current;
    if (wrap && dragRef.current.moved > 2) {
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
        style={{ transform: `translateX(${pill.left}px)`, width: pill.width }}
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
  const { PERSONAL } = DATA;
  return (
    <div className="top">
      <div className="top-mark">
        <span className="top-mark-dot" />
        <span>{PERSONAL.initials} · {PERSONAL.location}</span>
      </div>
      <div className="top-meta">{DATA.THEMES[theme].label} · v26</div>
    </div>
  );
}

// Tilted notepad with handwritten "currently working" note near the hero title
function NotepadCurrent() {
  const wk = Math.ceil((((new Date()-new Date(new Date().getFullYear(),0,1))/86400000)+1)/7);
  return (
    <div className="notepad" aria-label="Currently working on">
      <div className="np-rings" aria-hidden="true">
        <span className="np-ring"/><span className="np-ring"/><span className="np-ring"/>
      </div>
      <span className="np-tear" aria-hidden="true"/>
      <div className="np-inner">
        <div className="np-brand">GVM</div>
        <div className="np-head">
          <span className="np-dot"/>
          <span>Currently</span>
          <span className="np-date">· wk {wk} ·</span>
        </div>
        <p className="np-line">Building <b>Project Breadth</b> —</p>
        <p className="np-line np-sub">a wearable respiratory-rate &amp; effort sensor.</p>
        <p className="np-line">Drafting the <i>IEEE Sensors Journal</i> paper</p>
        <p className="np-line np-sub">on the signal-chain &amp; validation results.</p>
        <div className="np-sign">
          <span className="np-sig-line"/>
          <span className="np-sig-name">— GVM</span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const { PERSONAL, IN_PROGRESS, STATS } = DATA;
  return (
    <section id="home" className="hero" data-screen-label="01 Home">
      <Circuit />
      <div className="hero-eyebrow">
        <span className="hero-eyebrow-bar" />
        <span className="eyebrow">Electrical &amp; Electronics Engineer · Hyderabad</span>
      </div>
      <div className="hero-name">{PERSONAL.name}</div>
      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-title-row">
            <h1>Building where hardware meets <span className="accent-word">software.</span></h1>
            <div className="notepad-float-wrap"><NotepadCurrent/></div>
          </div>
          <p className="hero-sub">
            Dual-degree at MIT Manipal &amp; IIT Madras. Deep in FPGAs, embedded
            systems, and AI on the edge — from sub-100ms vision on a Pi 5 to a
            full MODBUS RTU stack on an ESP32-S3.
          </p>
          <div className="upcoming-tag" aria-label="Upcoming Systems Engineer Intern at Boeing">
            <div className="up-stack">
              <div className="up-meta">
                <span className="up-dot" />
                <span className="up-eyebrow">Upcoming · Summer 2026</span>
              </div>
              <div className="up-role-row">
                <span className="up-role">Systems Engineer Intern</span>
                <span className="up-at">at</span>
                <img className="up-logo" src="logos/boeing.png" alt="Boeing" />
              </div>
            </div>
          </div>
          <div className="hero-cta-row">
            <a className="btn btn-primary" href={`mailto:${PERSONAL.email}`}>Get in touch →</a>
            <a className="btn" href={`https://${PERSONAL.github}`} target="_blank" rel="noreferrer">View GitHub</a>
          </div>
          <div className="inprog">
            <div className="inprog-h"><span className="inprog-pulse" /> Currently writing</div>
            <div className="inprog-list">
              {IN_PROGRESS.map((w, i) => (
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
          <div className="hero-card-row"><span>Role</span><strong>{PERSONAL.role}</strong></div>
          <div className="hero-card-row"><span>Based</span><strong>{PERSONAL.location}</strong></div>
          <div className="hero-card-row"><span>Open to</span><strong>Hardware · Embedded · Silicon</strong></div>
          <div className="hero-card-row"><span>Notable</span><strong>Patent filed · IIT-M 1st place</strong></div>
          <div className="hero-card-row"><span>Available</span><strong>Summer 2026</strong></div>
        </aside>
      </div>
      <div className="stats">
        {STATS.map((s, i) => (
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

function BookCard({ edu, coverColor, spineColor, logo }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="book-scene">
      <div
        className={`book-container ${open ? 'book-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        role="button"
        aria-label={`${open ? 'Close' : 'Open'} ${edu.inst} book`}
      >
        {/* Pages layer (always behind) */}
        <div className="book-pages-bg">
          <div className="bp-heading">Academic Record</div>
          <div className="bp-body">
            <div className="bp-field">
              <div className="bp-label">Programme</div>
              <div className="bp-val">{edu.deg}</div>
            </div>
            <div className="bp-field">
              <div className="bp-label">Stage</div>
              <div className="bp-val">{edu.sem}</div>
            </div>
            {edu.minor && (
              <div className="bp-field">
                <div className="bp-label">Minor / Specialisation</div>
                <div className="bp-val">{edu.minor}</div>
              </div>
            )}
            <div className="bp-field">
              <div className="bp-label">Period</div>
              <div className="bp-val">{edu.years}</div>
            </div>
            <div className="bp-cgpa-row">
              <div className="bp-cgpa-n">{edu.cgpa}</div>
              <div className="bp-cgpa-d"> /10</div>
            </div>
            <span className="bp-cgpa-label">CGPA</span>
          </div>
          {logo && (
            <div className="bp-logo-slot" aria-hidden="true">
              <img src={logo} alt="" />
            </div>
          )}
        </div>

        {/* Cover (rotates away on open) */}
        <div className="book-cover-panel">
          <div className="book-cover-front" style={{ background: coverColor, color: '#fff' }}>
            <div>
              <div className="bc-eyebrow">Academic Record</div>
              <div className="bc-rule"/>
              <div className="bc-title">{edu.inst}</div>
              <div className="bc-sub">{edu.deg}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div className="bc-year">{edu.years}</div>
              <div className="bc-seal">
                {edu.inst.split(' ').map(w => w[0]).join('')}
              </div>
            </div>
          </div>
          <div className="book-cover-back-face"/>
        </div>
      </div>

      <div className="book-label">{edu.inst}</div>
      <div className="book-hint" onClick={() => setOpen(o => !o)}>
        {open ? '← Close' : 'Tap to open →'}
      </div>
    </div>
  );
}

function Education() {
  const { EDUCATION } = DATA;
  const palette = [
    { cover: '#7a1212', spine: '#4a0a0a', logo: 'logos/manipal.png' },
    { cover: '#162348', spine: '#0a1228', logo: 'logos/iitm.png' },
  ];
  return (
    <section id="education" className="edu-section" data-screen-label="02 Education">
      <header className="sh">
        <div className="sh-l">
          <span className="sh-counter">02 · Dual Degree</span>
          <h2>Two institutions.<br/>One engineer.</h2>
        </div>
        <div className="sh-r">
          Concurrent programmes at MIT Manipal and IIT Madras — two curricula, two campuses, parallel coursework since 2023.
        </div>
      </header>
      <div className="edu-books-wrap">
        {EDUCATION.map((e, i) => (
          <BookCard
            key={i}
            edu={e}
            coverColor={palette[i % palette.length].cover}
            spineColor={palette[i % palette.length].spine}
            logo={palette[i % palette.length].logo}
          />
        ))}
      </div>
    </section>
  );
}

function Work() {
  const { EXPERIENCE } = DATA;
  return (
    <section id="work" data-screen-label="03 Work">
      <SH num="03" eyebrow="Experience" title="What I've shipped, and where I've trained."
        right="Three roles in IoT, VLSI, and product development — alongside concurrent dual-degree coursework." />
      <div className="timeline">
        {EXPERIENCE.map((e, i) => (
          <div className="tl-row" key={i}>
            <div className="tl-period">{e.period}</div>
            <div className="tl-main">
              <h3>{e.role}</h3>
              <div className="tl-co"><strong>{e.co}</strong> · {e.loc}</div>
              <div className="tl-bullets">
                {e.bullets.map((b, j) => <div className="tl-bullet" key={j}>{b}</div>)}
              </div>
              <div className="proj-tech">
                {e.skills.map(s => <span className="chip" key={s}>{s}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const { PROJECTS } = DATA;
  const [open, setOpen] = useState(null);
  return (
    <section id="projects" data-screen-label="04 Projects">
      <SH num="04" eyebrow="Selected projects" title="Nine systems. One patent. A first place."
        right="Each card carries the problem, approach, role, team, and measured numbers. Tap for the full entry." />
      <div className="proj-grid">
        {PROJECTS.map((p, i) => (
          <article key={p.id} className="proj" onClick={() => setOpen(i)}>
            <div className="proj-head">
              <span className="proj-num">P/{String(i+1).padStart(2,'0')} · {p.period}</span>
              {p.badge && <span className="proj-badge">{p.badge}</span>}
            </div>
            <h3>{p.title}</h3>
            <div className="proj-sub">{p.subtitle}</div>
            <div className="proj-blurb">{p.blurb}</div>
            <div className="proj-meta">
              <div><b>Role</b> &nbsp;{p.role}</div>
              <div><b>Team</b> &nbsp;{p.team}</div>
            </div>
            <div className="proj-metrics">
              {p.metrics.map((m,j) => (
                <div className="proj-metric" key={j}>
                  <div className="proj-metric-k">{m.k}</div>
                  <div className="proj-metric-v">{m.v}</div>
                </div>
              ))}
            </div>
            <div className="proj-tech">
              {p.tech.slice(0,7).map(t => <span className="chip" key={t}>{t}</span>)}
            </div>
            <div className="proj-cta">Full entry</div>
          </article>
        ))}
      </div>
      {open !== null && (
        <div className="modal-bg" onClick={() => setOpen(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setOpen(null)}>×</button>
            <div className="eyebrow" style={{marginBottom:12}}>{PROJECTS[open].badge || 'PROJECT'}</div>
            <h2>{PROJECTS[open].title}</h2>
            <div className="modal-period">{PROJECTS[open].subtitle} · {PROJECTS[open].period}</div>
            <div className="modal-section">
              <div className="modal-section-h">Overview</div>
              <p>{PROJECTS[open].blurb}</p>
            </div>
            <div className="modal-section">
              <div className="modal-section-h">Problem</div>
              <p>{PROJECTS[open].problem}</p>
            </div>
            <div className="modal-section">
              <div className="modal-section-h">Approach</div>
              <p>{PROJECTS[open].approach}</p>
            </div>
            <div className="stats" style={{marginTop:24, marginBottom:24}}>
              {PROJECTS[open].metrics.map((m,j) => (
                <div className="stat" key={j}>
                  <div className="stat-k">{m.k}</div>
                  <div className="stat-v">{m.v}</div>
                </div>
              ))}
            </div>
            <div className="modal-section">
              <div className="modal-section-h">Stack</div>
              <div className="proj-tech">
                {PROJECTS[open].tech.map(t => <span className="chip" key={t}>{t}</span>)}
              </div>
            </div>
            <div className="proj-meta" style={{marginTop:8}}>
              <div><b>Role</b> &nbsp;{PROJECTS[open].role}</div>
              <div><b>Team</b> &nbsp;{PROJECTS[open].team}</div>
            </div>
            {PROJECTS[open].link && (
              <a className="btn btn-primary" style={{marginTop:24}} href={`https://${PROJECTS[open].link}`} target="_blank" rel="noreferrer">
                View on GitHub →
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function Skills() {
  const { SKILLS } = DATA;
  return (
    <section id="skills" data-screen-label="05 Skills">
      <SH num="05" eyebrow="Technical surface" title="The tools I reach for."
        right="System-level: hardware → firmware → application." />
      <div className="skill-grid">
        {SKILLS.map(g => (
          <div className="skill-card" key={g.g}>
            <div className="skill-g">{g.g}</div>
            <div className="skill-items">
              {g.items.map(it => <div className="skill-item" key={it}>{it}</div>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Writing() {
  const { WRITING } = DATA;
  return (
    <section id="writing" data-screen-label="06 Writing">
      <SH num="06" eyebrow="Notes &amp; writing" title="Things I learned, written down."
        right="Short engineering notes from shipping the projects above." />
      <div className="writing">
        {WRITING.map((w,i) => (
          <article className="write-card" key={i}>
            <div className="write-meta"><span>{w.date}</span><span>{w.read}</span></div>
            <h3>{w.title}</h3>
            <p className="write-excerpt">{w.excerpt}</p>
            <div className="write-tags">
              {w.tags.map(t => <span className="chip" key={t}>{t}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const { PERSONAL } = DATA;
  return (
    <section id="contact" className="jr-contact" data-screen-label="07 Contact">
      <div className="jr-masthead">
        <div className="jr-mast-l">Engineering Journal · Vol. 26</div>
        <div className="jr-mast-r">Issue 04 · April 2026</div>
      </div>
      <div className="jr-title-row">
        <div>
          <div className="jr-eyebrow">07 · Correspondence</div>
          <h2 className="jr-title">Have a hard problem?<br/><span className="accent-word">Let's talk silicon.</span></h2>
        </div>
        <div className="jr-lede">
          Open to roles in hardware engineering, embedded systems, and silicon design starting Summer 2026.
        </div>
      </div>

      <div className="jr-grid">
        {/* Ledger Page (Links) */}
        <div className="jr-sheet">
          <div className="jr-stamp">APPROVED</div>
          <div className="jr-heading">Directory</div>
          <div className="jr-ledger">
            <a className="jr-row" href={`mailto:${PERSONAL.email}`}>
              <span className="jr-row-label">Email</span>
              <span className="jr-row-val">{PERSONAL.email}</span>
              <span className="jr-row-arrow">↗</span>
            </a>
            <a className="jr-row" href={`https://${PERSONAL.github}`} target="_blank" rel="noreferrer">
              <span className="jr-row-label">GitHub</span>
              <span className="jr-row-val">{PERSONAL.github}</span>
              <span className="jr-row-arrow">↗</span>
            </a>
            <a className="jr-row" href={`https://${PERSONAL.linkedin}`} target="_blank" rel="noreferrer">
              <span className="jr-row-label">LinkedIn</span>
              <span className="jr-row-val">manikanta-gonugondla</span>
              <span className="jr-row-arrow">↗</span>
            </a>
            <div className="jr-row">
              <span className="jr-row-label">Location</span>
              <span className="jr-row-val">{PERSONAL.location}</span>
            </div>
          </div>
          <div className="jr-margin-note">
            <b>Note:</b> Response latency is typically <b>&lt; 24h</b>. Priority given to hardware/RTL-related inquiries.
          </div>
        </div>

        {/* LinkedIn / Social Special Card (Replacement for simple form in React for now) */}
        <a href={`https://${PERSONAL.linkedin}`} target="_blank" rel="noreferrer" className="li-special">
          <div className="li-inner">
            <div className="li-logo">in</div>
            <div className="li-body">
              <div className="li-label">Professional Network</div>
              <div className="li-handle">Gonugondla Veera Manikanta</div>
              <div className="li-roles">Electrical &amp; Electronics Engineer</div>
            </div>
            <div className="li-arrow">↗</div>
          </div>
          <div className="li-bar" />
        </a>
      </div>

      <div className="jr-colophon">
        <div className="jr-col">
          <span className="jr-col-k">Current Revision</span>
          <span className="jr-col-v">v26.04.23</span>
        </div>
        <div className="jr-col jr-col-mid">
          <span className="jr-col-k">Platform</span>
          <span className="jr-col-v">React 18 · Framer Motion</span>
        </div>
        <div className="jr-col jr-col-r">
          <span className="jr-col-mark">© 2026 {PERSONAL.name}</span>
          <span className="jr-col-v">All Rights Reserved</span>
        </div>
      </div>
    </section>
  );
}

function Tweaks({ theme, setTheme, onClose }) {
  return (
    <div className="tw">
      <div className="tw-h">
        <span>Tweaks · Theme</span>
        <button className="tw-x" onClick={onClose}>×</button>
      </div>
      <div className="tw-opts">
        {Object.entries(DATA.THEMES).map(([k, v]) => (
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

export default function EngineeringJournal() {
  const saved = (() => { try { return localStorage.getItem('portfolio.theme'); } catch(e) { return null; } })();
  const [theme, setThemeState] = useState(saved || 'editorial');
  const [active, setActive] = useState('home');
  const [showTweaks, setShowTweaks] = useState(false);

  const setTheme = (t) => {
    setThemeState(t);
    try { localStorage.setItem('portfolio.theme', t); } catch(e) {}
  };

  useEffect(() => { document.body.setAttribute('data-theme', theme); }, [theme]);

  useEffect(() => {
    const ids = NAV_ITEMS.map(n => n.id);
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

  return (
    <div className="app-container">
      <PaperGrain />
      <div className="page">
        <Top theme={theme} />
        <Hero />
        <Education />
        <Work />
        <Projects />
        <Skills />
        <Writing />
        <Contact />
      </div>
      <Nav active={active} setActive={setActive} />
      {showTweaks && <Tweaks theme={theme} setTheme={setTheme} onClose={() => setShowTweaks(false)} />}
      <button className="theme-toggle-btn" onClick={() => setShowTweaks(true)} style={{position:'fixed', right:20, bottom:20, zIndex:100, width:40, height:40, borderRadius:'50%', background:'var(--ink)', color:'var(--bg)', border: '1px solid var(--hairline)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, cursor:'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'}}>⚙</button>
    </div>
  );
}
