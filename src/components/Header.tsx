"use client";

import { TbTargetArrow } from "react-icons/tb";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  const handleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-5 border-b border-white/10 bg-white/10 backdrop-blur-md text-white">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <TbTargetArrow size={28} className="text-amber-400" />
            <h1 className="text-lg font-semibold">Task Tracker</h1>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex gap-6 text-sm items-center">
          
          {/* Protected Links */}
          {isAuthenticated && (
            <>
              <Link href="/myplans">Dashboard</Link>
              <Link href="/analysis">Analysis</Link>
              <Link href="/settings">Settings</Link>
            </>
          )}

          {/* Auth Buttons */}
          {isLoading ? null : !isAuthenticated ? (
            <button
              onClick={handleLogin}
              className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg text-black font-medium transition"
            >
              Login with Google
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {user?.image && (
                <Image
                  src={user.image}
                  alt="profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium transition"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;


