'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { FiBell } from 'react-icons/fi';
import Cookies from 'js-cookie';
import constants from '@/config/constants';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const profileImage = Cookies.get('profileImage');
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  const handleLogout = async () => {
    // Clear cookies or tokens here
    const result = await fetch(`${await constants.API_URI()}logout`, {
      headers: {
        "Authorization": Cookies.get('token') as string
      }
    });
    const response = await result.json();
    console.log(result, response);
    if (result?.status && result?.status === 200) {
      Cookies.remove('token');
      alert(response?.message);
      router.push('/');
    } else {
      alert(response?.message);
    }
  };

  useEffect(() => {
    constants.API_URI(true).then(setApiUrl);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-4 py-3 border-b border-gray-300 sticky top-0 z-50"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {/* Left: Logo or Menu Icon */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <Link href="/" className="text-xl font-bold" style={{ color: 'var(--color)' }}>
          YouTube
        </Link>
      </div>

      {/* Left: Logo and nav links */}
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-4 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/subscriptions" className="hover:underline">Subscriptions</Link>
          <Link href="/you" className="hover:underline">You</Link>
        </nav>
      </div>

      {/* Center: Search Bar (hidden on small) */}
      <div className="flex-1 flex-row-reverse max-w-md mx-6 hidden md:block">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color)]"
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
          }}
        />
      </div>

      {/* Right: Notification, profile, logout */}
      <div className="flex items-center gap-4">
        <button className="hover:text-[var(--color)]">
          <FiBell size={20} />
        </button>

        {apiUrl && <img
          src={`${apiUrl}images/${profileImage}`} // You can use actual profile pic URL
          alt="Profile Pic"
          className="w-9 h-9 rounded-full border border-gray-300"
        />}

        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-[var(--color)] hover:text-white transition"
        >
          Logout
        </button>
      </div>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute top-0 left-0 w-3/4 max-w-xs h-full bg-white dark:bg-[#121212] p-6 space-y-6"
            style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="text-xl mb-4"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>

            {/* Search inside drawer */}
            <input
              type="text"
              placeholder="Search"
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color)]"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
              }}
            />

            {/* Navigation Links */}
            <nav className="flex flex-col gap-4 text-base">
              <Link className="hover:underline" href="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link className="hover:underline" href="/subscriptions" onClick={() => setMenuOpen(false)}>
                Subscriptions
              </Link>
              <Link className="hover:underline" href="/you" onClick={() => setMenuOpen(false)}>
                You
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
