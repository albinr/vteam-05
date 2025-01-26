"use client";

import { useState, useEffect, useContext, createContext } from "react";
import Cookies from "js-cookie";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import "./Layout.css";
import FlashMessage from "../FlashMessage";

const FlashMessageContext = createContext();

export const useFlashMessage = () => useContext(FlashMessageContext);

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [flashMessages, setFlashMessages] = useState([]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const addFlashMessage = (message, type = "info", duration = 3000) => {
        const id = Date.now();
        setFlashMessages((prevMessages) => [
            ...prevMessages,
            { id, message, type, duration },
        ]);

        const totalDuration = duration + 300;
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
        <FlashMessageContext.Provider value={addFlashMessage}>
            <div className="layout">
                <Header onToggleSidebar={toggleSidebar} />
                <div className="layout-body">
                    {isAuthenticated && (
                        <Sidebar isOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
                    )}
                    <div className={`layout-content ${isAuthenticated ? "authenticated" : ""}`}>
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
        </FlashMessageContext.Provider>
    );
}
