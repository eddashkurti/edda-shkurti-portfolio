import { useEffect, useLayoutEffect, useRef } from "react";
import { dataProjects, featuredDataProject, featuredProject, profile, softwareProjects, toolkit } from "./content";

const currentYear = new Date().getFullYear();
type CardData = {
  index: string;
  label: string;
  title: string;
  description: string;
  technologies: string[];
  href: string;
  live?: string;
  accent: string;
  signal?: string;
};

const signals: Record<string, string> = {
  "03": "EVENT / COHORT / GROWTH",
  "04": "PROFILE / RULE / QUARANTINE",
};

const darkCards: CardData[] = [
  { index: "01", label: "DATA PLATFORM", title: featuredProject.title, description: featuredProject.description, technologies: featuredProject.technologies, href: featuredProject.href, accent: "lime", signal: featuredProject.signal },
  { index: "02", label: "OBSERVABLE DATA", title: featuredDataProject.title, description: featuredDataProject.description, technologies: featuredDataProject.technologies, href: featuredDataProject.href, accent: "orange", signal: featuredDataProject.signal },
  ...dataProjects.map((project) => ({ ...project, signal: signals[project.index] })),
];

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

function Header() {
  return <header className="site-header">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <a className="brand" href="#top"><span>ES</span> / EDDA SHKURTI</a>
    <nav aria-label="Primary navigation"><a href="#work">Work <span>08</span></a><a href="#about">About</a><a href="#contact">Contact</a><a className="nav-github" href={profile.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a></nav>
  </header>;
}

function HeroSvgGrid() {
  const wavePoint = useRef<SVGCircleElement>(null);
  const basePoint = useRef<SVGCircleElement>(null);
  const verticals = Array.from({ length: 25 }, (_, index) => index * 80);
  const horizontals = Array.from({ length: 14 }, (_, index) => index * 80);
  const moveWave = (event: PointerEvent, svg: SVGSVGElement) => {
    const bounds = svg.getBoundingClientRect();
    const point = wavePoint.current;
    if (!point) return;
    const x = ((event.clientX - bounds.left) / bounds.width) * 2000;
    const y = ((event.clientY - bounds.top) / bounds.height) * 1100;
    point.setAttribute("cx", String(x));
    point.setAttribute("cy", String(y));
    point.setAttribute("opacity", "1");
    basePoint.current?.setAttribute("cx", String(x));
    basePoint.current?.setAttribute("cy", String(y));
    basePoint.current?.setAttribute("opacity", "1");
  };
  useEffect(() => {
    const svg = document.querySelector<SVGSVGElement>(".hero-grid-svg");
    if (!svg) return;
    const onMove = (event: PointerEvent) => {
      const bounds = svg.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        wavePoint.current?.setAttribute("opacity", "0");
        basePoint.current?.setAttribute("opacity", "0");
        return;
      }
      moveWave(event, svg);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return <svg className="hero-grid-svg" viewBox="0 0 2000 1100" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <filter id="hero-wave" filterUnits="userSpaceOnUse" x="0" y="0" width="2000" height="1100"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.022" numOctaves="3" seed="7" stitchTiles="stitch" result="noise"><animate attributeName="baseFrequency" values="0.012 0.022;0.02 0.012;0.012 0.022" dur="5s" repeatCount="indefinite" /></feTurbulence><feDisplacementMap in="SourceGraphic" in2="noise" scale="72" xChannelSelector="R" yChannelSelector="G" /></filter>
      <radialGradient id="wave-mask-gradient"><stop offset="0%" stopColor="white" stopOpacity="1" /><stop offset="58%" stopColor="white" stopOpacity=".82" /><stop offset="100%" stopColor="black" stopOpacity="0" /></radialGradient>
      <radialGradient id="base-mask-gradient"><stop offset="0%" stopColor="black" stopOpacity="1" /><stop offset="58%" stopColor="black" stopOpacity=".82" /><stop offset="100%" stopColor="white" stopOpacity="0" /></radialGradient>
      <mask id="hero-wave-mask"><rect width="2000" height="1100" fill="black" /><circle ref={wavePoint} cx="1000" cy="500" r="300" fill="url(#wave-mask-gradient)" opacity="0" /></mask>
      <mask id="hero-base-mask"><rect width="2000" height="1100" fill="white" /><circle ref={basePoint} cx="1000" cy="500" r="300" fill="url(#base-mask-gradient)" opacity="0" /></mask>
    </defs>
    <g className="hero-svg-base" mask="url(#hero-base-mask)">{verticals.map((x) => <path key={`v${x}`} d={`M ${x} 0 V 1100`} />)}{horizontals.map((y) => <path key={`h${y}`} d={`M 0 ${y} H 2000`} />)}</g>
    <g className="hero-svg-wave" filter="url(#hero-wave)" mask="url(#hero-wave-mask)">{verticals.map((x) => <path key={`wv${x}`} d={`M ${x} 0 V 1100`} />)}{horizontals.map((y) => <path key={`wh${y}`} d={`M 0 ${y} H 2000`} />)}</g>
  </svg>;
}

function HeroGridEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
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
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) return;
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      if (Math.hypot(x - lastX, y - lastY) < 34) return;
      lastX = x;
      lastY = y;
      ripples.push({ x, y, born: performance.now() });
      if (ripples.length > 5) ripples.shift();
    };

    const draw = (now: number) => {
      const bounds = hero.getBoundingClientRect();
      if (bounds.width !== width || bounds.height !== height) resize();
      context.clearRect(0, 0, width, height);
      const spacing = 80;
      const alive = ripples.filter((ripple) => now - ripple.born < 3600);
      ripples.splice(0, ripples.length, ...alive);

      const forceAt = (x: number, y: number) => {
        let displacementX = 0;
        let displacementY = 0;
        let highlight = 0;
        for (const ripple of ripples) {
          const age = (now - ripple.born) / 1000;
          const distance = Math.hypot(x - ripple.x, y - ripple.y);
          const radius = age * 150;
          const ring = Math.exp(-((distance - radius) ** 2) / 2400) * Math.max(0, 1 - age / 3.6);
          const local = Math.exp(-(distance ** 2) / 9000) * Math.max(0, 1 - age / 1.2) * 0.18;
          const response = Math.min(1, ring + local);
          const wave = Math.sin(distance * 0.12 - age * 10) * response;
          const directionX = distance ? (x - ripple.x) / distance : 0;
          const directionY = distance ? (y - ripple.y) / distance : 0;
          displacementX += directionX * wave * 9;
          displacementY += directionY * wave * 9;
          highlight += response;
        }
        return { x: x + displacementX, y: y + displacementY, highlight: Math.min(1, highlight) };
      };

      context.lineWidth = 1;
      context.shadowColor = "rgba(216,255,62,.65)";
      for (let x = 0; x <= width; x += spacing) {
        for (let y = 0; y < height; y += 16) {
          const start = forceAt(x, y);
          const end = forceAt(x, Math.min(height, y + 16));
          const glow = Math.max(start.highlight, end.highlight);
          context.lineWidth = glow > 0.002 ? 1.5 : 1;
          context.shadowBlur = glow > 0.002 ? 7 : 0;
          context.strokeStyle = glow > 0.002 ? `rgba(216,255,62,${0.2 + glow * 0.58})` : "rgba(233,232,224,.12)";
          context.beginPath();
          context.moveTo(start.x, start.y);
          context.lineTo(end.x, end.y);
          context.stroke();
        }
      }
      for (let y = 0; y <= height; y += spacing) {
        for (let x = 0; x < width; x += 16) {
          const start = forceAt(x, y);
          const end = forceAt(Math.min(width, x + 16), y);
          const glow = Math.max(start.highlight, end.highlight);
          context.lineWidth = glow > 0.002 ? 1.5 : 1;
          context.shadowBlur = glow > 0.002 ? 7 : 0;
          context.strokeStyle = glow > 0.002 ? `rgba(216,255,62,${0.2 + glow * 0.58})` : "rgba(233,232,224,.12)";
          context.beginPath();
          context.moveTo(start.x, start.y);
          context.lineTo(end.x, end.y);
          context.stroke();
        }
      }
      context.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    };

    resize();
    requestAnimationFrame(resize);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", addRipple);
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", addRipple); };
  }, []);

  return <canvas className="hero-grid-canvas" width="2000" height="1200" aria-hidden="true" />;
}

