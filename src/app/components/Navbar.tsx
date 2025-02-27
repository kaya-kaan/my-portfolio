import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white text-gray-900 shadow-md p-4 w-full fixed top-0 flex items-center justify-between">
      <h1 className="text-2xl font-bold">My Portfolio</h1>
      <ul className="flex space-x-6 text-lg">
        <li>
          <Link href="/" className="hover:text-blue-500 transition">Home</Link>
        </li>
        <li>
          <Link href="/projects" className="hover:text-blue-500 transition">Projects</Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-blue-500 transition">About</Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-blue-500 transition">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
