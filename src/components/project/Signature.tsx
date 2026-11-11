import type { Project } from "@/lib/types";
import AnimHoodieSignature from "./AnimHoodieSignature";
import PattayaSignature from "./PattayaSignature";
import TkSignature from "./TkSignature";
import LessonTemplate from "./LessonTemplate";
import StampRecord from "./StampRecord";
import ScanPlate from "./ScanPlate";
import ShelfStack from "./ShelfStack";

/**
 * One signature element per project page, chosen by slug so the project record
 * stays content-only. Projects without one yet render nothing.
 */
export default function ProjectSignature({ project }: { project: Project }) {
  switch (project.slug) {
    case "anim-hoodie":
      return <AnimHoodieSignature project={project} />;
    case "pattaya-guide":
      return <PattayaSignature project={project} />;
    case "tk-campaign":
      return <TkSignature project={project} />;
    case "blueventure-elearning":
      return <LessonTemplate project={project} />;
    case "en-kku":
      return <StampRecord project={project} />;
    case "sci-fi-environments":
      return <ScanPlate project={project} />;
    case "nong-kati-store":
      return <ShelfStack project={project} />;
    default:
      return null;
  }
}
