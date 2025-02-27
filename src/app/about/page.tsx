import Head from 'next/head';
import Navbar from '..//components/Navbar';

export default function About() {
  return (
    <div className="p-10 text-center bg-gray-100 min-h-screen">
      <Head>
        <title>About Me - Kaan Kaya</title>
      </Head>
      
      <Navbar />

      <h2 className="text-4xl font-bold text-gray-900 mt-16">About Me</h2>
      <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
        I am Kaan Kaya, a fourth-year Computer Science student at York University, Toronto.
        My expertise includes object-oriented programming, database management, and web development.
      </p>
      <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
        I am seeking a software developer internship to enhance my skills and contribute to an innovative team.
      </p>

      <h3 className="text-2xl font-bold mt-6">You can see my resume below and reach me from my email, kaankaya956@gmail.com.</h3>
      <iframe
        src="/resume v2.1.pdf"
        className="w-full max-w-3xl h-96 mt-4 border rounded-lg"
      ></iframe>
    </div>
  );
}
