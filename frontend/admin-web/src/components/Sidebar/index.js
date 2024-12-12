"use client";

import Link from "next/link";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onToggleSidebar }) {
    const handleLinkClick = () => {
        if (onToggleSidebar) {
            onToggleSidebar(); // Close the sidebar
        }
    };

    return (
        <>
            <aside className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-header">Admin Menu</div>
                <nav className="sidebar-nav">
                    <Link href="/" className="sidebar-link" onClick={handleLinkClick}>
                        Dashboard
                    </Link>
                    <Link href="/users" className="sidebar-link" onClick={handleLinkClick}>
                        Users
                    </Link>
                    <Link href="/bikes" className="sidebar-link" onClick={handleLinkClick}>
                        Bikes
                    </Link>
                    <Link href="/stations-zones" className="sidebar-link" onClick={handleLinkClick}>
                        Stations and Zones
                    </Link>
                </nav>
            </aside>

            {/* Overlay */}
            {isOpen && <div className="overlay" onClick={onToggleSidebar}></div>}
        </>
    );
}
