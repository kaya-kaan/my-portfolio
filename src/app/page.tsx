"use client";

import { useRef, useState } from "react";
import type { RefObject } from "react";
import Navbar from "../components/Navbar";
import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

type Project = {
  title: string;
  stack: string[];
  summary: string;
  details: string[];
};

type StatusState = {
  tone: "success" | "error";
  message: string;
} | null;

const projects: Project[] = [
  {
    title: "Smart Spender",
    stack: ["Java", "Android"],
    summary: "Budget Tracking Application",
    details: [
      "This project is a mobile-first budgeting application designed to help users actively manage their personal finances through structured tracking and real-time insights. Built as part of a collaborative Agile team, the application focuses on usability, performance, and clear financial visibility.",
      "The system allows users to record income and expenses across multiple categories, set budgets, and monitor spending behavior dynamically. The core logic was designed to handle categorized financial data efficiently, ensuring accurate aggregation and real-time updates across the app.",
      "A key contribution was the development of modular tracking components that support flexible financial inputs while maintaining consistency in how data is processed and displayed. The application also includes an interactive dashboard that visualizes financial activity, helping users quickly understand their spending patterns without digging through raw data.",
      "Extensive testing was conducted across multiple Android devices to identify performance bottlenecks and UI inconsistencies. This resulted in improved responsiveness, smoother navigation, and a more reliable user experience overall.",
      "The project demonstrates strong fundamentals in mobile development, object-oriented design, and building user-centric systems that translate complex data into usable insights.",
    ],
  },
  {
    title: "Portfolio Website",
    stack: ["Next.js", "React", "Tailwind CSS"],
    summary: "Responsive personal site",
    details: [
      "This is a fully responsive portfolio website built to present projects, technical skills, and experience in a clean and structured format. The focus of this project was not just design, but performance, scalability, and maintainability.",
      "The application is built using Next.js, leveraging server-side rendering and optimized routing to improve load times and SEO performance. The UI is structured using reusable React components, allowing for consistent design patterns and easier future expansion.",
      "A key focus was performance optimization: minimizing unnecessary re-renders, optimizing asset loading, and ensuring fast navigation across pages. The site adapts seamlessly across different screen sizes, maintaining usability and visual consistency on both mobile and desktop.",
      "The project also emphasizes clean architecture and component reusability, making it easy to scale as new projects and features are added over time.",
      "This is not just a portfolio. It is a demonstration of front-end engineering practices, performance awareness, and attention to user experience.",
    ],
  },
  {
    title: "House Hunter Canada",
    stack: ["Java", "MySQL"],
    summary: "Housing Affordability Analyzer",
    details: [
      "This project is a data-driven application designed to analyze housing affordability across different regions in Canada using structured datasets. The goal was to turn raw housing and income data into something users can actually query and make sense of.",
      "The backend system was built in Java, with MySQL used to manage and query large datasets efficiently. A major focus was optimizing SQL queries to handle filtering across multiple variables such as income levels, geographic regions, and housing types without performance degradation.",
      "The application supports dynamic search functionality, allowing users to apply multiple filters simultaneously and retrieve relevant results quickly. This required careful design of query logic and indexing strategies to maintain responsiveness even as dataset size increases.",
      "The project highlights strengths in backend development, database design, and working with real-world data constraints. It shows the ability to build systems that are not just functional, but scalable and efficient under realistic data loads.",
    ],
  },
];

const focusAreas = [
  "Backend development",
  "Data-driven systems",
  "Workflow automation",
  "Scalable application design",
];

const resumePath = "/Kaan_Kaya_Resume.pdf";

