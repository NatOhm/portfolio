import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import { projects, getProjectBySlug } from "@/lib/projects";
import { mediaDims } from "@/lib/media-dimensions";
import CaseStudyBody from "@/components/CaseStudyBody";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const ogSrc = `/images/og/${project.slug}.jpg`;
  const ogDims = mediaDims(ogSrc) ?? { width: 1200, height: 630 };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      type: "article",
      images: [{ url: ogSrc, ...ogDims }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <CaseStudyBody
      project={project}
      prev={prev}
      next={next}
      ordinal={{ index: index + 1, total: projects.length }}
    />
  );
}
