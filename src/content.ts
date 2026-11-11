export const profile = {
  name: "Edda Shkurti",
  email: "shkurtiedda@gmail.com",
  github: "https://github.com/eddashkurti",
  resume: "/Edda-Shkurti-CV.pdf",
};

export const featuredProject = {
  eyebrow: "01 / data platform",
  title: "TechPoint Data Platform",
  description: "An observable pipeline that turns a private business workbook into validated, traceable, analytics-ready datasets—with source fingerprints, schema contracts, quarantine, lineage, and a Streamlit operations workspace.",
  technologies: ["Python", "Streamlit", "Data Contracts", "Lineage"],
  href: "https://github.com/eddashkurti/TechPoint_Data_Platform",
  signal: "TRUST / TRACE / SHIP",
};

export const projects = [
  { index: "02", label: "REVENUE / RETENTION", title: "PulseMetrics SaaS Analytics", description: "A B2B SaaS analytics system for revenue growth, churn, cohort retention, customer health, and product usage.", technologies: ["DuckDB", "SQL", "Python", "Power BI"], href: "https://github.com/eddashkurti/PulseMetrics_SaaS_Analytics", live: "https://eddashkurti-pulsemetrics-saas-analytics-dashboardapp-gxmb71.streamlit.app/", accent: "lime" },
  { index: "03", label: "EVENTS / SYSTEMS", title: "Momente", description: "A mobile-first event photo-sharing product with QR access, private S3 uploads, Lambda handling, DynamoDB metadata, and a live gallery.", technologies: ["React", "AWS", "S3", "Lambda"], href: "https://github.com/eddashkurti/momente_app", live: "https://momente-enis-agnesa.online", accent: "orange" },
  { index: "04", label: "CLOUD / PIPELINES", title: "NovaCart Data Platform", description: "A 31-task Azure and Databricks medallion pipeline with Delta layers, quarantine handling, Gold models, quality checks, and bundle deployment.", technologies: ["Azure", "Databricks", "PySpark", "Delta Lake"], href: "https://github.com/eddashkurti/NovaCart_Data_Platform", accent: "blue" },
  { index: "05", label: "QUALITY / OBSERVABILITY", title: "Data Quality Observatory", description: "A data reliability workspace for profiling datasets, defining deterministic rules, quarantining failures, and comparing quality across runs.", technologies: ["React", "TypeScript", "Express", "Postgres"], href: "https://github.com/eddashkurti/Data-Quality-Observatory", accent: "pink" },
  { index: "06", label: "WORKFLOW / PRODUCT", title: "Consulting Meeting Optimizer", description: "A role-based collaboration system with Kanban, WIP limits, meeting approvals, workload visibility, notes, and analytics.", technologies: ["React", "Vite", "Context API", "DnD"], href: "https://github.com/eddashkurti/consulting-meeting-optimizer", accent: "violet" },
  { index: "07", label: "EDGE AI / PRIVACY", title: "CloudVision AI", description: "A browser image classifier using MobileNet V2 where inference stays on-device and images never reach an application server.", technologies: ["TensorFlow.js", "MobileNet", "Vite", "AWS S3"], href: "https://github.com/eddashkurti/cloudvision-ai", live: "http://opit-bootcamp.s3-website.eu-north-1.amazonaws.com", accent: "cyan" },
  { index: "08", label: "BUSINESS / FINANCE", title: "TechPoint Business OS", description: "A private Laravel business system covering inventory, purchasing, sales, accounting, audit trails, imports, reports, and operational controls.", technologies: ["Laravel", "PHP", "MySQL", "Docker"], href: "https://github.com/eddashkurti/techpoint-business-os", accent: "orange" },
];

export const experience = { role: "Data Engineering Trainee", company: "eXponent Data / Genpact", year: "2026", description: "Hands-on work across Python, SQL, Databricks, Spark, Delta Lake, data quality, ETL, cloud concepts, and medallion architecture." };

export const toolkit = [
  { number: "01", group: "Build", items: "Python · TypeScript · JavaScript · SQL" },
  { number: "02", group: "Move data", items: "Databricks · PySpark · DuckDB · Delta Lake" },
  { number: "03", group: "Operate", items: "Azure · AWS · S3 · Lambda · PostgreSQL" },
  { number: "04", group: "Make it legible", items: "Streamlit · React · Power BI · GitHub Actions" },
];
