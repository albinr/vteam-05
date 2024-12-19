"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onToggleSidebar }) {
    const pathname = usePathname();
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
                    <Link href="/" className={`sidebar-link ${pathname === "/" ? "active" : ""}`} onClick={handleLinkClick}>
                        Dashboard
                    </Link>
                    <Link href="/users" className={`sidebar-link ${pathname === "/users" ? "active" : ""}`} onClick={handleLinkClick}>
                        User management
                    </Link>
                    <Link href="/bikes" className={`sidebar-link ${pathname === "/bikes" ? "active" : ""}`} onClick={handleLinkClick}>
                        Bike management
                    </Link>
                    <Link href="/zones" className={`sidebar-link ${pathname === "/zones" ? "active" : ""}`} onClick={handleLinkClick}>
                        Stations and Zones
                    </Link>
                </nav>
            </aside>

            {isOpen && <div className="overlay" onClick={onToggleSidebar}></div>}
        </>
    );
}
