"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // For cookie management
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import "./Layout.css";
import FlashMessage from "../FlashMessage";

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [flashMessages, setFlashMessages] = useState([]); // Queue for flash messages

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const addFlashMessage = (message, type = "info", duration = 3000) => {
        const id = Date.now(); // Unique ID for each message
        setFlashMessages((prevMessages) => [
            ...prevMessages,
            { id, message, type, duration },
        ]);
    
        // Remove message after `duration + animation duration`
        const totalDuration = duration + 300; // 300ms for roll-up animation
        setTimeout(() => {
            setFlashMessages((prevMessages) =>
                prevMessages.filter((msg) => msg.id !== id)
            );
        }, totalDuration);
    };
    

    useEffect(() => {
        const token = Cookies.get("token");
        const user = Cookies.get("user");
        setIsAuthenticated(!!token && !!user);
        setIsLoading(false);

        // Example flash messages
        if (!token || !user) {
            addFlashMessage("Please log in to access all features", "warning");
        } else {
            addFlashMessage("Welcome back!", "success");
        }
    }, []);

    if (isLoading) {
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
                    {/* Render all flash messages */}
                    {flashMessages.map((msg) => (
                        <FlashMessage
                            key={msg.id}
                            message={msg.message}
                            type={msg.type}
                            duration={msg.duration}
                            onDismiss={() =>
                                setFlashMessages((prevMessages) =>
                                    prevMessages.filter((m) => m.id !== msg.id)
                                )
                            }
                        />
                    ))}
                    <main className="layout-main">{children}</main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
