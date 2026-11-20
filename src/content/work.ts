import type { WorkItem } from "./types";

/**
 * Built-in portfolio entries (shown alongside any published database rows).
 * Descriptions reflect only what the live application exposes — its public
 * sign-in page and its module structure — pending owner confirmation of
 * details, outcomes and screenshots.
 */
export const builtInWork: (WorkItem & { liveUrl: string; screenshot: string; highlights: string[] })[] = [
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
    highlights: ["TMC", "Midblock", "NMU", "Parking", "Queue", "Vehicle classification"],
  },
];

export const getBuiltInWork = (slug: string) => builtInWork.find((w) => w.slug === slug);
