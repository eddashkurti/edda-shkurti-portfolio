import { experience, featuredProject, profile, projects, toolkit } from "./content";

const currentYear = new Date().getFullYear();

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

function Header() {
  return <header className="site-header">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <a className="brand" href="#top"><span>ES</span> / EDDA SHKURTI</a>
    <nav aria-label="Primary navigation"><a href="#work">Work <span>08</span></a><a href="#about">About</a><a href="#contact">Contact</a><a className="nav-github" href={profile.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a></nav>
  </header>;
}

function Hero() {
  return <section className="hero" id="top"><div className="hero-orbit" aria-hidden="true"><span>DATA</span><span>DESIGN</span><span>SYSTEMS</span></div><div className="hero-topline"><span>PORTFOLIO / 2026</span><span>PRISHTINA, XK</span></div><div className="hero-grid"><div className="hero-title-wrap"><p className="eyebrow">Computer Engineer / Data Builder</p><h1>Systems<br /><i>with a pulse.</i></h1></div><div className="hero-note"><span className="note-index">↳ 00</span><p>I design the connective tissue between raw data, useful software, and the people who need to trust it.</p><a href="#work">Enter the archive <Arrow /></a></div></div><div className="hero-footer"><span>SCROLL TO EXPLORE</span><span className="scroll-line" aria-hidden="true" /></div></section>;
}

function Featured() {
  return <article className="featured"><div className="feature-visual" aria-hidden="true"><span>RAW</span><span>→</span><span>TRUST</span><div className="feature-grid" /></div><div className="feature-copy"><p className="eyebrow">{featuredProject.eyebrow}</p><h3>{featuredProject.title}</h3><p>{featuredProject.description}</p><div className="tag-row">{featuredProject.technologies.map((item) => <span key={item}>{item}</span>)}</div><a className="button-link" href={featuredProject.href} target="_blank" rel="noreferrer">Open repository <Arrow /></a></div><div className="feature-signal"><span>LIVE SIGNAL</span><strong>{featuredProject.signal}</strong><small>01 / 08</small></div></article>;
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return <article className={`project-card ${project.accent}`}><div className="card-top"><span>{project.index}</span><span>{project.label}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div><div className="card-actions"><a href={project.href} target="_blank" rel="noreferrer">Repository <Arrow /></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live <Arrow /></a>}</div></article>;
}

function Work() {
  return <section className="work section" id="work"><div className="section-intro"><p className="eyebrow">01 / Selected signals</p><h2>Things I’ve<br /><i>made real.</i></h2><p className="section-copy">A working archive of platforms, products, and experiments. Each one starts with a messy problem and ends with a clearer system.</p></div><Featured /><div className="project-grid">{projects.map((project) => <ProjectCard key={project.title} project={project} />)}</div></section>;
}

function About() {
  return <section className="about section" id="about"><div className="section-intro"><p className="eyebrow">02 / The operator</p><h2>Curious by<br /><i>default.</i></h2></div><div className="about-body"><p className="about-lede">I’m Edda, a Computer Engineering student building at the intersection of data engineering, cloud infrastructure, and thoughtful product design.</p><p>I care about the parts that make software dependable: traceability, clean interfaces, useful defaults, and systems that explain themselves when something goes wrong.</p><div className="about-stamp">ES<br /><span>BUILD / LEARN / REPEAT</span></div></div><div className="experience-row"><div><span className="eyebrow">Current chapter</span><h3>{experience.role}</h3><p>{experience.company}</p></div><time dateTime={experience.year}>{experience.year}</time><p>{experience.description}</p></div></section>;
}

function Toolkit() { return <section className="toolkit section"><div className="section-intro"><p className="eyebrow">03 / The instrument panel</p><h2>My current<br /><i>kit.</i></h2></div><div className="toolkit-grid">{toolkit.map((group) => <div key={group.group}><span>{group.number}</span><h3>{group.group}</h3><p>{group.items}</p></div>)}</div></section>; }

function Contact() { return <section className="contact section" id="contact"><div className="contact-kicker"><span>04 / Open channel</span><span>ONLINE / AVAILABLE</span></div><h2>Have a hard<br /><i>problem?</i></h2><p>Tell me what you’re trying to make clearer, faster, or more reliable.</p><div className="contact-links"><a href={`mailto:${profile.email}`}>Email me <Arrow /></a><a href={profile.github} target="_blank" rel="noreferrer">Find me on GitHub <Arrow /></a></div></section>; }

export default function App() { return <><Header /><main id="main-content"><Hero /><Work /><About /><Toolkit /><Contact /></main><footer><span>© {currentYear} EDDA SHKURTI</span><span>BUILT WITH CURIOSITY / XK</span></footer></>; }
