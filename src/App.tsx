import {
  achievements,
  experience,
  featuredProject,
  profile,
  projects,
  socialLinks,
  toolkit,
} from "./content";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="text-link" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="section-heading">
      <span>{number}</span>
      <h2>{title}</h2>
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Edda Shkurti home">
        Edda.
      </a>
      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <a href={profile.resume}>Resume ↗</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="intro">Hello, I'm Edda.</p>
      <h1 id="hero-title">
        I build reliable data systems <em>and software that makes sense.</em>
      </h1>
      <p className="hero-copy">
        Computer Engineering graduate focused on Data Engineering and Software Engineering. I build reliable pipelines,
        cloud-based data platforms, and practical software using Python, SQL, Databricks, and modern cloud technologies.
      </p>
      <div className="hero-links" aria-label="Primary links">
        {socialLinks.map((link) => (
          <ExternalLink key={link.label} href={link.href}>
            {link.label}
          </ExternalLink>
        ))}
      </div>
    </section>
  );
}

function ArchitectureDiagram() {
  return (
    <ol className="architecture" aria-label="NovaCart platform architecture">
      {featuredProject.architecture.map((step) => (
        <li key={step}>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function FeaturedProject() {
  return (
    <article className="featured-project">
      <div className="feature-copy">
        <p className="project-number">{featuredProject.number} Featured project</p>
        <h3>{featuredProject.title}</h3>
        <p className="subtitle">{featuredProject.subtitle}</p>
        <p>{featuredProject.description}</p>
        <div className="metadata" aria-label="NovaCart technologies">
          {featuredProject.technologies.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="metrics" aria-label="NovaCart project metrics">
          {featuredProject.metrics.map((metric) => (
            <span key={metric}>{metric}</span>
          ))}
        </div>
        <ExternalLink href={featuredProject.githubUrl}>View project</ExternalLink>
      </div>
      <div className="feature-visual">
        <p>Medallion architecture</p>
        <ArchitectureDiagram />
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <a className="project-card" href={project.href} target="_blank" rel="noreferrer">
      <span className="project-number">{project.number}</span>
      <div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="metadata">
          {project.technologies.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
      <span className="arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

function Work() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <SectionHeading number="01" title="Selected work" />
      <FeaturedProject />
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section section-narrow" id="experience" aria-labelledby="experience-title">
      <SectionHeading number="02" title="Experience" />
      <article className="experience-item">
        <div>
          <h3>{experience.role}</h3>
          <p>{experience.company}</p>
        </div>
        <time>{experience.year}</time>
        <p>{experience.description}</p>
        <ul>
          {experience.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}

function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <SectionHeading number="03" title="A little about me." />
      <div className="about-layout">
        <div className="about-copy">
          <p>
            I studied Computer Engineering and gradually found myself most interested in the point where software, data,
            and cloud infrastructure meet. I enjoy building systems from the raw-data stage through validation,
            transformation, and delivery — and understanding why they work rather than simply making them run.
          </p>
          <p>
            Beyond data engineering, I am curious about practical software engineering, cloud technologies, and the way
            good tools can make complex work feel simpler.
          </p>
        </div>
        <div className="achievements" aria-label="Achievements">
          {achievements.map((achievement) => (
            <div key={achievement.label}>
              <strong>{achievement.label}</strong>
              {achievement.detail && <span>{achievement.detail}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    <section className="section toolkit" aria-labelledby="toolkit-title">
      <SectionHeading number="" title="Toolkit" />
      <div className="toolkit-grid" id="toolkit-title">
        {toolkit.map((group) => (
          <div key={group.group}>
            <h3>{group.group}</h3>
            <p>{group.items.join(" · ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <span className="section-number">04</span>
      <h2 id="contact-title">Let's connect.</h2>
      <p>I’m interested in opportunities where I can build, learn, and work on meaningful engineering problems.</p>
      <div className="contact-links">
        <ExternalLink href={`mailto:${profile.email}`}>Email me</ExternalLink>
        <ExternalLink href={profile.github}>GitHub</ExternalLink>
        <ExternalLink href={profile.resume}>Resume</ExternalLink>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 Edda Shkurti</span>
      <span>Kosovo · 2026</span>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Work />
        <Experience />
        <About />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
