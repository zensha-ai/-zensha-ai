import type { WorkItem } from "./types";

/**
 * Built-in portfolio entries (shown alongside any published database rows).
 * Descriptions reflect only what the live application exposes — its public
 * sign-in page and its module structure — pending owner confirmation of
 * details, outcomes and screenshots.
 */
export const builtInWork: (WorkItem & { liveUrl: string | null; screenshot?: string; screenshotAlt?: string; highlights: string[] })[] = [
  {
    id: "builtin-trafenix",
    slug: "trafenix-ai",
    title: "Trafenix AI",
    kind: "company",
    client: null,
    industry: "Transportation & traffic engineering",
    project_type: "Web Application",
    year: "2026",
    summary:
      "A web platform for running traffic surveys end to end — organising survey projects, capturing intersection and midblock counts, classifying vehicles and reviewing results — with secure, role-based access for survey teams.",
    challenge:
      "Traffic surveys involve many count types, field devices and reviewers. Keeping projects, sessions and count data organised and consistent across a team is difficult with spreadsheets and disconnected tools.",
    approach:
      "Structure the work around projects, give each survey type its own focused workflow, and keep administration — users, roles, project access and an audit trail — inside the same application.",
    solution:
      "A single-page web application with project workspaces and dashboards, dedicated modules for each survey type, device-based counting, a review queue for vehicle classification and a full admin area.",
    features: [
      "Project workspaces with per-project dashboards",
      "Turning movement counts (TMC) at intersections",
      "Midblock count sessions",
      "Non-motorised user (NMU) surveys",
      "Parking and queue-length surveys",
      "Vehicle classification runs with a review queue",
      "Count panels and joystick counting devices with profiles and assignments",
      "Admin: users, roles, project access and audit log",
      "Secure sign-in, account activation and password reset",
    ],
    technologies: ["React", "React Router", "Vite", "JWT authentication", "Role-based access control", "Render"],
    outcome: null,
    demo_url: "https://trafenix.onrender.com/",
    cover_image_url: null,
    published: true,
    liveUrl: "https://trafenix.onrender.com/",
    screenshot: "/work/trafenix-signin.png",
    screenshotAlt: "Trafenix AI sign-in screen",
    highlights: ["TMC", "Midblock", "NMU", "Parking", "Queue", "Vehicle classification"],
  },
  {
    id: "builtin-reel-research-ai",
    slug: "reel-research-ai",
    title: "Reel Research AI",
    kind: "company",
    client: null,
    industry: "Content research & creators",
    project_type: "AI Agent",
    year: "2026",
    summary:
      "An AI research agent that turns an Instagram Reel into a fact-checked PDF report — it watches the video, listens to the audio, researches every claim on the web and writes a practical implementation plan.",
    challenge:
      "Reels are packed with tips and claims, but there is no quick way to check whether they are true or to turn them into steps you can act on. Doing it by hand means rewatching, transcribing and searching for each claim.",
    approach:
      "Treat each Reel as a research job: extract frames and audio, transcribe locally, let a multimodal model read the frames, then research and fact-check claims on the web — citing only sources the agent could actually open.",
    solution:
      "A staged Python pipeline (video → transcript → frame analysis → knowledge extraction → web research and fact-check → implementation plan) that validates every step against a schema and renders a designed, branded PDF report.",
    features: [
      "Frame and audio extraction with FFmpeg, tuned scene detection",
      "Local speech-to-text with faster-whisper (no audio leaves the machine)",
      "Frame-by-frame visual understanding with Google Gemini",
      "Web research and claim fact-checking with Google Search grounding",
      "Only sources the agent could open are cited",
      "Step-by-step implementation plan for every report",
      "Schema-validated JSON between every stage",
      "Designed PDF reports rendered with Playwright",
      "Instagram DM integration and automation in progress",
    ],
    technologies: ["Python", "FFmpeg", "faster-whisper", "Google Gemini", "Google Search grounding", "Pydantic", "Jinja2", "Playwright", "FastAPI"],
    outcome: null,
    demo_url: null,
    cover_image_url: null,
    published: true,
    liveUrl: null,
    screenshot: "/work/reel-research-report.png",
    screenshotAlt: "Cover page of a Reel Research AI report",
    highlights: ["Video", "Audio", "Vision", "Fact-check", "Research", "PDF report"],
  },
  {
    id: "builtin-youtube-etl",
    slug: "youtube-analytics-pipeline",
    title: "YouTube Analytics Data Pipeline",
    kind: "company",
    client: null,
    industry: "Media & creator analytics",
    project_type: "Data Engineering",
    year: "2026",
    summary:
      "An ETL pipeline that pulls channel and video data from the YouTube Data API, cleans and models it, and loads it into an analytics database with dimension and fact tables ready for reporting.",
    challenge:
      "Creator performance data sits behind an API in nested JSON. Tracking views, likes and comments over time across channels needs a repeatable way to collect, clean and store it.",
    approach:
      "Split the work into clear Extract, Transform and Load stages, and model the data as a small star schema so each video is described once and its metrics are captured as timestamped snapshots.",
    solution:
      "Python notebooks that extract video metadata and statistics from the YouTube Data API v3, flatten and type the JSON with pandas, and load a creator dimension and a time-stamped fact table into SQLite.",
    features: [
      "Extract: YouTube Data API v3 (channels, playlists, video statistics)",
      "Transform: flatten nested JSON, fix types and dates with pandas",
      "Load: SQLite database with a dimension and a fact table",
      "Creator dimension — one row per video (title, channel, publish date)",
      "Fact table — time-stamped views, likes and comments snapshots",
      "6,800+ videos modelled, with metric snapshots over time",
    ],
    technologies: ["Python", "YouTube Data API v3", "pandas", "SQLite", "SQL", "Jupyter"],
    outcome: null,
    demo_url: null,
    cover_image_url: null,
    published: true,
    liveUrl: null,
    highlights: ["Extract", "Transform", "Load", "Star schema", "Fact table", "Dimension table"],
  },
];

export const getBuiltInWork = (slug: string) => builtInWork.find((w) => w.slug === slug);