export default function Home() {
  const homeRef = useRef<HTMLDivElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<StatusState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToSection = (ref: RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
            "The form is unavailable right now. Please use the direct email link.",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({
        tone: "error",
        message:
          "The form is unavailable right now. Please use the direct email link.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(244,114,43,0.18),_transparent_55%),radial-gradient(circle_at_20%_20%,_rgba(14,116,144,0.14),_transparent_32%)]" />
      <Navbar
        scrollToSection={scrollToSection}
        homeRef={homeRef}
        projectsRef={projectsRef}
        aboutRef={aboutRef}
        contactRef={contactRef}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <section
          ref={homeRef}
          className="grid min-h-[36rem] items-center gap-6 rounded-[2rem] border border-stone-200/70 bg-white/85 px-6 py-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[1.3fr_0.7fr] md:px-10 md:py-8"
        >
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-amber-300 bg-amber-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-amber-900">
              New Graduate Software Engineer
            </p>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Kaan Kaya
              </h1>
              <p className="max-w-3xl text-xl leading-8 text-slate-700 sm:text-2xl">
                I build scalable software and data-driven systems that solve real
                problems. From automating workflows to developing full-stack
                applications, I focus on efficiency, performance, and practical
                impact.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => scrollToSection(projectsRef)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View Projects
                <FaArrowRight size={12} />
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Contact Me
                <FaEnvelope size={12} />
              </button>
              <a
                href={resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-transparent px-6 py-3 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
              >
                Open Resume
              </a>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-cyan-200 bg-cyan-50/90 p-6 text-slate-900 shadow-[0_25px_60px_rgba(14,116,144,0.12)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-800">
              Core Focus
            </p>
            <ul className="mt-6 space-y-3">
              {focusAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-2xl border border-cyan-100 bg-white px-4 py-4 text-base text-slate-800"
                >
                  {area}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border border-cyan-200 bg-white/80 p-4">
              <p className="text-sm leading-7 text-slate-700">
                Strong foundation in data structures, algorithms, object-oriented
                programming, and building systems that stay maintainable as
                requirements grow.
              </p>
            </div>
          </div>
        </section>

        <section
          ref={projectsRef}
          className="rounded-[2rem] border border-stone-200/70 bg-stone-50/90 px-6 py-10 shadow-[0_24px_70px_rgba(148,163,184,0.16)] md:px-10"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Selected Work
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Projects presented in a clear, expandable list format
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              Screenshots and motion previews can be layered in later. For now,
              each project emphasizes what it does, how it was built, and why the
              implementation matters.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {projects.map((project) => (
              <article
                key={project.title}
                className="grid gap-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] lg:grid-cols-[220px_1fr]"
              >
                <div className="flex flex-col justify-between gap-6 rounded-[1.5rem] bg-slate-950 p-5 text-white">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                      Project
                    </p>
                    <h3 className="mt-3 text-2xl font-bold">{project.title}</h3>
                    <p className="mt-2 text-base text-slate-300">
                      {project.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 text-base leading-8 text-slate-700">
                  {project.details.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          ref={aboutRef}
          className="grid gap-6 rounded-[2rem] border border-stone-200/70 bg-white/90 px-6 py-10 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:grid-cols-[1.1fr_0.9fr] md:px-10"
        >
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              About
            </p>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Building reliable software with practical output in mind
            </h2>
            <p className="text-lg leading-8 text-slate-700">
              New graduate Software Engineer with experience in backend
              development, data-driven systems, and workflow automation. Strong
              foundation in data structures, algorithms, and object-oriented
              programming. Proven ability to improve efficiency, process
              high-volume datasets, and build scalable applications.
            </p>
          </div>

          <div className="flex items-start">
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
                    Resume Preview
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    A compact preview of the latest PDF without letting it take
                    over the section.
                  </p>
                </div>
                <a
                  href={resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Open Full Resume
                </a>
              </div>
              <div className="h-[24rem] bg-stone-100 p-3">
                <iframe
                  src={resumePath}
                  title="Kaan Kaya resume preview"
                  className="h-full w-full rounded-[1rem] border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          ref={contactRef}
          className="grid gap-6 rounded-[2rem] border border-stone-200/70 bg-[#fff7ef]/90 px-6 py-10 shadow-[0_24px_70px_rgba(249,115,22,0.12)] lg:grid-cols-[0.9fr_1.1fr] md:px-10"
        >
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
              Contact
            </p>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Reach out for roles, collaborations, or technical conversations
            </h2>
            <p className="text-lg leading-8 text-slate-700">
              The fastest way to reach me is directly by email or LinkedIn. The
              form below is available when email delivery is configured on the
              deployment.
            </p>

            <div className="space-y-3 rounded-[1.5rem] border border-orange-200 bg-white p-5">
              <a
                href="mailto:kaan.kaya.dev@gmail.com"
                className="block text-lg font-semibold text-slate-900 transition hover:text-orange-700"
              >
                kaan.kaya.dev@gmail.com
              </a>
              <a
                href="tel:+16472812725"
                className="block text-lg font-semibold text-slate-900 transition hover:text-orange-700"
              >
                +1 (647) 281-2725
              </a>
              <div className="flex gap-4 pt-2">
                <a
                  href="https://github.com/kaya-kaan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-950"
                >
                  <FaGithub size={16} />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/kaankaya7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-950"
                >
                  <FaLinkedin size={16} />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
          >
            <h3 className="text-2xl font-bold text-slate-950">Send a message</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Use the form for a quick introduction, project inquiry, or role
              discussion.
            </p>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <textarea
                placeholder="Tell me what you are building or hiring for"
                className="min-h-40 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
              <p className="text-sm leading-6 text-slate-500">
                Prefer direct contact? Email is usually fastest.
              </p>
            </div>

            {status ? (
              <p
                className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
                  status.tone === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {status.message}
              </p>
            ) : null}
          </form>
        </section>
      </main>
    </div>
  );
}
