"use client";

import Image from "next/image";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FaArrowRight,
  FaEnvelope,
  FaGithub,
  FaJava,
  FaLinkedin,
  FaRobot,
  FaServer,
} from "react-icons/fa";
import {
  SiAndroid,
  SiDocker,
  SiGithub,
  SiMysql,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTelegram,
  SiTypescript,
} from "react-icons/si";
import Navbar from "./Navbar";

type StackItem = {
  label: string;
  icon: IconType;
  accentClassName: string;
};

type Project = {
  title: string;
  stack: StackItem[];
  summary: string;
  details: string[];
  repoUrl?: string;
};

type TechHighlight = StackItem & {
  category: string;
  description: string;
};

type StatusState = {
  tone: "success" | "error";
  message: string;
} | null;

type HomePageProps = {
  contactFormEnabled: boolean;
};

const stackItems = {
  java: {
    label: "Java",
    icon: FaJava,
    accentClassName: "bg-orange-100 text-orange-700",
  },
  android: {
    label: "Android",
    icon: SiAndroid,
    accentClassName: "bg-emerald-100 text-emerald-700",
  },
  mysql: {
    label: "MySQL",
    icon: SiMysql,
    accentClassName: "bg-sky-100 text-sky-700",
  },
  nextjs: {
    label: "Next.js",
    icon: SiNextdotjs,
    accentClassName: "bg-slate-200 text-slate-900",
  },
  react: {
    label: "React",
    icon: SiReact,
    accentClassName: "bg-cyan-100 text-cyan-700",
  },
  tailwind: {
    label: "Tailwind CSS",
    icon: SiTailwindcss,
    accentClassName: "bg-teal-100 text-teal-700",
  },
  typescript: {
    label: "TypeScript",
    icon: SiTypescript,
    accentClassName: "bg-blue-100 text-blue-700",
  },
  github: {
    label: "GitHub",
    icon: SiGithub,
    accentClassName: "bg-slate-100 text-slate-700",
  },
  docker: {
    label: "Docker Compose",
    icon: SiDocker,
    accentClassName: "bg-blue-100 text-blue-700",
  },
  mcp: {
    label: "MCP",
    icon: FaServer,
    accentClassName: "bg-violet-100 text-violet-700",
  },
  openclaw: {
    label: "OpenClaw",
    icon: FaRobot,
    accentClassName: "bg-rose-100 text-rose-700",
  },
  telegram: {
    label: "Telegram",
    icon: SiTelegram,
    accentClassName: "bg-sky-100 text-sky-700",
  },
} as const satisfies Record<string, StackItem>;

const projects: Project[] = [
  {
    title: "Portfolio Website",
    stack: [stackItems.nextjs, stackItems.typescript, stackItems.tailwind],
    summary:
      "Self-hosted portfolio site built to showcase projects, technical skills, and experience with a production-oriented deployment setup.",
    details: [
      "Developed a responsive personal portfolio website using Next.js, React, and TypeScript to showcase projects, technical skills, and experience.",
      "Built reusable and modular UI components with Tailwind CSS, including responsive layouts, theme support, and a consistent mobile-friendly interface.",
      "Deployed the application behind Cloudflare Tunnel, Docker Compose, and Caddy, creating a self-hosted production setup with origin protection and reverse-proxy routing.",
      "Implemented a production-ready contact workflow with server-side validation, rate limiting, and email delivery using Resend, along with structured request logging for easier debugging.",
    ],
    repoUrl: "https://github.com/kaya-kaan/my-portfolio",
  },
  {
    title: "AI-Assisted Server Monitoring Tool",
    stack: [
      stackItems.typescript,
      stackItems.mcp,
      stackItems.openclaw,
      stackItems.telegram,
    ],
    summary:
      "Operational tooling layer for live server inspection and visit alerts using a custom MCP server, OpenClaw, and Telegram.",
    details: [
      "Built a read-only Model Context Protocol (MCP) server in TypeScript to expose live server health, Docker Compose status, repository state, and deployment files to an AI agent.",
      "Integrated the MCP server with a self-hosted OpenClaw agent and Telegram, enabling remote operational queries and server inspection through chat.",
      "Implemented a log-based watcher that tails Caddy access logs, filters likely human traffic with deterministic heuristics, and sends real-time visit alerts.",
      "Structured the system to keep public code separate from private runtime state by storing secrets, agent configuration, and production environment files outside the repository.",
    ],
    repoUrl: "https://github.com/kaya-kaan/my-portfolio/tree/main/mcp-server",
  },
  {
    title: "Smart Spender",
    stack: [stackItems.java, stackItems.android],
    summary:
      "Android budgeting app built in a team setting to help users track spending, budgets, and category-level financial activity.",
    details: [
      "Collaborated in a 4-person Agile team to design and develop a mobile budgeting application with core financial tracking features.",
      "Implemented income, expense, and budget tracking modules, enabling users to manage multiple financial categories in real time.",
      "Designed an interactive dashboard to improve financial visibility and user experience.",
      "Conducted testing across multiple Android devices, identifying and resolving UI and performance issues to ensure consistent usability.",
    ],
    repoUrl: "https://github.com/atmiya0/SmartSpender_EECS4443",
  },
];

