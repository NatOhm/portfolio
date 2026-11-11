import type { Metadata } from "next";
import ExperienceBody from "@/components/ExperienceBody";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Experience",
  description: `Work experience of ${profile.name} — ${profile.role}.`,
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return <ExperienceBody />;
}
