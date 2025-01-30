"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Sidebar.css";
import { FaHome, FaMap, FaUsers, FaBicycle, FaMapMarkerAlt } from "react-icons/fa";


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
                        <FaHome className="icon" /> Dashboard
                    </Link>
                    <Link href="/map" className={`sidebar-link ${pathname.includes("/map") ? "active" : ""}`} onClick={handleLinkClick}>
                        <FaMap className="icon" /> Map
                    </Link>
                    <Link href="/users" className={`sidebar-link ${pathname.includes("/users") ? "active" : ""}`} onClick={handleLinkClick}>
                        <FaUsers className="icon" /> Users
                    </Link>
                    <Link href="/bikes" className={`sidebar-link ${pathname.includes("/bikes") ? "active" : ""}`} onClick={handleLinkClick}>
                        <FaBicycle className="icon" /> Bikes
                    </Link>
                    <Link href="/zones" className={`sidebar-link ${pathname.includes("/zones") ? "active" : ""}`} onClick={handleLinkClick}>
                        <FaMapMarkerAlt className="icon" /> Zones
                    </Link>
                </nav>
            </aside>

            {isOpen && <div className="overlay" onClick={onToggleSidebar}></div>}
        </>
    );
}
