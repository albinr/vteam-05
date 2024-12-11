"use client";

import { useSession } from "next-auth/react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "./Layout.css";

export default function Layout({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="loading">Loading...</div>; // Optional loading indicator
  }

  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        {session ? <Sidebar /> : null} {/* Render Sidebar only if authenticated */}
        <div className={`layout-content ${session ? "" : "full-width"}`}>
          <main className="layout-main">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
