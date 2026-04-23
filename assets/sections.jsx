/* global React, PORTFOLIO_DATA, UI */
const { useState: useState2 } = React;

function Work() {
  const { experience, education } = PORTFOLIO_DATA;
  return (
    <section id="work" data-screen-label="02 Work">
      <UI.SH num="02" eyebrow="Experience &amp; Education" title="What I've shipped, and where I've trained."
        right="Three roles in IoT and VLSI alongside concurrent dual-degree coursework." />
      <div className="timeline">
        {experience.map((e, i) => (
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
        {education.map((e, i) => (
          <div className="tl-row" key={'ed'+i}>
            <div className="tl-period">{e.years}</div>
            <div className="tl-main">
              <h3>{e.deg}</h3>
              <div className="tl-co"><strong>{e.inst}</strong> · {e.sem} · CGPA {e.cgpa}/10</div>
              <div className="tl-bullets">
                {e.minor && <div className="tl-bullet">Minor: {e.minor}</div>}
                <div className="tl-bullet">Concurrent dual-degree program — two institutions, parallel coursework.</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const { projects } = PORTFOLIO_DATA;
  const [open, setOpen] = useState2(null);
  return (
    <section id="projects" data-screen-label="03 Projects">
      <UI.SH num="03" eyebrow="Selected projects" title="Nine systems. One patent. A first place."
        right="Each card carries the problem, approach, role, team, and measured numbers. Tap for the full entry." />
      <div className="proj-grid">
        {projects.map((p, i) => (
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
            <div className="eyebrow" style={{marginBottom:12}}>{projects[open].badge || 'PROJECT'}</div>
            <h2>{projects[open].title}</h2>
            <div className="modal-period">{projects[open].subtitle} · {projects[open].period}</div>
            <div className="modal-section">
              <div className="modal-section-h">Overview</div>
              <p>{projects[open].blurb}</p>
            </div>
            <div className="modal-section">
              <div className="modal-section-h">Problem</div>
              <p>{projects[open].problem}</p>
            </div>
            <div className="modal-section">
              <div className="modal-section-h">Approach</div>
              <p>{projects[open].approach}</p>
            </div>
            <div className="stats" style={{marginTop:24, marginBottom:24}}>
              {projects[open].metrics.map((m,j) => (
                <div className="stat" key={j}>
                  <div className="stat-k">{m.k}</div>
                  <div className="stat-v">{m.v}</div>
                </div>
              ))}
            </div>
            <div className="modal-section">
              <div className="modal-section-h">Stack</div>
              <div className="proj-tech">
                {projects[open].tech.map(t => <span className="chip" key={t}>{t}</span>)}
              </div>
            </div>
            <div className="proj-meta" style={{marginTop:8}}>
              <div><b>Role</b> &nbsp;{projects[open].role}</div>
              <div><b>Team</b> &nbsp;{projects[open].team}</div>
            </div>
            {projects[open].link && (
              <a className="btn btn-primary" style={{marginTop:24}} href={`https://${projects[open].link}`} target="_blank" rel="noreferrer">
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
  const { skills } = PORTFOLIO_DATA;
  return (
    <section id="skills" data-screen-label="04 Skills">
      <UI.SH num="04" eyebrow="Technical surface" title="The tools I reach for."
        right="System-level: hardware → firmware → application." />
      <div className="skill-grid">
        {skills.map(g => (
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
  const { writing } = PORTFOLIO_DATA;
  return (
    <section id="writing" data-screen-label="05 Writing">
      <UI.SH num="05" eyebrow="Notes &amp; writing" title="Things I learned, written down."
        right="Short engineering notes from shipping the projects above." />
      <div className="writing">
        {writing.map((w,i) => (
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
  const { personal } = PORTFOLIO_DATA;
  return (
    <section id="contact" className="contact" data-screen-label="06 Contact">
      <span className="eyebrow">06 · Let's build something</span>
      <div className="contact-big">
        Have a hard problem?<br/>
        <span className="accent-word">Let's talk silicon.</span>
      </div>
      <div className="contact-links">
        <a className="clink" href={`mailto:${personal.email}`}>
          <div><span className="clink-label">Email</span><span>{personal.email}</span></div>
          <span className="clink-arrow">↗</span>
        </a>
        <a className="clink" href={`https://${personal.github}`} target="_blank" rel="noreferrer">
          <div><span className="clink-label">GitHub</span><span>{personal.github}</span></div>
          <span className="clink-arrow">↗</span>
        </a>
        <a className="clink" href={`https://${personal.linkedin}`} target="_blank" rel="noreferrer">
          <div><span className="clink-label">LinkedIn</span><span>{personal.linkedin}</span></div>
          <span className="clink-arrow">↗</span>
        </a>
        <a className="clink" href="#home">
          <div><span className="clink-label">Based in</span><span>{personal.location}</span></div>
          <span className="clink-arrow">↑</span>
        </a>
      </div>
      <div className="foot">
        <span>© 2026 {personal.name}</span>
        <span>Designed &amp; built by hand</span>
        <span>v26 · {new Date().toISOString().slice(0,10)}</span>
      </div>
    </section>
  );
}

window.SECTIONS = { Work, Projects, Skills, Writing, Contact };