function Hero() {
  return <section className="hero" id="top"><HeroSvgGrid /><div className="hero-orbit" aria-hidden="true"><span>DATA</span><span>DESIGN</span><span>SYSTEMS</span></div><div className="hero-topline"><span>PORTFOLIO / 2026</span><span>{profile.location}</span></div><div className="hero-grid"><div className="hero-title-wrap"><p className="eyebrow">{profile.role}</p><h1>Systems<br /><i>with a pulse.</i></h1></div><div className="hero-note"><span className="note-index">↳ 00</span><p>I design the connective tissue between raw data, useful software, and the people who need to trust it.</p><a href="#work">Enter the archive <Arrow /></a></div></div><div className="hero-footer"><span>SCROLL TO EXPLORE</span><span className="scroll-line" aria-hidden="true" /></div></section>;
}


function ProjectCard({ card, tone }: { card: CardData; tone: "dark" | "light" }) {
  const parts = (card.signal ?? "").split(" / ");
  return <article className={`project-card ${card.accent} ${tone}`}>
    <div className="card-top"><span>{card.index}</span><span>{card.label}</span></div>
    {tone === "dark" && <div className="signal-visual" aria-hidden="true"><span>{parts[0]}</span><i>→</i><span>{parts[parts.length - 1]}</span></div>}
    <h3>{card.title}</h3>
    <p>{card.description}</p>
    <div className="tag-row">{card.technologies.map((item) => <span key={item}>{item}</span>)}</div>
    <div className="card-meta">{tone === "dark" ? <span>{card.signal}</span> : <span>STATUS / {card.live ? "LIVE" : "REPOSITORY ONLY"}</span>}<span>{card.index} / 08</span></div>
    <div className="card-actions"><a href={card.href} target="_blank" rel="noreferrer">Repository <Arrow /></a>{card.live && <a href={card.live} target="_blank" rel="noreferrer">Live <Arrow /></a>}</div>
  </article>;
}

