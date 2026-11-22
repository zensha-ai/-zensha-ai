import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { pageSeo, responsibleLearningNote } from "@/content/site";
import { getStudentProjects } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink, DraftNotice, PageHero, Section, SectionHeader } from "@/components/ui";
import { ProjectBrowser } from "@/components/catalog/project-browser";
import { StudentHeroScene } from "@/components/hero-scenes";

export const revalidate = 300;
export const metadata: Metadata = pageMetadata({ ...pageSeo.studentProjects, path: "/student-projects" });

const categories = [
  { label: "Software Projects", text: "Python, Java, web applications and data-driven systems.", href: "?category=software" },
  { label: "Hardware Projects", text: "Arduino, ESP32, Raspberry Pi, sensors, embedded systems and electronics prototypes.", href: "?category=hardware" },
  { label: "IoT & Robotics", text: "Connected devices, smart monitoring, robotic systems and hardware-software combinations.", href: "?category=iot-robotics" },
  { label: "AI / ML Projects", text: "Machine learning, computer vision and AI-assisted applications.", href: "?category=ai-ml" },
  { label: "Free Starter Projects", text: "Selected examples and introductory materials for hands-on learning.", href: "?price=free" },
];

const expectations = [
  "A clear project objective and practical use case",
  "A preview of the working project, when available",
  "Technology stack and hardware requirements",
  "Exact files, documentation and materials included",
  "Setup requirements, compatibility notes and license terms",
  "Support scope and any additional costs clearly stated",
];

export default async function StudentProjectsPage() {
  const projects = await getStudentProjects();
  return (
    <>
      <PageHero
        visual={<StudentHeroScene />}
        eyebrow="Student projects"
        title="Learn by building."
        text="Software, hardware and IoT projects — with demos, parts lists and clear package contents."
        actions={
          <>
            <ButtonLink href="#browse" arrow>
              Browse All Projects
            </ButtonLink>
            <ButtonLink href="/student-projects?price=free#browse" variant="secondary">
              Explore Free Projects
            </ButtonLink>
          </>
        }
      />
      <Section>
        <SectionHeader eyebrow="Browse by category" title="Start from what you want to learn." />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c, i) => (
            <li key={c.label}>
              <Link href={`/student-projects${c.href}#browse`} className="group block h-full border-t border-ink pt-5">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <span className="mt-3 block text-lg font-medium group-hover:text-accent">{c.label}</span>
                <span className="mt-2 block text-sm text-muted">{c.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="alt" id="browse">
        <SectionHeader
          eyebrow="Find the right project"
          title="Search by topic, technology, difficulty, price and format."
          text="Filters distinguish source-code-only downloads and documentation bundles from optional physical kits."
        />
        <Suspense>
          <ProjectBrowser projects={projects} />
        </Suspense>
      </Section>
      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="display-3">What to expect on every project page</h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {expectations.map((e) => (
                <li key={e} className="py-3">
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="display-3">After purchase</h2>
              <p className="mt-4 text-ink-2">
                Access eligible digital files in{" "}
                <Link href="/account/downloads" className="underline underline-offset-4">
                  My Downloads
                </Link>
                . Order history displays purchase details and available files. Physical-kit fulfilment, where offered, has separately stated shipping terms.
              </p>
            </div>
            <DraftNotice>
              <strong>Responsible learning.</strong> {responsibleLearningNote}
            </DraftNotice>
            <p className="text-sm text-muted">
              Need help with a project you bought?{" "}
              <Link href="/support#project-support" className="underline underline-offset-4">
                Get Project Support
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
