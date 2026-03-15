"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlayerPage = pathname?.startsWith("/learn");
  const isAdminPage = pathname?.startsWith("/admin");
  const hideNavigation = isPlayerPage || isAdminPage;

  return (
    <>
      {!hideNavigation && <Navbar />}
      <main className={`flex-grow ${!hideNavigation ? "pt-20" : ""}`}> 
        {children}
      </main>
      {!hideNavigation && <Footer />}
    </>
  );
}