const focusAreas = [
  "Backend services that stay easy to reason about",
  "Data-heavy features with clear querying and reporting",
  "Automation that removes repetitive manual work",
  "Web products that stay fast across devices",
];

const techHighlights: TechHighlight[] = [
  {
    ...stackItems.java,
    category: "Backend",
    description:
      "Primary language for object-oriented application logic, business rules, and systems work.",
  },
  {
    ...stackItems.typescript,
    category: "Web",
    description:
      "Type-safe development for React and Next.js interfaces that are easier to maintain over time.",
  },
  {
    ...stackItems.nextjs,
    category: "Framework",
    description:
      "Used for routing, SEO, server rendering, and polished production-ready frontend workflows.",
  },
  {
    ...stackItems.react,
    category: "Frontend",
    description:
      "Reusable component architecture for responsive, accessible interfaces and smooth iteration.",
  },
  {
    ...stackItems.tailwind,
    category: "Styling",
    description:
      "Fast UI implementation with utility-first styling and consistent design across sections.",
  },
  {
    ...stackItems.mysql,
    category: "Data",
    description:
      "Relational modeling and query design for data-driven applications and reporting-heavy flows.",
  },
  {
    ...stackItems.android,
    category: "Mobile",
    description:
      "Experience building native Android coursework projects with device testing and UI refinement.",
  },
  {
    ...stackItems.github,
    category: "Tooling",
    description:
      "Source control, portfolio publishing, and code sharing that makes projects easy to review.",
  },
];

const aboutHighlights = [
  {
    label: "I enjoy solving",
    value:
      "messy data problems, repetitive workflows, and backend tasks that need to become simpler and more reliable.",
  },
  {
    label: "I am excited about",
    value:
      "Java, TypeScript, SQL, automation, and the product thinking required to turn technical work into useful outcomes.",
  },
  {
    label: "I am looking for",
    value:
      "software engineering roles where I can contribute across backend or full-stack work, ship real features, and keep sharpening my fundamentals.",
  },
];

const resumePath = "/Kaan_Kaya_Resume.pdf";
const resumePreviewPath = "/resume-preview.png";

