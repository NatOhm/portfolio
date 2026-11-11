import type { Metadata } from "next";
import ContactBody from "@/components/ContactBody";
import { profile } from "@/lib/content";
import { ogFor } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${profile.name} — ${profile.role}.`,
  alternates: { canonical: "/contact" },
  openGraph: ogFor("/contact"),
};

export default function ContactPage() {
  return <ContactBody />;
}
