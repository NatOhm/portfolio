import type { Metadata } from "next";
import ExperienceBody from "@/components/ExperienceBody";
import { profile } from "@/lib/content";
import { ogFor } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Experience",
  description: `Work experience of ${profile.name} — ${profile.role}.`,
  alternates: { canonical: "/experience" },
  openGraph: ogFor("/experience"),
};

export default function ExperiencePage() {
  return <ExperienceBody />;
}
