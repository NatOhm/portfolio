import type { Metadata } from "next";
import AboutBody from "@/components/AboutBody";
import { profile } from "@/lib/content";
import { ogFor } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "About",
  description: profile.intro,
  alternates: { canonical: "/about" },
  openGraph: ogFor("/about"),
};

export default function AboutPage() {
  return <AboutBody />;
}
