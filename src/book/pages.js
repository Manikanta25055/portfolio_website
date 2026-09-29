import React from 'react';
import ProjectIllustration from '../components/ProjectDiagrams';
import goldmanSachsLogo from '../assets/goldman-sachs.png';
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

export const BOOK_TITLE = 'A GVM’s Engineering Journal';
export const BOOK_SUBTITLE = 'From Instruction Set to Working System';
export const RESUME = `${process.env.PUBLIC_URL}/Gonugondla_Veera_Manikanta_Resume.pdf`;
const asset = (path) => `${process.env.PUBLIC_URL}${path}`;
const dash = (text) => text.replace(/ - /g, ' – ');

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
const WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
const FRONT_MATTER = 6;

const COMPANY_SHORT = {
  'Boeing India Private Limited': 'Boeing India',
  'Mindenious Edutech': 'Mindenious Edutech',
  'Apsis Solutions & IIT Guwahati': 'Apsis & IIT Guwahati',
  'IIIT Hyderabad': 'IIIT Hyderabad',
};

/* ------------------------------------------------------------------ */
/* Small typographic pieces                                            */
/* ------------------------------------------------------------------ */

function Ref({ ctx, to, children, className = '' }) {
  return (
    <button type="button" className={`bk-ref ${className}`} onClick={() => ctx.go(to)}>
      {children}
    </button>
  );
}

function Opener({ number, title, subtitle }) {
  return (
    <div className="bk-opener">
      <span className="bk-opener-number">Chapter {WORDS[number - 1]}</span>
      <h2 className="bk-opener-title">{title}</h2>
      <p className="bk-opener-subtitle">{subtitle}</p>
      <span className="bk-rule" aria-hidden="true" />
    </div>
  );
}

function Lede({ children }) {
  return <p className="bk-p bk-lede">{children}</p>;
}

