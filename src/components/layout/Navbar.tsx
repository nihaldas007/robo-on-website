"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Cpu, User as UserIcon, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role } = useAuth();
  const ADMIN_EMAILS = ["admin@roboonbd.com", "roboonbd@gmail.com"];

  const links = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Courses", href: "/courses" },
    { name: "Projects", href: "/projects" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
      <div className="max-w-7xl w-full glass border border-white/10 rounded-2xl md:rounded-full px-6 py-3 flex items-center justify-between pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300">
        
        {/* Logo Section */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors border border-primary/20">
              <img 
                src="/robo-on-website/logo.png" 
                alt="RoboON Logo" 
                className="h-8 w-auto object-contain brightness-0 invert opacity-90 transition-transform group-hover:scale-110" 
              />
            </div>
          </Link>
        </div>
        
        {/* Navigation & User Area (Right Aligned) */}
        <div className="flex items-center gap-6">
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-white/5 active:scale-95"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* User Interaction Area */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-black/40 border border-white/5 rounded-full p-1 pl-4 gap-3">
              {user ? (
                <>
                  <div className="flex flex-col items-end -space-y-0.5">
                    <span className="text-sm font-bold text-white max-w-[120px] truncate">
                      {role === 'admin' ? "System Admin" : (user.displayName || user.email?.split('@')[0])}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={role === 'admin' || role === 'moderator' ? "/admin" : "/dashboard"}
                      className="w-10 h-10 flex items-center justify-center bg-primary text-black rounded-full hover:bg-white transition-all shadow-[0_0_15px_rgba(60,179,150,0.4)] hover:shadow-primary active:scale-90"
                      title="Dashboard"
                    >
                      <UserIcon size={20} strokeWidth={2.5} />
                    </Link>
                    <button
                      onClick={() => signOut(auth)}
                      className="w-10 h-10 flex items-center justify-center bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all active:scale-95"
                      title="Sign Out"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium pr-2">Guest Mode</span>
                  <Link
                    href="/login"
                    className="bg-primary text-black px-6 py-2 rounded-full text-sm font-bold transition-all shadow-[0_0_20px_rgba(60,179,150,0.3)] hover:shadow-primary hover:bg-white active:scale-95"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="lg:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

        {/* Mobile menu Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute top-20 left-4 right-4 lg:hidden bg-black/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl pointer-events-auto max-h-[80vh] overflow-y-auto custom-scrollbar z-50 transform-gpu"
        >
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-primary p-4 rounded-2xl bg-white/5 border border-transparent hover:border-primary/20 transition-all font-semibold flex items-center justify-between group"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Cpu size={14} className="text-primary" />
                </div>
              </Link>
            ))}
            
            <div className="mt-4 pt-6 border-t border-white/10">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="px-3 mb-2 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
                       { (user.displayName || user.email || "U")[0].toUpperCase() }
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-primary font-bold tracking-widest">Signed in as</p>
                      <p className="text-base font-bold text-white truncate max-w-[200px]">{user.displayName || user.email}</p>
                    </div>
                  </div>
                  <Link
                    href={role === 'admin' || role === 'moderator' ? "/admin" : "/dashboard"}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-black rounded-2xl font-bold hover:bg-white transition-colors shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserIcon size={20} /> Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut(auth);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center w-full py-4 bg-primary text-black rounded-2xl font-bold shadow-[0_0_20px_rgba(60,179,150,0.3)] hover:bg-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
