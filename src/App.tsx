import { useEffect, useRef } from "react";
import { dataProjects, featuredDataProject, featuredProject, profile, softwareProjects, toolkit } from "./content";

const currentYear = new Date().getFullYear();
type Project = (typeof dataProjects)[number] | (typeof softwareProjects)[number];

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

function Header() {
  return <header className="site-header">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <a className="brand" href="#top"><span>ES</span> / EDDA SHKURTI</a>
    <nav aria-label="Primary navigation"><a href="#work">Work <span>08</span></a><a href="#about">About</a><a href="#contact">Contact</a><a className="nav-github" href={profile.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a></nav>
  </header>;
}

function HeroGridEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    type Ripple = { x: number; y: number; born: number };
    const ripples: Ripple[] = [];
    let width = 0;
    let height = 0;
    let lastX = -1000;
    let lastY = -1000;
    let frame = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const addRipple = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      if (Math.hypot(x - lastX, y - lastY) < 34) return;
      lastX = x;
      lastY = y;
      ripples.push({ x, y, born: performance.now() });
      if (ripples.length > 5) ripples.shift();
    };

    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      const spacing = 80;
      const alive = ripples.filter((ripple) => now - ripple.born < 2600);
      ripples.splice(0, ripples.length, ...alive);

      const forceAt = (x: number, y: number) => {
        let displacementX = 0;
        let displacementY = 0;
        let highlight = 0;
        for (const ripple of ripples) {
          const age = (now - ripple.born) / 1000;
          const distance = Math.hypot(x - ripple.x, y - ripple.y);
          const radius = age * 185;
          const ring = Math.exp(-((distance - radius) ** 2) / 900) * Math.max(0, 1 - age / 2.6);
          const wave = Math.sin(distance * 0.12 - age * 11) * ring;
          const directionX = distance ? (x - ripple.x) / distance : 0;
          const directionY = distance ? (y - ripple.y) / distance : 0;
          displacementX += directionX * wave * 9;
          displacementY += directionY * wave * 9;
          highlight += ring;
        }
        return { x: x + displacementX, y: y + displacementY, highlight: Math.min(1, highlight) };
      };

      context.lineWidth = 1;
      for (let x = 0; x <= width; x += spacing) {
        for (let y = 0; y < height; y += 16) {
          const start = forceAt(x, y);
          const end = forceAt(x, Math.min(height, y + 16));
          const glow = Math.max(start.highlight, end.highlight);
          if (glow > 0.015) {
            context.lineWidth = 1;
            context.strokeStyle = `rgba(216,255,62,${0.1 + glow * 0.38})`;
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.stroke();
          }
        }
      }
      for (let y = 0; y <= height; y += spacing) {
        for (let x = 0; x < width; x += 16) {
          const start = forceAt(x, y);
          const end = forceAt(Math.min(width, x + 16), y);
          const glow = Math.max(start.highlight, end.highlight);
          if (glow > 0.015) {
            context.lineWidth = 1;
            context.strokeStyle = `rgba(216,255,62,${0.1 + glow * 0.38})`;
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    hero.addEventListener("pointermove", addRipple);
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); hero.removeEventListener("pointermove", addRipple); };
  }, []);

  return <canvas className="hero-grid-canvas" aria-hidden="true" />;
}

function Hero() {
  return <section className="hero" id="top"><HeroGridEffect /><div className="hero-orbit" aria-hidden="true"><span>DATA</span><span>DESIGN</span><span>SYSTEMS</span></div><div className="hero-topline"><span>PORTFOLIO / 2026</span><span>{profile.location}</span></div><div className="hero-grid"><div className="hero-title-wrap"><p className="eyebrow">{profile.role}</p><h1>Systems<br /><i>with a pulse.</i></h1></div><div className="hero-note"><span className="note-index">↳ 00</span><p>I design the connective tissue between raw data, useful software, and the people who need to trust it.</p><a href="#work">Enter the archive <Arrow /></a></div></div><div className="hero-footer"><span>SCROLL TO EXPLORE</span><span className="scroll-line" aria-hidden="true" /></div></section>;
}

