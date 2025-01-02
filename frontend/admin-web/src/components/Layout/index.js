"use client";

import { useState } from "react";
// import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import "./Layout.css";

export default function Layout({ children }) {
    // const { data: session, status } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // if (status === "loading") {
    //     return <Loader />;
    // }

    // if (!session) {
    //     return (
    //         <div className="layout">
    //             <Header />
    //             <div className="layout-body">
    //                 <div className="layout-content">
    //                     <main className="layout-main">{children}</main>
    //                 </div>
    //             </div>
    //             <Footer />
    //         </div>
    //     )
    // }

    return (
        <div className="layout">
            <Header onToggleSidebar={toggleSidebar} />
            <div className="layout-body">
                <Sidebar isOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
                <div className={`layout-content`}>
                    <main className="layout-main">{children}</main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
