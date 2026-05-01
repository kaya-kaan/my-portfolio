"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { themeStorageKey, type Theme } from "../lib/theme";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

const resumePath = "/Kaan_Kaya_Resume.pdf";

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;

  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    window.localStorage.setItem(themeStorageKey, nextTheme);
    setTheme(nextTheme);
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleTheme}
        className="theme-floating-toggle fixed right-4 top-20 z-[60] inline-flex rounded-full border p-2 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 md:right-6 xl:right-8 xl:top-5"
        aria-pressed={theme === "dark"}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <span className="theme-switch-track relative flex h-10 w-[4.75rem] items-center justify-between rounded-full border px-2.5">
          <FaSun className="theme-switch-icon" size={12} aria-hidden="true" />
          <FaMoon className="theme-switch-icon" size={12} aria-hidden="true" />
          <span
            className={`theme-switch-thumb absolute left-1 top-1 flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 ${
              theme === "dark" ? "translate-x-9" : "translate-x-0"
            }`}
            aria-hidden="true"
          >
            {theme === "dark" ? <FaMoon size={12} /> : <FaSun size={12} />}
          </span>
        </span>
      </button>

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="theme-nav mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border px-4 py-3 backdrop-blur">
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
              className="theme-border-default h-[38px] w-[38px] rounded-full border object-cover"
            />
            <div>
              <p className="theme-text-strong text-base font-bold">Kaan Kaya</p>
              <p className="theme-text-muted text-xs uppercase tracking-[0.16em]">
                Software Engineer
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="theme-text-secondary theme-hover-surface theme-hover-strong rounded-full px-4 py-2 text-sm font-semibold transition"
              >
                {item.label}
              </a>
            ))}
            <a
              href={resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="theme-button-primary ml-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold transition"
            >
              Resume
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="theme-button-secondary inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              Menu
            </button>
          </div>
        </nav>

        {isOpen ? (
          <div className="theme-menu mx-auto mt-3 w-full max-w-6xl rounded-[1.5rem] border p-3 backdrop-blur md:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="theme-text-secondary theme-hover-surface theme-hover-strong rounded-2xl px-4 py-3 text-left text-sm font-semibold transition"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-button-primary rounded-2xl px-4 py-3 text-sm font-semibold transition"
                onClick={() => setIsOpen(false)}
              >
                Resume
              </a>
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}
