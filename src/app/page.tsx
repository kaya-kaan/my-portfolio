import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Head>
        <title>My Portfolio</title>
        <meta name="description" content="A portfolio showcasing my projects and skills." />
      </Head>

      <nav className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">My Portfolio</h1>
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/projects">Projects</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </nav>

      <main className="p-10 text-center">
        <h2 className="text-4xl font-bold">Welcome to My Portfolio</h2>
        <p className="mt-4 text-lg">I am a web developer passionate about building modern, scalable applications.</p>
        <Link href="/projects">
          <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg">View My Work</button>
        </Link>
      </main>
    </div>
  );
}

export function Projects() {
  return (
    <div className="p-10 text-center">
      <h2 className="text-4xl font-bold">Projects</h2>
      <p className="mt-4 text-lg">Here are some of my best projects.</p>
    </div>
  );
}

export function About() {
  return (
    <div className="p-10 text-center">
      <h2 className="text-4xl font-bold">About Me</h2>
      <p className="mt-4 text-lg">I am a software developer with experience in modern web technologies.</p>
    </div>
  );
}

export function Contact() {
  return (
    <div className="p-10 text-center">
      <h2 className="text-4xl font-bold">Contact Me</h2>
      <p className="mt-4 text-lg">Feel free to reach out via email or social media.</p>
    </div>
  );
}