type DataCard = {
  eyebrow: string;
  title: string;
  description: string;
  technologies: string[];
  href: string;
  live?: string;
  signal: string;
  from: string;
  to: string;
  tag: string;
};

const dataCards: DataCard[] = [
  { eyebrow: "01 / data platform", title: featuredProject.title, description: featuredProject.description, technologies: featuredProject.technologies, href: featuredProject.href, signal: featuredProject.signal, from: "RAW", to: "TRUST", tag: "01 / 08" },
  { eyebrow: "02 / observable data", title: featuredDataProject.title, description: featuredDataProject.description, technologies: featuredDataProject.technologies, href: featuredDataProject.href, signal: featuredDataProject.signal, from: "SOURCE", to: "TRACE", tag: "02 / 08" },
  { eyebrow: "03 / revenue retention", title: "PulseMetrics SaaS Analytics", description: "Turns raw product clicks into retention curves, churn alerts, and customer health scores, so the team sees who is leaving before the revenue does.", technologies: ["DuckDB", "SQL", "Python", "Power BI"], href: dataProjects[0].href, live: dataProjects[0].live, signal: "EVENT / COHORT / GROWTH", from: "EVENT", to: "GROWTH", tag: "03 / 08" },
  { eyebrow: "04 / quality observability", title: "Data Quality Observatory", description: "Profiles every dataset, enforces deterministic rules, and quarantines bad rows, then charts quality run by run so no regression slips in quietly.", technologies: ["React", "TypeScript", "Express", "Postgres"], href: dataProjects[1].href, signal: "PROFILE / RULE / QUARANTINE", from: "PROFILE", to: "QUARANTINE", tag: "04 / 08" },
];

const softwareCards: DataCard[] = [
  { eyebrow: "05 / event systems", title: softwareProjects[0].title, description: softwareProjects[0].description, technologies: softwareProjects[0].technologies, href: softwareProjects[0].href, live: softwareProjects[0].live, signal: "QR / GALLERY / SHARE", from: "QR", to: "SHARE", tag: "05 / 08" },
  { eyebrow: "06 / business finance", title: softwareProjects[1].title, description: softwareProjects[1].description, technologies: softwareProjects[1].technologies, href: softwareProjects[1].href, signal: "STOCK / LEDGER / CONTROL", from: "STOCK", to: "CONTROL", tag: "06 / 08" },
  { eyebrow: "07 / workflow product", title: softwareProjects[2].title, description: softwareProjects[2].description, technologies: softwareProjects[2].technologies, href: softwareProjects[2].href, signal: "REQUEST / APPROVE / FLOW", from: "REQUEST", to: "FLOW", tag: "07 / 08" },
  { eyebrow: "08 / edge ai privacy", title: softwareProjects[3].title, description: softwareProjects[3].description, technologies: softwareProjects[3].technologies, href: softwareProjects[3].href, live: softwareProjects[3].live, signal: "PIXELS / ON-DEVICE / PRIVATE", from: "PIXELS", to: "PRIVATE", tag: "08 / 08" },
];

