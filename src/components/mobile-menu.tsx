"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

/** Section menu for narrow screens; the desktop header shows these links inline. */
export function MobileMenu({ items, label }: { items: { href: string; label: string }[]; label: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center text-ink hover:bg-ink hover:text-label"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav
          id={panelId}
          aria-label={label}
          className="absolute inset-x-0 top-full border-b-2 border-rule bg-bench px-4 pb-4 pt-2"
        >
          <ul className="grid gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-hair px-1 py-3.5 text-lg font-medium last:border-0 hover:text-scan"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
