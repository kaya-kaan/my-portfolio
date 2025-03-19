import Link from 'next/link';
import { RefObject } from 'react';

interface NavbarProps {
  scrollToSection: (ref: RefObject<HTMLDivElement>) => void;
  homeRef: RefObject<HTMLDivElement>;
  projectsRef: RefObject<HTMLDivElement>;
  aboutRef: RefObject<HTMLDivElement>;
  contactRef: RefObject<HTMLDivElement>;
}

export default function Navbar({ scrollToSection, homeRef, projectsRef, aboutRef, contactRef }: NavbarProps) {
  return (
    <nav className="bg-white text-gray-900 shadow-md p-4 w-full fixed top-0 flex justify-between items-center">
      <h1 className="text-2xl font-bold">My Portfolio</h1>
      <ul className="flex space-x-6 text-lg">
        <li><button onClick={() => scrollToSection(homeRef)} className="hover:text-blue-500">Home</button></li>
        <li><button onClick={() => scrollToSection(projectsRef)} className="hover:text-blue-500">Projects</button></li>
        <li><button onClick={() => scrollToSection(aboutRef)} className="hover:text-blue-500">About</button></li>
        <li><button onClick={() => scrollToSection(contactRef)} className="hover:text-blue-500">Contact</button></li>
      </ul>
    </nav>
  );
}
