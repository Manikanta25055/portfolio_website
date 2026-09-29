import React, { useEffect, useRef, useState } from 'react';
import goldmanSachsLogo from '../assets/goldman-sachs.png';
import ProjectIllustration from './ProjectDiagrams';
import {
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  PERSONAL,
  PROJECTS,
  RESEARCH,
  SKILL_GROUPS,
  STATS,
  UPCOMING_ROLE,
} from '../data/portfolio';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'research', label: 'Research' },
  { id: 'contact', label: 'Contact' },
];

const asset = (path) => `${process.env.PUBLIC_URL}${path}`;

function useActiveSection() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const sections = NAV_ITEMS
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    if (!('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-18% 0px -66% 0px', threshold: [0, 0.08, 0.3] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return [active, setActive];
}

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
      frame = undefined;
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}

function useHeaderVisibility(menuOpen) {
  const [hidden, setHidden] = useState(false);
  const previousScroll = useRef(0);

  useEffect(() => {
    if (menuOpen) setHidden(false);

    const updateVisibility = () => {
      const currentScroll = Math.max(window.scrollY, 0);
      const movement = currentScroll - previousScroll.current;

      if (menuOpen || currentScroll <= 24) {
        setHidden(false);
      } else if (movement > 1) {
        setHidden(true);
      } else if (movement < -1) {
        setHidden(false);
      }

      previousScroll.current = currentScroll;
    };

    previousScroll.current = Math.max(window.scrollY, 0);
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, [menuOpen]);

  return hidden;
}

function Header({ active, onNavigate }) {
  const [open, setOpen] = useState(false);
  const scrollProgress = useScrollProgress();
  const hidden = useHeaderVisibility(open);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const navigate = (id) => {
    setOpen(false);
    onNavigate(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={`site-header ${hidden ? 'is-hidden' : ''}`}>
      <div className="nav-shell">
        <button className="brand" type="button" onClick={() => navigate('home')} aria-label="Go to home">
          <span className="brand-mark">{PERSONAL.initials}</span>
          <span className="brand-copy">
            <strong>Engineering Journal</strong>
            <span>Veera Manikanta Gonugondla</span>
          </span>
        </button>

        <nav id="primary-navigation" className={`primary-nav ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={active === item.id ? 'is-active' : ''}
              type="button"
              aria-current={active === item.id ? 'page' : undefined}
              onClick={() => navigate(item.id)}
            >
              {item.label}
            </button>
          ))}
          <a className="nav-resume" href={asset('/Gonugondla_Veera_Manikanta_Resume.pdf')} download>
            Résumé <span aria-hidden="true">↓</span>
          </a>
        </nav>

        <div className="header-controls">
          <button
            className="menu-toggle"
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true">{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </div>
      <span className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />
    </header>
  );
}

function SectionHeading({ number, eyebrow, title, intro }) {
  return (
    <div className="section-heading" data-reveal>
      <div>
        <span className="section-index">{number} / {eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {intro && <p>{intro}</p>}
    </div>
  );
}

const PRACTICE_AREAS = [
  { label: 'Digital hardware', detail: 'ISA · RTL · FPGA · verification' },
  { label: 'Embedded & edge AI', detail: 'Sensors · firmware · local inference' },
  { label: 'Engineering analytics', detail: 'Forecasting · ML · explainability' },
  { label: 'Operations', detail: 'Process · reliability · improvement' },
];

function PracticeMap() {
  return (
    <figure className="practice-map" data-reveal>
      <figcaption>
        <span>Practice map</span>
        <strong>Systems thinking across hardware, intelligence, data, and operations.</strong>
        <p>Four parallel areas grounded in building, measuring, and improving real systems.</p>
      </figcaption>
      <div className="practice-graphic" aria-hidden="true">
        <span className="practice-core">Systems</span>
        <i className="practice-orbit practice-orbit-one" />
        <i className="practice-orbit practice-orbit-two" />
        <i className="practice-pulse" />
      </div>
      <ol className="practice-areas">
        {PRACTICE_AREAS.map((area, index) => (
          <li className="practice-area" key={area.label}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{area.label}</strong>
            <small>{area.detail}</small>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function useScrollCue() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const update = () => setVisible(window.scrollY < 40);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return visible;
}

function Hero() {
  const [logoFailed, setLogoFailed] = useState(false);
  const showScrollCue = useScrollCue();

  return (
    <section id="home" className="hero-section">
      <div className="hero-copy" data-reveal>
        <div className="availability"><span /> Hyderabad, India</div>
        <p className="hero-kicker">{PERSONAL.name}</p>
        <h1>From instruction set<br />to <em>working system.</em></h1>
        <p className="hero-summary">{PERSONAL.summary}</p>

        <div className="hero-actions">
          <a className="button button-primary" href={`mailto:${PERSONAL.email}`}>Start a conversation <span aria-hidden="true">↗</span></a>
          <a className="button" href={asset('/Gonugondla_Veera_Manikanta_Resume.pdf')} target="_blank" rel="noreferrer">View résumé</a>
        </div>

        <a
          className={`scroll-cue ${showScrollCue ? '' : 'is-hidden'}`}
          href="#experience"
          aria-label="Scroll to experience"
          tabIndex={showScrollCue ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 9.5l6 6 6-6" />
          </svg>
        </a>
      </div>

      <aside className="upcoming-card" data-reveal aria-label={`${UPCOMING_ROLE.label} ${UPCOMING_ROLE.role} at ${UPCOMING_ROLE.company}`}>
        <div className="upcoming-label"><span /> {UPCOMING_ROLE.label}</div>
        <div className="upcoming-logo-wrap">
          {logoFailed ? (
            <span className="goldman-fallback" aria-label="Goldman Sachs">Goldman<br />Sachs</span>
          ) : (
            <img
              src={goldmanSachsLogo}
              alt="Goldman Sachs"
              width="186"
              height="78"
              decoding="sync"
              onError={() => setLogoFailed(true)}
            />
          )}
        </div>
        <div className="upcoming-role">{UPCOMING_ROLE.role}</div>
        <div className="upcoming-company">@ {UPCOMING_ROLE.company}</div>
        <p>Joining Goldman Sachs with systems thinking, data analysis, and disciplined process improvement.</p>
      </aside>

      <PracticeMap />

      <div className="stat-strip" data-reveal>
        {STATS.map((stat) => (
          <div className="stat-item" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="content-section">
      <SectionHeading
        number="01"
        eyebrow="Experience"
        title="Work measured in outcomes."
        intro="Engineering experience across aerospace analytics, digital design, industrial automation, and product development."
      />
      <div className="experience-list">
        {EXPERIENCE.map((experience, index) => (
          <article className="experience-item" key={`${experience.company}-${experience.period}`} data-reveal>
            <div className="experience-rail">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <time>{experience.period}</time>
            </div>
            <div className="experience-body">
              <div className="experience-title-row">
                <div>
                  <h3>{experience.role}</h3>
                  <p className="company-name">{experience.company}</p>
                </div>
                {experience.logo && <img className="company-logo" src={asset(experience.logo)} alt="Boeing" />}
              </div>
              <ul>
                {experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
              <div className="tag-list">
                {experience.skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectModal({ project, figure, onClose }) {
  const closeRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;

      const focusable = Array.from(modalRef.current?.querySelectorAll('button, [href]') || []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        ref={modalRef}
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} className="modal-close" type="button" onClick={onClose} aria-label="Close project details">×</button>
        <div className="modal-scroll">
          <header className="modal-header">
            <div className="modal-meta">
              <span className="project-badge">{project.badge}</span>
              <time>{project.period}</time>
            </div>
            <h2 id="project-modal-title">{project.title}</h2>
            <p className="modal-subtitle">{project.subtitle}</p>
          </header>
          <ProjectIllustration projectId={project.id} figure={figure} />
          <p className="modal-overview">{project.overview}</p>

          <div className="metric-grid modal-metrics">
            {project.metrics.map((metric) => (
              <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
            ))}
          </div>

          <h3 className="modal-heading">Engineering highlights</h3>
          <ul className="modal-highlights">
            {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>

          <div className="tag-list">
            {project.stack.map((item) => <span key={item}>{item}</span>)}
          </div>
          {project.link && (
            <a className="button button-primary modal-link" href={project.link} target="_blank" rel="noreferrer">View repository <span aria-hidden="true">↗</span></a>
          )}
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="content-section">
      <SectionHeading
        number="02"
        eyebrow="Selected systems"
        title="Built, tested, and measured."
        intro="Six current projects from the résumé and LinkedIn, with the performance figures and implementation details that matter."
      />

      <div className="project-grid">
        {PROJECTS.map((project, index) => (
          <button className="project-card" type="button" key={project.id} onClick={() => setSelectedProject(project)} data-reveal>
            <div className="project-card-top">
              <span>P/{String(index + 1).padStart(2, '0')}</span>
              <time>{project.period}</time>
            </div>
            <ProjectIllustration projectId={project.id} figure={index + 1} />
            <span className="project-badge">{project.badge}</span>
            <h3>{project.title}</h3>
            <p className="project-subtitle">{project.subtitle}</p>
            <p className="project-overview">{project.overview}</p>
            <div className="metric-grid">
              {project.metrics.map((metric) => (
                <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
              ))}
            </div>
            <div className="project-card-footer"><span>Read case study</span><span aria-hidden="true">↗</span></div>
          </button>
        ))}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          figure={PROJECTS.indexOf(selectedProject) + 1}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="content-section">
      <SectionHeading
        number="03"
        eyebrow="Technical skills"
        title="Across the full hardware stack."
        intro="Architecture, RTL, verification, implementation, embedded software, interfaces, and lab instrumentation."
      />
      <div className="skills-grid">
        {SKILL_GROUPS.map((group, index) => (
          <article className="skill-card" key={group.title} data-reveal>
            <span className="skill-number">0{index + 1}</span>
            <h3>{group.title}</h3>
            <div className="skill-list">
              {group.items.map((item) => <span key={item}>{item}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="education" className="content-section">
      <SectionHeading
        number="04"
        eyebrow="Education"
        title="Two programmes, pursued together."
        intro="An on-campus engineering degree at Manipal and an online electronic-systems degree at IIT Madras."
      />
      <div className="education-grid">
        {EDUCATION.map((education) => (
          <article className="education-card" key={education.shortName} data-reveal>
            <div className="education-logo"><img src={asset(education.logo)} alt={`${education.shortName} logo`} /></div>
            <div className="education-copy">
              <div className="education-meta"><span>{education.shortName}</span><time>{education.period}</time></div>
              <h3>{education.degree}</h3>
              <p className="education-institution">{education.institution}</p>
              <div className="education-facts">
                <div><strong>{education.cgpa}</strong><span>CGPA</span></div>
                <div><strong>{education.progress}</strong><span>Progress</span></div>
              </div>
              <p className="education-detail">{education.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Research() {
  const [certificateQuery, setCertificateQuery] = useState('');
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const normalizedQuery = certificateQuery.trim().toLowerCase();
  const filteredCertificates = CERTIFICATIONS.filter((certificate) => (
    `${certificate.title} ${certificate.issuer} ${certificate.date}`.toLowerCase().includes(normalizedQuery)
  ));
  const visibleCertificates = normalizedQuery || showAllCertificates
    ? filteredCertificates
    : filteredCertificates.slice(0, 5);

  return (
    <section id="research" className="content-section">
      <SectionHeading
        number="05"
        eyebrow="Research & recognition"
        title="Ideas carried beyond the prototype."
        intro="Patent applications, peer-reviewed work in progress, certifications, and recognition."
      />
      <div className="research-layout">
        <div className="research-list">
          {RESEARCH.map((item) => (
            <article className="research-item" key={item.title} data-reveal>
              <span>{item.type}</span>
              <div><h3>{item.title}</h3><p>{item.detail}</p></div>
              <strong>{item.status}</strong>
            </article>
          ))}
        </div>

        <aside className="recognition-card" data-reveal>
          <span className="section-index">Recognition</span>
          <strong>1st Place</strong>
          <h3>IITM Gadget Expo</h3>
          <p>Best Low-Cost Solution for Project Garuda.</p>
        </aside>
      </div>

      <div className="certification-list" data-reveal>
        <div className="certification-header">
          <div>
            <span className="section-index">Certifications</span>
            <p>{filteredCertificates.length} credential{filteredCertificates.length === 1 ? '' : 's'}</p>
          </div>
          <label className="certificate-search">
            <span>Filter</span>
            <input
              type="search"
              value={certificateQuery}
              aria-label="Filter certifications"
              placeholder="Title, issuer, or year"
              onChange={(event) => setCertificateQuery(event.target.value)}
            />
          </label>
        </div>
        {visibleCertificates.map((certificate) => (
          <div className="certificate" key={certificate.title}>
            <div className="certificate-title">
              <span>{certificate.title}</span>
              {certificate.credential && <small>Credential ID {certificate.credential}</small>}
            </div>
            <span>{certificate.issuer}</span>
            <time>{certificate.date}</time>
          </div>
        ))}
        {!visibleCertificates.length && <p className="certificate-empty">No certifications match this filter.</p>}
        {!normalizedQuery && CERTIFICATIONS.length > 5 && (
          <button className="certificate-disclosure" type="button" onClick={() => setShowAllCertificates((value) => !value)}>
            {showAllCertificates ? 'Show fewer' : `Show all ${CERTIFICATIONS.length}`}
          </button>
        )}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact-section" data-reveal>
      <span className="section-index">06 / Contact</span>
      <div className="contact-grid">
        <div>
          <h2>Let’s build something<br /><em>that has to work.</em></h2>
          <p>For engineering, systems, operations, and research conversations.</p>
        </div>
        <div className="contact-links">
          <a href={`mailto:${PERSONAL.email}`}><span>Email</span><strong>{PERSONAL.email}</strong><i>↗</i></a>
          <a href={`https://${PERSONAL.linkedin}`} target="_blank" rel="noreferrer"><span>LinkedIn</span><strong>/in/veera-manikanta-gonugondla-349bb729a</strong><i>↗</i></a>
          <a href={`https://${PERSONAL.github}`} target="_blank" rel="noreferrer"><span>GitHub</span><strong>@Manikanta25055</strong><i>↗</i></a>
          <a href={`tel:${PERSONAL.phoneHref}`}><span>Phone</span><strong>{PERSONAL.phone}</strong><i>↗</i></a>
        </div>
      </div>
      <footer>
        <span>© {new Date().getFullYear()} {PERSONAL.name}</span>
        <span>{PERSONAL.location}</span>
      </footer>
    </section>
  );
}

export default function EngineeringJournal() {
  const [active, setActive] = useActiveSection();
  useReveal();

  useEffect(() => {
    delete document.documentElement.dataset.theme;
    window.localStorage.removeItem('portfolio-theme');
  }, []);

  return (
    <div className="portfolio-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header active={active} onNavigate={setActive} />
      <main id="main-content">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Research />
        <Contact />
      </main>
    </div>
  );
}
