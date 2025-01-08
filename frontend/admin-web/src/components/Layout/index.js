"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // For cookie management
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import "./Layout.css";

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const token = Cookies.get("token");
        const user = Cookies.get("user");
        setIsAuthenticated(!!token && !!user);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        // Show a loader while checking authentication
        return <Loader />;
    }

    return (
        <div className="layout">
            <Header onToggleSidebar={toggleSidebar} />
            <div className="layout-body">
                {isAuthenticated && (
                    <Sidebar isOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
                )}
                <div className={`layout-content ${isAuthenticated ? "authenticated" : ""}`}>
                    <main className="layout-main">{children}</main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
