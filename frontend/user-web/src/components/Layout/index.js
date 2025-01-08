"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import "./Layout.css";

export default function Layout({ children }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="layout">
            <Header/>
            <div className="layout-body">
                <main className="layout-main">{children}</main>
            </div>
            <Footer />
        </div>
    );
}
