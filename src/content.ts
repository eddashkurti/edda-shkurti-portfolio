export const profile = {
  name: "Edda Shkurti",
  email: "shkurtiedda@gmail.com",
  github: "https://github.com/eddashkurti",
  resume: "/Edda-Shkurti-CV.pdf",
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
  githubUrl: null,
  architecture: [
    { label: "SOURCE", value: "Olist Dataset" },
    { label: "STORAGE", value: "ADLS Gen2" },
    { label: "BRONZE", value: "Raw ingestion" },
    { label: "SILVER", value: "Validated transforms" },
    { label: "GOLD", value: "Analytics tables" },
  ],
};

export const projects = [
  {
    number: "02",
    title: "Metadata-Driven Data Governance & Monitoring Platform",
    description: "Metadata-driven governance platform for classification, compliance monitoring and analytics.",
    technologies: ["Databricks", "Python", "SQL", "Data Governance", "Analytics"],
    href: null,
  },
  {
    number: "03",
    title: "Heart Disease ETL Pipeline",
    description: "Python ETL pipeline for ingesting, validating, cleaning and reporting on heart-disease data.",
    technologies: ["Python", "ETL", "Data Validation", "CLI", "Data Quality"],
    href: null,
  },
  {
    number: "04",
    title: "CloudVision AI",
    description: "Cloud-hosted image classification app using TensorFlow.js with drag-and-drop predictions.",
    technologies: ["AWS", "TensorFlow.js", "JavaScript", "Vite", "S3"],
    href: "https://github.com/eddashkurti/CloudVision-AI",
  },
  {
    number: "05",
    title: "Meeting Optimizer",
    description: "Role-based meeting and workflow app with Kanban boards, approvals, notes and dashboards.",
    technologies: ["React", "Vite", "Tailwind CSS"],
    href: "https://github.com/gegedobruna/meeting-optimizer",
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

export const aboutFacts = [
  { label: "I like", detail: "Building things that are useful" },
  { label: "Outside the screen", detail: "Photography & videography" },
  { label: "Always curious about", detail: "Technology, design & how things work" },
  { label: "Based in", detail: "Kosovo" },
];

export const toolkit = [
  { number: "01", group: "Languages", items: ["Python", "SQL", "JavaScript"] },
  { number: "02", group: "Data", items: ["Databricks", "PySpark", "Delta Lake", "ETL", "Data Quality"] },
  { number: "03", group: "Cloud", items: ["Azure", "ADLS Gen2", "AWS", "S3"] },
  { number: "04", group: "Engineering", items: ["Git", "GitHub", "Linux", "Vite", "React"] },
];
