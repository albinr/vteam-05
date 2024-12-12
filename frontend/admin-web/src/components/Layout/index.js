"use client";

import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

import "./Layout.css";

export default function Layout({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        {session ? <Sidebar /> : null}
        <div className={`layout-content ${session ? "" : "full-width"}`}>
          <main className="layout-main">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
