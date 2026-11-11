"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The email as the action. Clicking copies it and the address squishes for a
 * beat; "Copied" is announced through a polite status region rather than shown
 * silently, because the click produces no navigation to confirm it.
 *
 * The legacy execCommand path exists for insecure origins and older Safari,
 * where clipboard.writeText is unavailable or rejected; the address is still
 * selected text in a mail client's favour at worst.
 */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const [squish, setSquish] = useState(false);
  const reset = useRef<number | undefined>(undefined);
  const bounce = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    if (reset.current) window.clearTimeout(reset.current);
    if (bounce.current) window.clearTimeout(bounce.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const field = document.createElement("textarea");
      field.value = email;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.top = "0";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand("copy");
      } catch {
        /* Nothing else to try: the address is still visible to select by hand. */
      }
      field.remove();
    }

    setCopied(true);
    /* The squish is a pulse: hold it for a beat, release, leave the label up.
       Written as inline style below rather than through a data attribute so the
       press is never lost to whichever rule wins the cascade. */
    setSquish(true);
    if (bounce.current) window.clearTimeout(bounce.current);
    bounce.current = window.setTimeout(() => setSquish(false), 260);
    if (reset.current) window.clearTimeout(reset.current);
    reset.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <span className="copy-email-wrap">
      <button
        type="button"
        onClick={copy}
        className="copy-email"
        title="Copy email address"
        style={squish ? { transform: "scale3d(0.955, 0.93, 1)" } : undefined}
      >
        {email}
      </button>
      <span
        className="copy-note font-meta text-meta uppercase"
        role="status"
        aria-live="polite"
        style={{
          opacity: copied ? 1 : 0,
          transform: copied ? "none" : "translateY(0.2em)",
        }}
      >
        {copied ? "Copied" : ""}
      </span>
    </span>
  );
}
