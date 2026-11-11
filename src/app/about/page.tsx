import type { Metadata } from "next";
import AboutBody from "@/components/AboutBody";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: profile.intro,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutBody />;
}
