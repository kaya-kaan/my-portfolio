"use client";

import { RefObject } from 'react';
import Image from 'next/image';

interface NavbarProps {
  scrollToSection: (ref: RefObject<HTMLDivElement>) => void;
  homeRef: RefObject<HTMLDivElement>;
  projectsRef: RefObject<HTMLDivElement>;
  aboutRef: RefObject<HTMLDivElement>;
  contactRef: RefObject<HTMLDivElement>;
}

export default function Navbar({ scrollToSection, homeRef, projectsRef, aboutRef, contactRef }: NavbarProps) {
  return (
    <nav className="bg-gradient-to-r from-blue-200 to-blue-400 text-gray-900 p-4 w-full fixed top-0 flex justify-between items-center transition-transform duration-500 ease-in-out">
      
      {/* Logo + Name Container */}
      <div className="flex items-center gap-x-2">
        <Image src="/logo.png" alt="Logo" width={30} height={30} className="rounded" />
        <h1 className="text-2xl font-bold">Kaan Kaya</h1>
      </div>

      {/* Nav Links */}
      <ul className="flex space-x-6 text-lg">
        <li><button onClick={() => scrollToSection(homeRef)} className="hover:text-blue-500">Home</button></li>
        <li><button onClick={() => scrollToSection(projectsRef)} className="hover:text-blue-500">Projects</button></li>
        <li><button onClick={() => scrollToSection(aboutRef)} className="hover:text-blue-500">About</button></li>
        <li><button onClick={() => scrollToSection(contactRef)} className="hover:text-blue-500">Contact</button></li>
      </ul>
    </nav>
  );
}