function InThisChapter({ ctx, items }) {
  return (
    <div className="bk-inchapter">
      <span className="bk-smallcaps">In this chapter</span>
      <ol>
        {items.map((item) => (
          <li key={item.to}>
            <Ref ctx={ctx} to={item.to} className="bk-leader">
              <span className="bk-leader-num">{item.num}</span>
              <span className="bk-leader-text">{item.label}</span>
              <span className="bk-leader-dots" aria-hidden="true" />
              <span className="bk-leader-page">{ctx.folio(item.to)}</span>
            </Ref>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Section({ num, title, meta, aside }) {
  return (
    <div className="bk-section">
      <div className="bk-section-top">
        <span className="bk-section-num">{num}</span>
        {aside && <span className="bk-section-aside">{aside}</span>}
      </div>
      <h3 className="bk-section-title">{title}</h3>
      {meta && <p className="bk-section-meta">{meta}</p>}
    </div>
  );
}

function Dashes({ items, compact = false }) {
  return (
    <ul className={`bk-dashes ${compact ? 'is-compact' : ''}`}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function Figures({ items }) {
  return (
    <dl className="bk-figures">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.value}</dt>
          <dd>{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}

function Tools({ label = 'Tools', items }) {
  return (
    <p className="bk-tools">
      <span className="bk-smallcaps">{label}</span> {items.join(' · ')}
    </p>
  );
}

function Fleuron() {
  return (
    <svg className="bk-fleuron" viewBox="0 0 120 14" aria-hidden="true">
      <path d="M2 7h44M74 7h44" />
      <path d="M60 1.5l5.5 5.5L60 12.5 54.5 7z" />
      <circle cx="49.5" cy="7" r="1.2" />
      <circle cx="70.5" cy="7" r="1.2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Front matter                                                        */
/* ------------------------------------------------------------------ */

function TitlePage() {
  return (
    <div className="bk-title-page">
      <span className="bk-smallcaps bk-red">Volume I · MMXXVI</span>
      <h1 className="bk-title">
        <span className="bk-title-kicker">A GVM’s</span>
        Engineering
        <br />
        <em>Journal</em>
      </h1>
      <Fleuron />
      <p className="bk-title-note">{BOOK_SUBTITLE}.<br />Notes on hardware, systems and operations, 2023 to 2026</p>
      <p className="bk-title-author">{PERSONAL.name}</p>
      <div className="bk-imprint">
        <span className="bk-monogram">{PERSONAL.initials}</span>
        <span className="bk-smallcaps">Hyderabad · MMXXVI</span>
      </div>
    </div>
  );
}

function Colophon() {
  return (
    <div className="bk-colophon">
      <p><em>{BOOK_TITLE}</em><br />{BOOK_SUBTITLE}<br />by {PERSONAL.name} (GVM)</p>
      <p>First published online at {PERSONAL.website}.<br />This edition revised September 2026.</p>
      <p>© 2026 {PERSONAL.name}. All rights reserved.</p>
      <p>
        Figures quoted in these pages are taken from the author’s project records and résumé.
        Indian Patent Applications 202641090505 and 202541059846 are described in Chapters Three and Five.
      </p>
      <p>Set in Fraunces and Space Grotesk. Diagrams labelled in JetBrains Mono.</p>
      <p>
        A single-sheet edition of this journal is available as a{' '}
        <a href={RESUME} target="_blank" rel="noreferrer">résumé (PDF)</a>.
      </p>
      <p className="bk-colophon-mark">
        <span className="bk-monogram is-small">{PERSONAL.initials}</span>
        {PERSONAL.location}
      </p>
    </div>
  );
}

function Contents({ ctx }) {
  const Row = ({ to, num, label, sub }) => (
    <li className={sub ? 'is-sub' : ''}>
      <Ref ctx={ctx} to={to} className="bk-leader">
        {num !== undefined && <span className="bk-leader-num">{num}</span>}
        <span className="bk-leader-text">{label}</span>
        <span className="bk-leader-dots" aria-hidden="true" />
        <span className="bk-leader-page">{ctx.folio(to)}</span>
      </Ref>
    </li>
  );

  return (
    <div className="bk-contents">
      <h2 className="bk-matter-title">Contents</h2>
      <ol className="bk-toc">
        <Row to="acknowledgements" label="Acknowledgements" />
        <Row to="introduction" label="Introduction" />
        <Row to="glance" label="At a glance" />
      </ol>
      <ol className="bk-toc">
        <Row to="ch-education" num="1" label="Education" />
        <Row to="ch-education" sub label="Manipal Institute of Technology" />
        <Row to="iitm" sub label="Indian Institute of Technology Madras" />
        <Row to="ch-experience" num="2" label="Experience" />
        {EXPERIENCE.map((item, index) => (
          <Row key={item.company} to={`exp-${index}`} sub label={COMPANY_SHORT[item.company] || item.company} />
        ))}
        <Row to="ch-projects" num="3" label="Projects" />
        {PROJECTS.map((project) => (
          <Row key={project.id} to={`project-${project.id}`} sub label={project.title} />
        ))}
        <Row to="ch-toolkit" num="4" label="Toolkit" />
        <Row to="ch-research" num="5" label="Research & Recognition" />
        <Row to="ch-correspondence" num="6" label="Correspondence" />
      </ol>
      <ol className="bk-toc">
        <Row to="index" label="Index" />
        <Row to="author" label="About the Author" />
      </ol>
    </div>
  );
}

function Acknowledgements() {
  return (
    <div className="bk-prose">
      <h2 className="bk-matter-title">Acknowledgements</h2>
      <p className="bk-p">
        Very little of the hardware in this journal was built alone, and none of it would have been
        finished without the people who asked the awkward questions early.
      </p>
      <p className="bk-p">
        My thanks to the faculty of the Department of Electrical &amp; Electronics Engineering at
        Manipal Institute of Technology, and to the instructors of the BS in Electronic Systems at
        IIT Madras, whose two timetables somehow made room for each other.
      </p>
      <p className="bk-p">
        To the systems and digital engineering team at Boeing India, for a summer of real data and
        real consequences. To the mentors from IIT Guwahati, who checked our factory numbers against
        the floor logs, line by line. To my co-inventors on Garuda and bREADth, for the arguments
        that made both designs better, and to the judges of the IITM Gadget Expo for taking a
        low-cost idea seriously.
      </p>
      <p className="bk-p">
        And to everyone who lent a board, a bench or an hour of their evening: the mistakes that
        remain are mine; the ones that were caught are very often yours.
      </p>
      <p className="bk-signoff">GVM<br /><span>Hyderabad, 2026</span></p>
    </div>
  );
}

function Introduction() {
  return (
    <div className="bk-prose">
      <h2 className="bk-matter-title">Introduction</h2>
      <Lede>
        I design digital hardware from the instruction set upward and get it running on a board.
        The satisfaction is in the last step: the moment a design that only existed as text closes
        timing, boots, and does what the specification said it would.
      </Lede>
      <p className="bk-p">
        My current work is MAK8u, a dual-core microcontroller in SystemVerilog that closes post-route
        on an Artix-7 at 50 and 100 MHz, backed by 126 testbenches. I am co-inventor on two Indian
        patent applications, and I spent the summer of 2026 as a Systems &amp; Digital Engineering
        Intern at Boeing India.
      </p>
      <p className="bk-p">
        This journal collects that work in roughly the order it happened. Chapter One covers two
        degrees taken side by side; Chapter Two, the internships that tested them; Chapter Three,
        six systems, each with the numbers that matter. The chapters after that set out the tools,
        the research, and the ways to reach me.
      </p>
      <p className="bk-p">
        The next chapter is already in outline. I join {UPCOMING_ROLE.company} as an{' '}
        {UPCOMING_ROLE.role}, and I intend to bring the habit that runs through every page here:
        build it, measure it, then make it better.
      </p>
      <p className="bk-reading-note">
        Turn a page by dragging its corner, by clicking near its outer edge, or with the arrow keys.
        Entries in the contents and the index can be followed directly.
      </p>
    </div>
  );
}

const PRACTICE_AREAS = [
  { label: 'Digital hardware', detail: 'ISA, RTL, FPGA and verification' },
  { label: 'Embedded & edge AI', detail: 'Sensors, firmware and local inference' },
  { label: 'Engineering analytics', detail: 'Forecasting, ML and explainability' },
  { label: 'Operations', detail: 'Process, reliability and improvement' },
];

function AtAGlance() {
  const [logoFailed, setLogoFailed] = React.useState(false);
  return (
    <div className="bk-prose">
      <h2 className="bk-matter-title">At a Glance</h2>
      <table className="bk-glance">
        <tbody>
          {STATS.map((stat) => (
            <tr key={stat.label}>
              <th scope="row">{stat.value}</th>
              <td>{stat.label}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="bk-minor-head">Four areas of practice</h3>
      <p className="bk-p bk-small">
        They run in parallel rather than in sequence, and most projects in this journal touch at
        least two of them.
      </p>
      <dl className="bk-areas">
        {PRACTICE_AREAS.map((area) => (
          <div key={area.label}>
            <dt>{area.label}</dt>
            <dd>{area.detail}</dd>
          </div>
        ))}
      </dl>

      <div className="bk-forthcoming">
        <span className="bk-smallcaps bk-red">Forthcoming</span>
        <div className="bk-forthcoming-row">
          {logoFailed ? (
            <span className="bk-forthcoming-fallback">Goldman Sachs</span>
          ) : (
            <img src={goldmanSachsLogo} alt="Goldman Sachs" onError={() => setLogoFailed(true)} />
          )}
          <p>
            <strong>{UPCOMING_ROLE.role}</strong>
            <br />
            <em>{UPCOMING_ROLE.company}</em>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter One: Education                                              */
/* ------------------------------------------------------------------ */

function EducationRecord({ item, num }) {
  return (
    <div className="bk-record">
      <div className="bk-record-head">
        <img className="bk-seal" src={asset(item.logo)} alt="" />
        <div>
          <span className="bk-section-num">{num}</span>
          <h3 className="bk-section-title">{item.institution}</h3>
        </div>
      </div>
      <table className="bk-ledger">
        <tbody>
          <tr><th scope="row">Programme</th><td>{item.degree}</td></tr>
          <tr><th scope="row">Period</th><td>{dash(item.period)}</td></tr>
          <tr><th scope="row">CGPA</th><td>{item.cgpa} <span className="bk-muted">({item.progress.toLowerCase()})</span></td></tr>
          <tr><th scope="row">Note</th><td>{item.detail}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

function TwoCalendars() {
  // July 2023 → December 2027 on a shared axis.
  const x = (year, month) => 18 + ((year - 2023) * 12 + (month - 7)) * (344 / 54);
  return (
    <figure className="bk-figure">
      <svg viewBox="0 0 380 104" aria-hidden="true">
        {[2023, 2024, 2025, 2026, 2027].map((year) => (
          <g key={year}>
            <path className="bk-fig-tick" d={`M${x(year, year === 2023 ? 7 : 1)} 86V92`} />
            <text className="bk-fig-label" x={x(year, year === 2023 ? 7 : 1)} y="102">{year}</text>
          </g>
        ))}
        <path className="bk-fig-axis" d={`M18 86H${x(2027, 12)}`} />
        <rect className="bk-fig-bar" x={x(2023, 7)} y="20" width={x(2027, 9) - x(2023, 7)} height="16" />
        <text className="bk-fig-bar-label" x={x(2023, 7) + 8} y="31">BTECH · MIT MANIPAL</text>
        <rect className="bk-fig-bar is-alt" x={x(2023, 7)} y="50" width={x(2027, 12) - x(2023, 7)} height="16" />
        <text className="bk-fig-bar-label is-alt" x={x(2023, 7) + 8} y="61">BS · IIT MADRAS</text>
        <path className="bk-fig-now" d={`M${x(2026, 9)} 12V80`} />
        <text className="bk-fig-now-label" x={x(2026, 9) - 4} y="10">SEP 2026</text>
      </svg>
      <figcaption><span>Fig. 1.1</span> Two programmes on one calendar, July 2023 to December 2027.</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter Two: Experience                                             */
/* ------------------------------------------------------------------ */

function ExperienceEntry({ item, num, logo, figures }) {
  return (
    <div className="bk-entry">
      <Section
        num={num}
        title={dash(item.role)}
        meta={<><span className="bk-company">{item.company}</span><em>{dash(item.period)}</em></>}
        aside={logo && item.logo ? <img className="bk-entry-logo" src={asset(item.logo)} alt={item.company} /> : null}
      />
      <Dashes items={item.bullets} compact={item.bullets.length > 3} />
      {figures && <Figures items={figures} />}
      <Tools items={item.skills} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter Three: Projects                                             */
/* ------------------------------------------------------------------ */

function ProjectHead({ project, num }) {
  return (
    <Section
      num={num}
      title={project.title}
      aside={<span className="bk-smallcaps bk-red">{project.badge}</span>}
      meta={<><span>{project.subtitle}</span><em>{dash(project.period)}</em></>}
    />
  );
}

function ProjectFoot({ project }) {
  return (
    <>
      <Tools label="Built with" items={project.stack} />
      {project.link && (
        <p className="bk-source">
          Source: <a href={project.link} target="_blank" rel="noreferrer">{project.link.replace('https://', '')}</a>
        </p>
      )}
    </>
  );
}

function ProjectPage({ project, num, figure }) {
  return (
    <div className="bk-project">
      <ProjectHead project={project} num={num} />
      <ProjectIllustration projectId={project.id} figure={figure} />
      <p className="bk-p">{project.overview}</p>
      <Figures items={project.metrics} />
      <Dashes items={project.highlights} />
      <ProjectFoot project={project} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Index                                                               */
/* ------------------------------------------------------------------ */

function buildIndex(pages, folioOf) {
  const terms = new Map();
  const add = (term, key) => {
    const id = term.toLowerCase();
    if (!terms.has(id)) terms.set(id, { term, keys: new Set() });
    terms.get(id).keys.add(key);
  };

  EXPERIENCE.forEach((item, index) => {
    item.skills.forEach((skill) => add(skill, `exp-${index}`));
    add(COMPANY_SHORT[item.company] || item.company, `exp-${index}`);
  });
  PROJECTS.forEach((project) => {
    project.stack.forEach((item) => add(item, `project-${project.id}`));
    add(project.title.replace('Project ', ''), `project-${project.id}`);
  });
  [
    ['Artix-7', 'project-mak8u'], ['Clock-domain crossing', 'project-mak8u'], ['Mutation testing', 'project-mak8u'],
    ['Timing closure', 'project-mak8u'], ['ISA', 'project-mak8u'], ['Patents', 'ch-research'],
    ['IITM Gadget Expo', 'ch-research'], ['IEEE Sensors Journal', 'ch-research'], ['Certifications', 'certifications'],
    ['MIT Manipal', 'ch-education'], ['IIT Madras', 'iitm'], ['Goldman Sachs', 'exp-future'],
    ['Edge AI', 'project-garuda'], ['Sensor Fusion', 'project-breadth'], ['SCADA', 'project-thermal'],
    ['Isolation Forest', 'project-thermal'], ['Flyback converter', 'project-battery'], ['Arm', 'certifications'],
  ].forEach(([term, key]) => add(term, key));

  const valid = new Set(pages.map((page) => page.key));
  return Array.from(terms.values())
    .map(({ term, keys }) => ({
      term,
      refs: Array.from(keys).filter((key) => valid.has(key)).map((key) => ({ key, folio: folioOf(key) }))
        .filter((ref, i, all) => all.findIndex((other) => other.folio === ref.folio) === i)
        .sort((a, b) => Number(a.folio) - Number(b.folio)),
    }))
    .filter((entry) => entry.refs.length)
    .sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));
}

function IndexColumns({ ctx, entries, heading }) {
  let letter = '';
  return (
    <div className="bk-index">
      {heading ? <h2 className="bk-matter-title">Index</h2> : <span className="bk-index-cont">Index, continued</span>}
      <div className="bk-index-cols">
        {entries.map((entry) => {
          const first = entry.term[0].toUpperCase();
          const showLetter = first !== letter;
          letter = first;
          return (
            <React.Fragment key={entry.term}>
              {showLetter && <span className="bk-index-letter">{first}</span>}
              <p className="bk-index-entry">
                {entry.term}
                {entry.refs.map((ref, i) => (
                  <React.Fragment key={ref.key}>
                    {', '}
                    <Ref ctx={ctx} to={ref.key}>{ref.folio}</Ref>
                  </React.Fragment>
                ))}
              </p>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The book                                                            */
/* ------------------------------------------------------------------ */

export function buildBook() {
  const [mak8u, ...otherProjects] = PROJECTS;
  const [manipal, iitm] = EDUCATION;
  const [boeing, mindenious, apsis, iiith] = EXPERIENCE;
  const [skillsA, skillsB, skillsC, skillsD] = SKILL_GROUPS;

  const pages = [];
  const add = (key, config) => pages.push({ key, ...config });

  // Front matter
  add('title', { plain: true, render: () => <TitlePage /> });
  add('colophon', { plain: true, render: () => <Colophon /> });
  add('contents', { head: 'Contents', render: (ctx) => <Contents ctx={ctx} /> });
  add('acknowledgements', { head: 'Acknowledgements', render: () => <Acknowledgements /> });
  add('introduction', { head: 'Introduction', render: () => <Introduction /> });
  add('glance', { head: 'Introduction', render: () => <AtAGlance /> });

  // One — Education
  add('ch-education', {
    opener: true,
    head: 'Education',
    render: () => (
      <>
        <Opener number={1} title="Education" subtitle="Two programmes, pursued together" />
        <Lede>
          An on-campus engineering degree at Manipal and an online electronic-systems degree at
          IIT Madras, both begun in July 2023 and carried at the same time.
        </Lede>
        <EducationRecord item={manipal} num="1.1" />
      </>
    ),
  });
  add('iitm', {
    head: 'Education',
    render: () => (
      <>
        <EducationRecord item={iitm} num="1.2" />
        <TwoCalendars />
        <p className="bk-p bk-small">
          The BTech is taught on campus in Manipal; the BS runs online, with in-person examinations,
          alongside it. Neither was paused for the other.
        </p>
      </>
    ),
  });

  // Two — Experience
  add('ch-experience', {
    opener: true,
    head: 'Experience',
    render: (ctx) => (
      <>
        <Opener number={2} title="Experience" subtitle="Work measured in outcomes" />
        <Lede>
          Engineering experience across aerospace analytics, digital design, industrial automation
          and product development, recorded here with what each piece of work actually changed.
        </Lede>
        <InThisChapter
          ctx={ctx}
          items={[
            ...EXPERIENCE.map((item, index) => ({ to: `exp-${index}`, num: `2.${index + 1}`, label: COMPANY_SHORT[item.company] || item.company })),
            { to: 'exp-future', num: '2.5', label: 'Forthcoming' },
          ]}
        />
      </>
    ),
  });
  add('exp-0', { head: 'Experience', render: () => (
    <ExperienceEntry
      item={boeing}
      num="2.1"
      logo
      figures={[
        { value: '6,900+', label: 'maintenance records' },
        { value: '11', label: 'forecasting algorithms' },
        { value: '0.964', label: 'F1, failure model' },
        { value: '40+', label: 'hours saved a month' },
      ]}
    />
  ) });
  add('exp-1', {
    head: 'Experience',
    alias: ['exp-2'],
    render: () => (
      <>
        <ExperienceEntry item={mindenious} num="2.2" />
        <ExperienceEntry item={apsis} num="2.3" />
      </>
    ),
  });
  add('exp-3', {
    head: 'Experience',
    alias: ['exp-future'],
    render: () => (
      <>
        <ExperienceEntry item={iiith} num="2.4" />
        <div className="bk-entry bk-next">
          <Section num="2.5" title={UPCOMING_ROLE.role} meta={<><span className="bk-company">{UPCOMING_ROLE.company}</span><em>Forthcoming</em></>} />
          <p className="bk-p">
            Joining Goldman Sachs with systems thinking, data analysis and disciplined process
            improvement: the same instincts that close timing on a chip, applied to the way work
            moves through an organisation.
          </p>
        </div>
      </>
    ),
  });

  // Three — Projects
  add('ch-projects', {
    opener: true,
    head: 'Projects',
    render: (ctx) => (
      <>
        <Opener number={3} title="Projects" subtitle="Built, tested and measured" />
        <Lede>
          Six current systems, from a custom instruction set to a factory floor. Each is described
          with a drawing, the figures that matter, and the details that made it work.
        </Lede>
        <InThisChapter
          ctx={ctx}
          items={PROJECTS.map((project, index) => ({ to: `project-${project.id}`, num: `3.${index + 1}`, label: project.title }))}
        />
      </>
    ),
  });
  add('project-mak8u', {
    head: 'Projects',
    render: () => (
      <div className="bk-project">
        <ProjectHead project={mak8u} num="3.1" />
        <ProjectIllustration projectId={mak8u.id} figure="3.1" />
        <p className="bk-p">{mak8u.overview}</p>
        <Figures items={mak8u.metrics} />
      </div>
    ),
  });
  add('project-mak8u-2', {
    head: 'Projects',
    render: () => (
      <div className="bk-project">
        <span className="bk-continued">3.1 MAK8u, continued</span>
        <h3 className="bk-minor-head is-first">Engineering highlights</h3>
        <Dashes items={mak8u.highlights} />
        <ProjectFoot project={mak8u} />
      </div>
    ),
  });
  otherProjects.forEach((project, index) => {
    add(`project-${project.id}`, {
      head: 'Projects',
      render: () => <ProjectPage project={project} num={`3.${index + 2}`} figure={`3.${index + 2}`} />,
    });
  });

  // Four — Toolkit
  const SkillGroup = ({ group, num }) => (
    <div className="bk-skill">
      <h3 className="bk-skill-title"><span>{num}</span>{group.title}</h3>
      <p className="bk-skill-items">{group.items.join(' · ')}</p>
    </div>
  );
  add('ch-toolkit', {
    opener: true,
    head: 'Toolkit',
    render: () => (
      <>
        <Opener number={4} title="Toolkit" subtitle="Across the full hardware stack" />
        <Lede>
          Architecture, RTL, verification, implementation, embedded software, interfaces and lab
          instrumentation: the working vocabulary behind the projects in Chapter Three.
        </Lede>
        <SkillGroup group={skillsA} num="4.1" />
      </>
    ),
  });
  add('toolkit-2', {
    head: 'Toolkit',
    render: () => (
      <>
        <SkillGroup group={skillsB} num="4.2" />
        <SkillGroup group={skillsC} num="4.3" />
        <SkillGroup group={skillsD} num="4.4" />
      </>
    ),
  });

  // Five — Research
  add('ch-research', {
    opener: true,
    head: 'Research & Recognition',
    render: () => (
      <>
        <Opener number={5} title="Research & Recognition" subtitle="Ideas carried beyond the prototype" />
        {RESEARCH.map((item, index) => (
          <div className="bk-research" key={item.title}>
            <div className="bk-research-top">
              <span className="bk-section-num">5.{index + 1}</span>
              <span className="bk-smallcaps">{item.type}</span>
              <em>{item.status}</em>
            </div>
            <h3 className="bk-section-title">{item.title}</h3>
            <p className="bk-p">{item.detail}</p>
          </div>
        ))}
        <div className="bk-laurel">
          <span className="bk-smallcaps bk-red">5.3 · Recognition</span>
          <p><strong>First place</strong>, IITM Gadget Expo</p>
          <p className="bk-muted"><em>Best Low-Cost Solution, for Project Garuda.</em></p>
        </div>
      </>
    ),
  });
  add('certifications', {
    head: 'Research & Recognition',
    render: () => (
      <>
        <h3 className="bk-minor-head is-first">5.4 · Certifications</h3>
        <table className="bk-certs">
          <tbody>
            {CERTIFICATIONS.map((cert) => (
              <tr key={cert.title}>
                <td>
                  {cert.title}
                  {cert.credential && <sup>*</sup>}
                  <span>{cert.issuer}</span>
                </td>
                <td>{cert.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {CERTIFICATIONS.filter((cert) => cert.credential).map((cert) => (
          <p className="bk-footnote" key={cert.title}>
            <sup>*</sup> Credential ID <span className="bk-mono">{cert.credential}</span>
          </p>
        ))}
      </>
    ),
  });

  // Six — Correspondence
  add('ch-correspondence', {
    opener: true,
    head: 'Correspondence',
    render: () => (
      <>
        <Opener number={6} title="Correspondence" subtitle="Let’s build something that has to work" />
        <Lede>
          For engineering, systems, operations and research conversations, letters are welcome,
          and they are answered.
        </Lede>
        <dl className="bk-address">
          <div><dt>Post</dt><dd><a href={`mailto:${PERSONAL.email}`}>{PERSONAL.email}</a></dd></div>
          <div><dt>LinkedIn</dt><dd><a href={`https://${PERSONAL.linkedin}`} target="_blank" rel="noreferrer">/in/veera-manikanta-gonugondla</a></dd></div>
          <div><dt>GitHub</dt><dd><a href={`https://${PERSONAL.github}`} target="_blank" rel="noreferrer">@Manikanta25055</a></dd></div>
          <div><dt>Telephone</dt><dd><a href={`tel:${PERSONAL.phoneHref}`}>{PERSONAL.phone}</a></dd></div>
          <div><dt>Résumé</dt><dd><a href={RESUME} target="_blank" rel="noreferrer">Download the PDF</a></dd></div>
        </dl>
        <p className="bk-signature">{PERSONAL.name}<span>{PERSONAL.location}</span></p>
      </>
    ),
  });

  // Back matter
  add('index', { head: 'Index', render: (ctx) => <IndexColumns ctx={ctx} entries={ctx.index.slice(0, ctx.indexSplit)} heading /> });
  add('index-2', { head: 'Index', render: (ctx) => <IndexColumns ctx={ctx} entries={ctx.index.slice(ctx.indexSplit)} /> });
  add('author', {
    head: 'About the Author',
    render: () => (
      <div className="bk-prose">
        <h2 className="bk-matter-title">About the Author</h2>
        <p className="bk-p">
          <strong>{PERSONAL.name}</strong> (GVM) is an electrical and electronics engineer working across
          digital hardware, embedded systems and edge AI, currently completing a BTech at Manipal
          Institute of Technology and a BS in Electronic Systems at IIT Madras side by side, and
          soon to join {UPCOMING_ROLE.company} as an {UPCOMING_ROLE.role}.
        </p>
        <p className="bk-p">
          Based in {PERSONAL.location}. Further notes, drawings and source code at {PERSONAL.website}{' '}
          and on GitHub.
        </p>
        <Fleuron />
        <h3 className="bk-minor-head">A note on the type</h3>
        <p className="bk-p bk-small">
          The text of this journal is set in Fraunces, a soft old-style serif by Undercase Type.
          Headings in small capitals and captions use Space Grotesk by Florian Karsten, and the
          engineering drawings are labelled in JetBrains Mono.
        </p>
      </div>
    ),
  });

  if (pages.length % 2) add('blank', { plain: true, render: () => null });

  // Numbering: roman for the front matter, arabic from Chapter One.
  const folios = new Map();
  pages.forEach((page, index) => {
    const folio = index < FRONT_MATTER ? ROMAN[index] : String(index - FRONT_MATTER + 1);
    page.folio = folio;
    page.index = index;
    folios.set(page.key, index);
    (page.alias || []).forEach((alias) => folios.set(alias, index));
  });

  const folioOf = (key) => {
    const index = folios.get(key);
    return index === undefined ? '' : pages[index].folio;
  };
  const indexOf = (key) => folios.get(key);
  const index = buildIndex(Array.from(folios.keys()).map((key) => ({ key })), folioOf);

  return { pages, folioOf, indexOf, index, indexSplit: Math.ceil(index.length / 2) };
}