function DataCardFeature({ card, tone = "dark" }: { card: DataCard; tone?: "dark" | "light" }) {
  return <article className={`featured data-card ${tone}`}>
    <div className="feature-visual" aria-hidden="true"><span>{card.from}</span><span>→</span><span>{card.to}</span><div className="feature-grid" /></div>
    <div className="feature-copy">
      <p className="eyebrow">{card.eyebrow}</p>
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      <div className="tag-row">{card.technologies.map((item) => <span key={item}>{item}</span>)}</div>
      <div className="card-actions data-actions">
        <a href={card.href} target="_blank" rel="noreferrer">Repository <Arrow /></a>
        {card.live && <a href={card.live} target="_blank" rel="noreferrer">Live <Arrow /></a>}
      </div>
    </div>
    <div className="feature-signal"><span>LIVE SIGNAL</span><strong>{card.signal}</strong><small>{card.tag}</small></div>
  </article>;
}
function Work() {
  return <section className="work section" id="work">
    <div className="section-intro"><p className="eyebrow">01 / Selected signals</p><h2>Things I’ve<br /><i>made real.</i></h2><p className="section-copy">A working archive of platforms, products, and experiments. Each one starts with a messy problem and ends with a clearer system.</p></div>
    <div className="work-columns">
      <div className="work-column">
        <div className="work-label"><span>DATA PROJECTS</span><span>04 SYSTEMS / PIPELINES / INSIGHT</span></div>
        <div className="data-stack">{dataCards.map((card) => <DataCardFeature key={card.title} card={card} />)}</div>
      </div>
      <div className="work-column">
        <div className="work-label software-label"><span>SOFTWARE PROJECTS</span><span>04 PRODUCTS / WORKFLOWS / INTERFACES</span></div>
        <div className="data-stack">{softwareCards.map((card) => <DataCardFeature key={card.title} card={card} tone="light" />)}</div>
      </div>
    </div>
  </section>;
}

function About() {
  return <section className="about section" id="about"><div className="section-intro"><p className="eyebrow">02 / The operator</p><h2>Curious by<br /><i>default.</i></h2></div><div className="about-body"><p className="about-lede">I’m Edda, a Computer Engineering student building at the intersection of data engineering, cloud infrastructure, and thoughtful product design.</p><p>I care about the parts that make software dependable: traceability, clean interfaces, useful defaults, and systems that explain themselves when something goes wrong.</p><div className="about-stamp">ES<br /><span>BUILD / LEARN / REPEAT</span></div></div></section>;
}

function Toolkit() { return <section className="toolkit section"><div className="section-intro"><p className="eyebrow">03 / The instrument panel</p><h2>My current<br /><i>kit.</i></h2></div><div className="toolkit-grid">{toolkit.map((group) => <div key={group.group}><span>{group.number}</span><h3>{group.group}</h3><p>{group.items}</p></div>)}</div></section>; }

function Contact() { return <section className="contact section" id="contact"><div className="contact-kicker"><span>04 / Open channel</span><span>ONLINE / AVAILABLE</span></div><h2>Got a messy<br /><i>problem?</i></h2><p>Tell me what you’re trying to make clearer, faster, or more reliable.</p><div className="contact-links"><a href={`mailto:${profile.email}`}>Email me <Arrow /></a><a href={profile.github} target="_blank" rel="noreferrer">Find me on GitHub <Arrow /></a></div></section>; }

export default function App() { return <><Header /><main id="main-content"><Hero /><Work /><About /><Toolkit /><Contact /></main><footer><span>© {currentYear} EDDA SHKURTI</span><span>BUILT WITH CURIOSITY / XK</span></footer></>; }
