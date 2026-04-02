"use client";

import { useState } from "react";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

const resumePath = "/Kaan_Kaya_Resume.pdf";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/60 bg-white/80 px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <a
          href="#home"
          className="flex items-center gap-3 text-left"
          aria-label="Go to home section"
        >
          <Image
            src="/logo.jpg"
            alt="Kaan Kaya logo"
            width={38}
            height={38}
            className="h-[38px] w-[38px] rounded-full border border-slate-200 object-cover"
          />
          <div>
            <p className="text-base font-bold text-slate-950">Kaan Kaya</p>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Software Engineer
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </a>
          ))}
          <a
            href={resumePath}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Resume
          </a>
        </div>

        <button
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-950 md:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>
      </nav>

      {isOpen ? (
        <div className="mx-auto mt-3 w-full max-w-6xl rounded-[1.5rem] border border-white/60 bg-white/95 p-3 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                {item.label}
              </a>
            ))}
            <a
              href={resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={() => setIsOpen(false)}
            >
              Resume
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
