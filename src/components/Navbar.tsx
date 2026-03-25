"use client";

import { useState } from "react";
import type { RefObject } from "react";
import Image from "next/image";

interface NavbarProps {
  scrollToSection: (ref: RefObject<HTMLDivElement | null>) => void;
  homeRef: RefObject<HTMLDivElement | null>;
  projectsRef: RefObject<HTMLDivElement | null>;
  aboutRef: RefObject<HTMLDivElement | null>;
  contactRef: RefObject<HTMLDivElement | null>;
}

const navItems = [
  { label: "Home", key: "homeRef" },
  { label: "Projects", key: "projectsRef" },
  { label: "About", key: "aboutRef" },
  { label: "Contact", key: "contactRef" },
] as const;

const resumePath = "/Kaan_Kaya_Resume.pdf";

export default function Navbar({
  scrollToSection,
  homeRef,
  projectsRef,
  aboutRef,
  contactRef,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sectionMap = {
    homeRef,
    projectsRef,
    aboutRef,
    contactRef,
  };

  const handleNavigate = (key: keyof typeof sectionMap) => {
    scrollToSection(sectionMap[key]);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/60 bg-white/80 px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <button
          onClick={() => handleNavigate("homeRef")}
          className="flex items-center gap-3 text-left"
          aria-label="Go to home section"
        >
          <Image
            src="/logo.png"
            alt="Kaan Kaya logo"
            width={38}
            height={38}
            className="rounded-full border border-slate-200"
          />
          <div>
            <p className="text-base font-bold text-slate-950">Kaan Kaya</p>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Software Engineer
            </p>
          </div>
        </button>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.key)}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </button>
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
              <button
                key={item.label}
                onClick={() => handleNavigate(item.key)}
                className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                {item.label}
              </button>
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
