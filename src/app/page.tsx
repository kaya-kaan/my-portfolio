"use client";

import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useRef, useState, useEffect } from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Home() {
  const homeRef = useRef<HTMLDivElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false); // Hide navbar when scrolling down
      } else {
        setShowNavbar(true); // Show navbar when scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus('Message sent!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('Failed to send message.');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 text-gray-900 flex flex-col items-center justify-center">
      <Head>
        <title>My Portfolio</title>
        <meta name="description" content="A portfolio showcasing my projects and skills." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`fixed top-0 w-full transition-opacity duration-500 ease-in-out ${showNavbar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Navbar scrollToSection={scrollToSection} homeRef={homeRef} projectsRef={projectsRef} aboutRef={aboutRef} contactRef={contactRef} />
      </div>

      <main className="mt-20 p-6 w-full max-w-5xl">
        <section ref={homeRef} className="min-h-screen flex flex-col items-center text-center">
          <h2 className="bg-gradient-to-r from-blue-500 to-orange-500 text-transparent bg-clip-text text-5xl font-extrabold">Welcome to My Portfolio</h2>
          <p className="mt-4 text-lg max-w-2xl">
            I am a web developer passionate about building modern, scalable applications.
            Check out my projects below!
          </p>
        </section>

        <section ref={projectsRef} className="min-h-screen p-10 bg-blue-100 text-gray-900 text-center">
          <h2 className="text-4xl font-bold">Projects</h2>
          <p className="mt-4 text-lg">Here are some of my best projects.</p>
        </section>

        <section ref={aboutRef} className="min-h-screen p-10 text-gray-900 text-center">
          <h2 className="text-4xl font-bold">About Me</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            I am Kaan Kaya, a fourth-year Computer Science student at York University, Toronto.
            My expertise includes object-oriented programming, database management, and web development.
          </p>
          <h3 className="text-2xl font-bold mt-6">View My Resume</h3>
          <div className="flex justify-center w-full">
          <iframe 
            src="/resume v2.1.pdf" 
            className="w-full max-w-xl h-[90vh] mt-4 rounded-lg"
            title="Resume"
          ></iframe>
          </div>
        </section>

        <section ref={contactRef} className="min-h-screen p-10 text-gray-900 text-center">
          <h2 className="text-4xl font-bold">Contact Me</h2>
          <p className="mt-4 text-lg">Feel free to reach out via email or social media.</p>
          
          <div className="mt-6 flex flex-col items-center space-y-4">
            <a href="mailto:kaankaya956@gmail.com" className="text-lg font-semibold text-blue-800 hover:underline">kaankaya956@gmail.com</a>
            <a href="tel:+16472812725" className="text-lg font-semibold text-blue-800 hover:underline">+1 (647) 281-2725</a>
            
            <div className="flex space-x-6 mt-4">
              <a href="https://github.com/kaya-kaan" target="_blank" rel="noopener noreferrer" className="flex items-center text-lg font-semibold text-gray-900 hover:text-gray-700">
                <FaGithub className="mr-2" size={24} /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/kaankaya7/" target="_blank" rel="noopener noreferrer" className="flex items-center text-lg font-semibold text-gray-900 hover:text-gray-700">
                <FaLinkedin className="mr-2" size={24} /> LinkedIn
              </a>
            </div>
          </div>
          
<form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Send a Message</h3>
<input
              type="text"
              placeholder="Your Name"
              className="w-full p-2 border rounded mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-2 border rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Your Message"
              className="w-full p-2 border rounded mb-4"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
              Send
            </button>
            {status && <p className="mt-2 text-center">{status}</p>}
          </form>
        </section>
      </main>
    </div>
  );
}