function Featured({ project, visual = "RAW" }: { project: typeof featuredProject; visual?: string }) {
  return <article className="featured"><div className="feature-visual" aria-hidden="true"><span>{visual}</span><span>→</span><span>{visual === "RAW" ? "TRUST" : "TRACE"}</span><div className="feature-grid" /></div><div className="feature-copy"><p className="eyebrow">{project.eyebrow}</p><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div><a className="button-link" href={project.href} target="_blank" rel="noreferrer">Open repository <Arrow /></a></div><div className="feature-signal"><span>LIVE SIGNAL</span><strong>{project.signal}</strong><small>{project.eyebrow.slice(0, 2)} / 08</small></div></article>;
}

function ProjectCard({ project }: { project: Project }) {
  return <article className={`project-card ${project.accent}`}><div className="card-top"><span>{project.index}</span><span>{project.label}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div><div className="card-actions"><a href={project.href} target="_blank" rel="noreferrer">Repository <Arrow /></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live <Arrow /></a>}</div></article>;
}

function Work() {
  return <section className="work section" id="work"><div className="section-intro"><p className="eyebrow">01 / Selected signals</p><h2>Things I’ve<br /><i>made real.</i></h2><p className="section-copy">A working archive of platforms, products, and experiments. Each one starts with a messy problem and ends with a clearer system.</p></div><div className="work-label"><span>DATA PROJECTS</span><span>04 SYSTEMS / PIPELINES / INSIGHT</span></div><div className="featured-pair"><Featured project={featuredProject} /><Featured project={featuredDataProject} visual="SOURCE" /></div><div className="project-grid">{dataProjects.map((project) => <ProjectCard key={project.title} project={project} />)}</div><div className="work-label software-label"><span>SOFTWARE PROJECTS</span><span>04 PRODUCTS / WORKFLOWS / INTERFACES</span></div><div className="project-grid">{softwareProjects.map((project) => <ProjectCard key={project.title} project={project} />)}</div></section>;
}

function About() {
  return <section className="about section" id="about"><div className="section-intro"><p className="eyebrow">02 / The operator</p><h2>Curious by<br /><i>default.</i></h2></div><div className="about-body"><p className="about-lede">I’m Edda, a Computer Engineering student building at the intersection of data engineering, cloud infrastructure, and thoughtful product design.</p><p>I care about the parts that make software dependable: traceability, clean interfaces, useful defaults, and systems that explain themselves when something goes wrong.</p><div className="about-stamp">ES<br /><span>BUILD / LEARN / REPEAT</span></div></div></section>;
}

function Toolkit() { return <section className="toolkit section"><div className="section-intro"><p className="eyebrow">03 / The instrument panel</p><h2>My current<br /><i>kit.</i></h2></div><div className="toolkit-grid">{toolkit.map((group) => <div key={group.group}><span>{group.number}</span><h3>{group.group}</h3><p>{group.items}</p></div>)}</div></section>; }

function Contact() { return <section className="contact section" id="contact"><div className="contact-kicker"><span>04 / Open channel</span><span>ONLINE / AVAILABLE</span></div><h2>Have a hard<br /><i>problem?</i></h2><p>Tell me what you’re trying to make clearer, faster, or more reliable.</p><div className="contact-links"><a href={`mailto:${profile.email}`}>Email me <Arrow /></a><a href={profile.github} target="_blank" rel="noreferrer">Find me on GitHub <Arrow /></a></div></section>; }

export default function App() { return <><Header /><main id="main-content"><Hero /><Work /><About /><Toolkit /><Contact /></main><footer><span>© {currentYear} EDDA SHKURTI</span><span>BUILT WITH CURIOSITY / XK</span></footer></>; }
