import Head from 'next/head';
import Link from 'next/link';
import Navbar from './/components/Navbar';


export default function Home() {
  return (
    <div>
      <Head>
        <title>Hello I'm Kaan Kaya, this is my Portfolio.</title>
        <meta name="description" content="A portfolio showcasing my projects and skills." />
      </Head>

      <Navbar />

      <main className="mt-16 flex flex-col items-center text-center p-6">

        <h2 className="text-5xl font-extrabold">Welcome to My Portfolio</h2>
        <p>
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