export default function HomePage({ contactFormEnabled }: HomePageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<StatusState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = (await res.json().catch(() => null)) as
        | { success?: boolean; message?: string; error?: string }
        | null;

      if (res.ok) {
        setStatus({
          tone: "success",
          message: data?.message ?? "Message sent successfully.",
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus({
          tone: "error",
          message:
            data?.error ??
            "I could not send the message right now. Please email me directly.",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({
        tone: "error",
        message: "I could not send the message right now. Please email me directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <section
          id="home"
          className="theme-panel scroll-mt-28 grid min-h-[36rem] items-center gap-6 rounded-[2rem] border px-6 py-8 backdrop-blur md:grid-cols-[1.3fr_0.7fr] md:px-10 md:py-8"
        >
          <div className="space-y-6">
            <p className="theme-pill-accent inline-flex rounded-full border px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em]">
              Software Engineer
            </p>
            <div className="space-y-4">
              <h1 className="theme-text-strong max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Kaan Kaya
              </h1>
              <p className="theme-text-secondary max-w-3xl text-xl leading-8 sm:text-2xl">
                I build backend-heavy products, data workflows, and web
                interfaces that stay practical under real constraints. My focus
                is clear architecture, maintainable code, and software that
                turns messy requirements into dependable systems.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#projects"
                className="theme-button-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition"
              >
                View Projects
                <FaArrowRight size={12} />
              </a>
              <a
                href="#contact"
                className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition"
              >
                Contact Me
                <FaEnvelope size={12} />
              </a>
              <a
                href={resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-button-ghost inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition"
              >
                Open Resume
              </a>
            </div>
          </div>

          <div className="theme-accent-panel theme-text-primary rounded-[1.75rem] border p-6">
            <p className="theme-text-accent-strong text-sm font-semibold uppercase tracking-[0.18em]">
              What I Like Building
            </p>
            <ul className="mt-6 space-y-3">
              {focusAreas.map((area) => (
                <li
                  key={area}
                  className="theme-accent-card theme-text-primary rounded-2xl border px-4 py-4 text-base"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="projects"
          className="theme-panel-muted scroll-mt-28 rounded-[2rem] border px-6 py-10 md:px-10"
        >
          <div className="max-w-3xl">
            <p className="theme-text-accent text-sm font-semibold uppercase tracking-[0.18em]">
              Selected Work
            </p>
            <h2 className="theme-text-strong mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Projects that show how I approach web development, operational
              tooling, and product engineering
            </h2>
            <p className="theme-text-secondary mt-4 text-lg leading-8">
              Each project card highlights the implementation work, the stack
              involved, and the engineering decisions behind the build.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {projects.map((project) => (
              <article
                key={project.title}
                className="theme-accent-panel grid gap-6 rounded-[1.75rem] border p-6 lg:grid-cols-[220px_1fr]"
              >
                <div className="theme-brand-surface flex flex-col justify-between gap-6 rounded-[1.5rem] p-5 text-white">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
                      Project
                    </p>
                    <h3 className="mt-3 text-2xl font-bold">{project.title}</h3>
                    <p className="theme-text-on-brand-muted mt-2 text-base leading-7">
                      {project.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((item) => {
                      const Icon = item.icon;

                      return (
                        <span
                          key={item.label}
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-100"
                        >
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${item.accentClassName}`}
                          >
                            <Icon size={12} />
                          </span>
                          {item.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-5">
                  {project.repoUrl ? (
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="theme-button-secondary inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition"
                      >
                        <FaGithub size={16} />
                        View Repository
                      </a>
                    </div>
                  ) : null}

                  <ul className="space-y-3">
                    {project.details.map((detail) => (
                      <li
                        key={detail}
                        className="theme-text-secondary flex gap-3 text-base leading-7"
                      >
                        <span className="mt-3 h-2.5 w-2.5 flex-none rounded-full bg-[var(--text-accent)]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="stack"
          className="theme-panel scroll-mt-28 rounded-[2rem] border px-6 py-10 md:px-10"
        >
          <div className="max-w-3xl">
            <p className="theme-text-accent text-sm font-semibold uppercase tracking-[0.18em]">
              Tech Stack
            </p>
            <h2 className="theme-text-strong mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Technologies I reach for most often
            </h2>
            <p className="theme-text-secondary mt-4 text-lg leading-8">
              Recognizable tooling makes the page easier to scan, so the stack
              is called out explicitly instead of being buried in plain text.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {techHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.label}
                  className="theme-accent-panel rounded-[1.5rem] border p-5"
                >
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${item.accentClassName}`}
                  >
                    <Icon size={24} />
                  </span>
                  <p className="theme-text-muted mt-5 text-sm font-semibold uppercase tracking-[0.16em]">
                    {item.category}
                  </p>
                  <h3 className="theme-text-strong mt-2 text-xl font-bold">
                    {item.label}
                  </h3>
                  <p className="theme-text-secondary mt-3 text-sm leading-7">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="about"
          className="theme-panel scroll-mt-28 grid gap-6 rounded-[2rem] border px-6 py-10 md:px-10 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="space-y-5">
            <p className="theme-text-accent text-sm font-semibold uppercase tracking-[0.18em]">
              About
            </p>
            <h2 className="theme-text-strong text-3xl font-black tracking-tight sm:text-4xl">
              I like turning complex workflows and raw data into tools people
              can actually use
            </h2>
            <p className="theme-text-secondary text-lg leading-8">
              I am a software engineer with a strong interest in backend
              systems, automation, and data-driven products. I enjoy building
              the parts of a product that make everything else easier: reliable
              APIs, clean data models, and interfaces that help people move
              faster.
            </p>
            <p className="theme-text-secondary text-lg leading-8">
              The work I gravitate toward usually starts with ambiguity. There
              is a process that feels too manual, a dataset that is difficult to
              explore, or a product flow that needs to become clearer and more
              dependable. That is the kind of problem space I want to keep
              working in.
            </p>

            <div className="theme-accent-panel space-y-3 rounded-[1.5rem] border p-5">
              {aboutHighlights.map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="theme-text-muted text-sm font-semibold uppercase tracking-[0.16em]">
                    {item.label}
                  </p>
                  <p className="theme-text-secondary text-base leading-7">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start">
            <div className="theme-card overflow-hidden rounded-[1.5rem] border">
              <div className="theme-brand-surface theme-border-accent flex flex-col gap-3 border-b p-5 text-white sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
                    Resume Preview
                  </p>
                </div>
                <a
                  href={resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-button-contrast inline-flex rounded-full px-5 py-3 text-sm font-semibold transition"
                >
                  Open Full Resume
                </a>
              </div>
              <div className="theme-card-muted p-3">
                <a
                  href={resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-border-default block overflow-hidden rounded-[1rem] border bg-[var(--surface-panel-solid)] transition hover:opacity-95"
                >
                  <Image
                    src={resumePreviewPath}
                    alt="Preview of Kaan Kaya's resume"
                    width={816}
                    height={1056}
                    className="h-auto w-full"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="theme-contact-panel scroll-mt-28 grid gap-6 rounded-[2rem] border px-6 py-10 md:px-10 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="space-y-5">
            <p className="theme-text-accent text-sm font-semibold uppercase tracking-[0.18em]">
              Contact
            </p>
            <h2 className="theme-text-strong text-3xl font-black tracking-tight sm:text-4xl">
              Reach out for software engineering roles, collaborations, or
              technical conversations
            </h2>
            <p className="theme-text-secondary text-lg leading-8">
              {contactFormEnabled
                ? "Email is usually the fastest way to reach me, but you can also use the form for a quick introduction, project discussion, or role opportunity."
                : "Email or LinkedIn is the fastest way to reach me for interviews, projects, or technical conversations."}
            </p>

            <div className="theme-accent-panel space-y-3 rounded-[1.5rem] border p-5">
              <a
                href="mailto:kaan.kaya.dev@gmail.com"
                className="theme-text-primary theme-link-accent inline-flex items-center gap-3 text-lg font-semibold transition"
              >
                <FaEnvelope size={18} />
                kaan.kaya.dev@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/kaankaya7/"
                target="_blank"
                rel="noopener noreferrer"
                className="theme-text-primary theme-link-accent inline-flex items-center gap-3 text-lg font-semibold transition"
              >
                <FaLinkedin size={18} />
                linkedin.com/in/kaankaya7
              </a>
              <a
                href="https://github.com/kaya-kaan"
                target="_blank"
                rel="noopener noreferrer"
                className="theme-text-primary theme-link-accent inline-flex items-center gap-3 text-lg font-semibold transition"
              >
                <FaGithub size={18} />
                github.com/kaya-kaan
              </a>
            </div>
          </div>

          {contactFormEnabled ? (
            <form
              onSubmit={handleSubmit}
              className="theme-card rounded-[1.75rem] border p-6"
            >
              <h3 className="theme-text-strong text-2xl font-bold">
                Send a message
              </h3>
              <p className="theme-text-muted mt-2 text-sm leading-7">
                Use the form for a quick introduction, project inquiry, or role
                discussion.
              </p>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="contact-name"
                    className="theme-text-secondary block text-sm font-semibold"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    placeholder="Your name"
                    className="theme-input w-full rounded-2xl border px-4 py-3 outline-none transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="theme-text-secondary block text-sm font-semibold"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    placeholder="Your email"
                    className="theme-input w-full rounded-2xl border px-4 py-3 outline-none transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contact-message"
                    className="theme-text-secondary block text-sm font-semibold"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    maxLength={2000}
                    placeholder="Your message..."
                    className="theme-input min-h-40 w-full rounded-2xl border px-4 py-3 outline-none transition"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="theme-button-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
                <p className="theme-text-muted text-sm leading-6">
                  Prefer direct contact? Email is usually fastest.
                </p>
              </div>

              {status ? (
                <p
                  className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
                    status.tone === "success"
                      ? "theme-status-success"
                      : "theme-status-error"
                  }`}
                >
                  {status.message}
                </p>
              ) : null}
            </form>
          ) : (
            <div className="theme-card flex h-full flex-col justify-between rounded-[1.75rem] border p-6">
              <div>
                <h3 className="theme-text-strong text-2xl font-bold">
                  Start a conversation
                </h3>
                <p className="theme-text-secondary mt-3 text-base leading-8">
                  If you are hiring, want to discuss a project, or just want to
                  talk through the code behind these builds, email is the best
                  starting point and LinkedIn works well too.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:kaan.kaya.dev@gmail.com"
                  className="theme-button-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition"
                >
                  <FaEnvelope size={14} />
                  Email Kaan
                </a>
                <a
                  href="https://www.linkedin.com/in/kaankaya7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition"
                >
                  <FaLinkedin size={14} />
                  Message on LinkedIn
                </a>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
