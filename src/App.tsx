import {
  aboutFacts,
  experience,
  featuredProject,
  profile,
  projects,
  toolkit,
} from "./content";
import type { ReactNode } from "react";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const currentYear = new Date().getFullYear();

function ExternalLink({ href, children, ariaLabel }: { href: string; children: ReactNode; ariaLabel?: string }) {
  const isExternal = href.startsWith("http");

  return (
    <a
      className="text-link"
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
    >
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

function SectionHeading({ number, title, id }: { number: string; title: string; id?: string }) {
  return (
    <div className="section-heading">
      <span>{number}</span>
      <h2 id={id}>{title}</h2>
    </div>
  );
}

function ChapterLabel({ kicker, title }: { kicker: string; title: string }) {
  return (
    <p className="chapter-label">
      <span>{kicker}</span>
      {title}
    </p>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#top">
        Skip to content
      </a>
      <a className="brand" href="#top" aria-label="Edda Shkurti home">
        Edda.
      </a>
      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <a href={profile.resume} target="_blank" rel="noopener noreferrer">
          Resume ↗
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero chapter chapter-light" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div>
          <p className="intro">Hello, I'm Edda.</p>
          <h1 id="hero-title">
            <span>I build reliable data systems</span> <em>and software that makes sense.</em>
          </h1>
        </div>
        <div className="hero-side">
          <p className="mono">DATA / SOFTWARE</p>
          <p>
            Computer Engineering student focused on Data Engineering and Software Engineering. I build reliable
            pipelines, cloud-based data platforms, and practical software using Python, SQL, Databricks, and modern cloud
            technologies.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeaturedProject() {
  return (
    <article className="featured-project">
      <div className="feature-backdrop" aria-hidden="true">
        <span>BRONZE</span>
        <span>SILVER</span>
        <span>GOLD</span>
      </div>
      <div className="feature-data" aria-hidden="true">
        <span>
          99K+
          <small>ORDERS</small>
        </span>
        <span>
          112K+
          <small>ORDER ITEMS</small>
        </span>
        <span>
          08
          <small>GOLD TABLES</small>
        </span>
      </div>
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
        {featuredProject.githubUrl && (
          <ExternalLink href={featuredProject.githubUrl} ariaLabel="View NovaCart Data Platform on GitHub">
            View project
          </ExternalLink>
        )}
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const content = (
    <>
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
      {project.href && (
        <span className="arrow" aria-hidden="true">
          ↗
        </span>
      )}
    </>
  );

  return project.href ? (
    <a className="project-card" href={project.href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <article className="project-card project-card-static">{content}</article>
  );
}

function Work() {
  return (
    <section className="chapter chapter-dark section" id="work" aria-labelledby="work-title">
      <ChapterLabel kicker="Chapter 02" title="Work" />
      <SectionHeading number="01" title="Selected work" id="work-title" />
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
    <section className="chapter chapter-light section section-narrow" id="experience" aria-labelledby="experience-title">
      <ChapterLabel kicker="Chapter 03" title="Profile" />
      <SectionHeading number="02" title="Experience" id="experience-title" />
      <article className="experience-item">
        <div>
          <h3>{experience.role}</h3>
          <p>{experience.company}</p>
        </div>
        <time dateTime={experience.year}>{experience.year}</time>
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
    <section className="chapter chapter-light section about" id="about" aria-labelledby="about-title">
      <SectionHeading number="03" title="A little about me." id="about-title" />
      <div className="about-layout">
        <div className="about-copy">
          <p>
            I study Computer Engineering, and I have become most interested in the point where software, data, and cloud
            infrastructure meet. I like building from the raw-data stage through validation, transformation, and delivery.
          </p>
          <p>
            I care about understanding how systems work, not only making them run. The work I enjoy most is practical,
            useful, and clear enough for other people to build on.
          </p>
        </div>
        <div className="about-facts" aria-label="About Edda">
          {aboutFacts.map((fact) => (
            <div key={fact.label}>
              <strong>{fact.label}</strong>
              <span>{fact.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    <section className="chapter chapter-light section toolkit" aria-labelledby="toolkit-title">
      <SectionHeading number="" title="Toolkit" id="toolkit-title" />
      <div className="toolkit-grid">
        {toolkit.map((group) => (
          <div key={group.group}>
            <span>{group.number}</span>
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
    <section className="chapter chapter-red section contact" id="contact" aria-labelledby="contact-title">
      <ChapterLabel kicker="Chapter 04" title="Contact" />
      <h2 id="contact-title">
        <span>Let's</span> <em>connect.</em>
      </h2>
      <p>I’m interested in opportunities where I can build, learn, and work on meaningful engineering problems.</p>
      <div className="contact-links">
        <ExternalLink href={`mailto:${profile.email}`} ariaLabel="Email Edda Shkurti">
          Email
        </ExternalLink>
        <ExternalLink href={profile.github} ariaLabel="Open Edda Shkurti GitHub profile">
          GitHub
        </ExternalLink>
        <ExternalLink href={profile.resume} ariaLabel="Open Edda Shkurti CV">
          Resume
        </ExternalLink>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>© {currentYear} Edda Shkurti</span>
      <span>Kosovo · {currentYear}</span>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main id="top" tabIndex={-1}>
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
