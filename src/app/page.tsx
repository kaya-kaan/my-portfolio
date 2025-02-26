import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white flex flex-col items-center justify-center">
      <Head>
        <title>My Portfolio</title>
        <meta name="description" content="A portfolio showcasing my projects and skills." />
      </Head>

      <nav className="bg-white text-gray-900 shadow-md p-4 w-full fixed top-0 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        <ul className="flex space-x-6 text-lg">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/projects">Projects</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </nav>

      <main className="flex flex-col items-center text-center mt-24 p-6">
        <h2 className="text-5xl font-extrabold">Welcome to My Portfolio</h2>
        <p className="mt-4 text-lg max-w-2xl">
          I am a web developer passionate about building modern, scalable applications. 
          Check out my projects below!
        </p>
        <Link href="/projects">
          <button className="mt-6 px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
            View My Work
          </button>
        </Link>
      </main>
    </div>
  );
}

export function Projects() {
  return (
    <div className="p-10 text-center bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-gray-900">Projects</h2>
      <p className="mt-4 text-lg text-gray-700">Here are some of my best projects.</p>
    </div>
  );
}

export function About() {
  return (
    <div className="p-10 text-center bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-gray-900">About Me</h2>
      <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
        I am Kaan Kaya, a fourth-year Computer Science student at York University, Toronto. 
        My expertise includes object-oriented programming, database management, and web development. 
        I have worked on various projects such as a House Hunter application, an Event Tracking Calendar, and 
        a TicTacToe game using Android Studio.
      </p>
      <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
        I am seeking a software developer internship to enhance my skills and contribute to an innovative team. 
        My technical skills include Java, C++, SQL, MySQL, algorithms, data structures, and web development 
        using HTML, CSS, and JavaScript.
      </p>
      <h3 className="text-2xl font-bold mt-6">View My Resume</h3>
      <iframe 
        src="/resume v2.1.pdf" 
        className="w-full max-w-3xl h-96 mt-4 border rounded-lg"
      ></iframe>
    </div>
  );
}

export function Contact() {
  return (
    <div className="p-10 text-center bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-gray-900">Contact Me</h2>
      <p className="mt-4 text-lg text-gray-700">Feel free to reach out via email or social media.</p>
    </div>
  );
}
