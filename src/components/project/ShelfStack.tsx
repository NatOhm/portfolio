"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import type { Project } from "@/lib/types";
import { useOnceInView } from "./useOnceInView";

/**
 * Nong Kati's signature: the shipped storefront as three objects standing on
 * one shelf rail — home, product page, cart drawer. Each tag is the opening of
 * that screenshot's own caption; nothing is renamed.
 */
const SHELF = [
  { match: "cover", label: "Storefront home" },
  { match: "product", label: "Product page" },
  { match: "cart", label: "Cart drawer" },
];

export default function ShelfStack({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  useOnceInView(ref, "shelf");

  const items = SHELF.flatMap(({ match, label }) => {
    const item = project.gallery.find((media) => media.src.includes(match));
    return item ? [{ label, src: item.src }] : [];
  });

  if (items.length === 0) return null;

  return (
    <section className="cs-signature px-4 pt-10 md:px-6 md:pt-14">
      <div ref={ref} className="shelf mx-auto max-w-[1280px]">
        <div className="shelf-track">
          {items.map((item, i) => (
            <figure className="shelf-item" key={item.label} style={{ "--i": i } as CSSProperties}>
              <figcaption className="shelf-tag font-meta text-meta uppercase text-faint">
                {item.label}
              </figcaption>
              <div className="shelf-frame">
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 78vw, 380px"
                  className="object-cover"
                />
              </div>
            </figure>
          ))}
        </div>
        <div aria-hidden="true" className="shelf-rail" />
      </div>
    </section>
  );
}
