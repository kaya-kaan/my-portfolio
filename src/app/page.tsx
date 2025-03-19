"use client";

import Head from 'next/head';
import Link from 'next/link';
import Navbar from './/components/Navbar';
import { useRef } from 'react';

export default function Home() {
  const homeRef = useRef<HTMLDivElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white flex flex-col items-center justify-center">
      <Head>
        <title>My Portfolio</title>
        <meta name="description" content="A portfolio showcasing my projects and skills." />
      </Head>

      <Navbar scrollToSection={scrollToSection} homeRef={homeRef} projectsRef={projectsRef} aboutRef={aboutRef} contactRef={contactRef} />

      <main className="mt-20 p-6 w-full max-w-5xl">
        <section ref={homeRef} className="min-h-screen flex flex-col items-center text-center">
          <h2 className="text-5xl font-extrabold">Welcome to My Portfolio</h2>
          <p className="mt-4 text-lg max-w-2xl">
            I am a web developer passionate about building modern, scalable applications.
            Check out my projects below!
          </p>
        </section>

        <section ref={projectsRef} className="min-h-screen p-10 bg-gray-100 text-gray-900 text-center">
          <h2 className="text-4xl font-bold">Projects</h2>
          <p className="mt-4 text-lg">Here are some of my best projects.</p>
        </section>

        <section ref={aboutRef} className="min-h-screen p-10 bg-gray-200 text-gray-900 text-center">
          <h2 className="text-4xl font-bold">About Me</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            I am Kaan Kaya, a fourth-year Computer Science student at York University, Toronto.
            My expertise includes object-oriented programming, database management, and web development.
          </p>
        </section>

        <section ref={contactRef} className="min-h-screen p-10 bg-gray-300 text-gray-900 text-center">
          <h2 className="text-4xl font-bold">Contact Me</h2>
          <p className="mt-4 text-lg">Feel free to reach out via email or social media.</p>
        </section>
      </main>
    </div>
  );
}
