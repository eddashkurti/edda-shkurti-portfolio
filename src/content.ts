export const profile = {
  name: "Edda Shkurti",
  email: "edda.email@example.com", // TODO: Replace with Edda's real email.
  github: "https://github.com/edda-shkurti", // TODO: Replace with Edda's real GitHub URL.
  resume: "/resume-placeholder.pdf", // TODO: Replace with the real resume file or URL.
};

export const socialLinks = [
  { label: "GitHub", href: profile.github },
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "Resume", href: profile.resume },
];

export const featuredProject = {
  number: "01",
  title: "NovaCart Data Platform",
  subtitle: "End-to-end e-commerce data platform built with Azure and Databricks.",
  description:
    "A production-style data engineering project built around a medallion architecture, transforming raw Olist e-commerce data through Bronze, Silver, and Gold layers with automated validation, quarantine handling, and data-quality checks.",
  technologies: ["Azure", "ADLS Gen2", "Databricks", "PySpark", "Delta Lake", "Python"],
  metrics: [
    "99K+ orders",
    "112K+ order items",
    "8 Gold tables",
    "Automated validation",
    "Quarantine pipelines",
    "Gold checks passing",
  ],
  githubUrl: "https://github.com/edda-shkurti/novacart-data-platform", // TODO: Replace with the real NovaCart repository URL.
  architecture: ["Olist Dataset", "ADLS Gen2", "Bronze", "Silver", "Gold"],
};

export const projects = [
  {
    number: "02",
    title: "Metadata-Driven Data Governance & Monitoring Platform",
    description:
      "A governance and monitoring platform designed around metadata-driven classification, compliance visibility, governance insights, and business-facing analytics.",
    technologies: ["Databricks", "Python", "SQL", "Data Governance", "Analytics"],
    href: "https://github.com/edda-shkurti/governance-platform", // TODO: Replace with the real project URL.
  },
  {
    number: "03",
    title: "Heart Disease ETL Pipeline",
    description:
      "Python-based ETL application for ingesting, validating, cleaning, deduplicating, and reporting on heart-disease data, with invalid records separated into a quarantine dataset.",
    technologies: ["Python", "ETL", "Data Validation", "CLI", "Data Quality"],
    href: "https://github.com/edda-shkurti/heart-disease-etl", // TODO: Replace with the real project URL.
  },
  {
    number: "04",
    title: "CloudVision AI",
    description:
      "Cloud-hosted image classification application using TensorFlow.js MobileNet V2 with drag-and-drop upload and top-three prediction results.",
    technologies: ["AWS", "TensorFlow.js", "JavaScript", "Vite", "S3"],
    href: "https://github.com/edda-shkurti/cloudvision-ai", // TODO: Replace with the real project URL.
  },
  {
    number: "05",
    title: "Meeting Optimizer",
    description:
      "Role-based meeting and workflow management application featuring Kanban workflows, WIP limits, approvals, notes, calendars, and dashboards.",
    technologies: ["React", "Vite", "Tailwind CSS"],
    href: "https://github.com/edda-shkurti/meeting-optimizer", // TODO: Replace with the real project URL.
  },
];

export const experience = {
  role: "Data Engineering",
  company: "eXponent Data / Genpact",
  year: "2026",
  description:
    "Completed intensive hands-on data engineering training and project work across Python, SQL, Databricks, Spark, Delta Lake, data quality, ETL pipelines, cloud concepts, and medallion architecture.",
  highlights: [
    "ETL pipeline development",
    "Data validation",
    "Governance analytics",
    "Databricks workflows",
    "Bronze / Silver / Gold architecture",
    "Collaboration and technical presentations",
  ],
};

export const achievements = [
  { label: "Databricks Certified Data Engineer Associate", detail: "2026" },
  { label: "1st Place — University Coding Competition", detail: "" },
  { label: "BSc Computer Engineering", detail: "International Balkan University" },
  { label: "Outside engineering", detail: "Photography & videography" },
];

export const toolkit = [
  { group: "Languages", items: ["Python", "SQL", "JavaScript"] },
  { group: "Data", items: ["Databricks", "PySpark", "Spark", "Delta Lake", "ETL", "Data Quality"] },
  { group: "Cloud", items: ["Azure", "ADLS Gen2", "AWS", "S3"] },
  { group: "Engineering", items: ["Git", "GitHub", "Linux", "Vite", "React"] },
];
