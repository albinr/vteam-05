"use client";

import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import "./Layout.css";

export default function Layout({ children }) {
    return (
        <div className="layout">
            <div className="layout-body">
                <Header />
                <div className={`layout-content`}>
                    <main className="layout-main">{children}</main>
                </div>
                <Navigation />
            </div>
        </div>
    );
}
