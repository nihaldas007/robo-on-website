"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Wrench, Users, LogOut, Cpu, Menu, X } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, role } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Manage Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Manage Projects", href: "/admin/projects", icon: Wrench },
    { label: "Enrollments", href: "/admin/enrollments", icon: BookOpen },
    { label: "Users & Roles", href: "/admin/users", icon: Users },
  ];

  return (
    <ProtectedRoute requireAdmin={true}>
    <div className="flex bg-[#0a0414] min-h-screen font-sans text-gray-200">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-black/60 border-r border-white/5 flex flex-col z-[100] backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-primary/20 rounded-lg text-primary">
              <Cpu size={24} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white group-hover:text-primary transition-colors">
              Robo<span className="text-primary">Admin</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive 
                    ? "bg-primary/20 text-primary border border-primary/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-primary" : "text-gray-500"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => {
              import("@/lib/firebase").then(({ auth }) => {
                import("firebase/auth").then(({ signOut }) => signOut(auth));
              });
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative w-full">
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full -z-10 pointer-events-none transform-gpu" style={{ background: 'radial-gradient(circle, rgba(41,42,58,0.2) 0%, rgba(41,42,58,0) 70%)' }} />
        
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-black/40 backdrop-blur-md sticky top-0 z-[80]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-white truncate max-w-[150px] sm:max-w-none">
              {navItems.find(item => item.href === pathname)?.label || "Admin Panel"}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{userData?.fullName || "Admin User"}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(22,163,74,0.2)]">
              {(userData?.fullName || "Admin")[0]}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 flex-1 w-full max-w-[100vw] overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
