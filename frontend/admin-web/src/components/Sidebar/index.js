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
                    <Link href="/users" className={`sidebar-link ${pathname.includes("/users") ? "active" : ""}`} onClick={handleLinkClick}>
                        Users
                    </Link>
                    <Link href="/bikes" className={`sidebar-link ${pathname.includes("/bikes") ? "active" : ""}`} onClick={handleLinkClick}>
                        Bikes
                    </Link>
                    <Link href="/zones" className={`sidebar-link ${pathname.includes("/zones") ? "active" : ""}`} onClick={handleLinkClick}>
                        Zones
                    </Link>
                </nav>
            </aside>

            {isOpen && <div className="overlay" onClick={onToggleSidebar}></div>}
        </>
    );
}
