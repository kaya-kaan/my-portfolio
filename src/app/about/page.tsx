import Head from 'next/head';
import Navbar from '..//components/Navbar';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white flex flex-col items-center justify-center">
      
      <Navbar />

      <Head>
        <title>About Me - Kaan Kaya</title>
      </Head>

      <h2 className="text-5xl font-bold text-white-900 mt-16">About Me</h2>
      <p className="mt-4 text-lg max-w-2xl">
        I am Kaan Kaya, a fourth-year Computer Science student at York University, Toronto.
        My expertise includes object-oriented programming, database management, and web development.
      </p>

      <p className="mt-4 text-lg max-w-2xl">
        I am seeking a software developer internship to enhance my skills and contribute to an innovative team.
      </p>

      <h3 className="text-2xl font-bold mt-6">You can see my resume below and reach me from my email kaankaya956@gmail.com.</h3>
      <iframe
        src="/resume v2.1.pdf"
        className="w-full max-w-3xl h-96 mt-4 border rounded-lg"
      ></iframe>
    </div>
  );
}
