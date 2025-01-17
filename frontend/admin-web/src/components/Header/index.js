"use client";

import React, { useEffect, useState } from "react";
// import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import "./Header.css";
import Cookies from "js-cookie";
import Button from "../Button";

export default function Header({ onToggleSidebar }) {
    const [session, setSession] = useState(null);

    useEffect(() => {
        const userCookie = Cookies.get("user");

        if (userCookie) {
            try {
                setSession({ user: JSON.parse(userCookie) });
            } catch (error) {
                console.error("Failed to parse user cookie:", error);
                setSession(null);
            }
        } else {
            setSession(null);
        }
    }, []);

    return (
        <header className="header">
            <div className="header-left">
                {session && (
                    <button
                        className="hamburger-menu"
                        onClick={onToggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        ☰
                    </button>
                )}
                <h1 className="header-title">Admin Panel</h1>
            </div>
            <div className="header-right">
                {session ? (
                    <div className="user-info">
                        <p>{session.user?.name || "User"}</p>
                        {session.user?.image && (
                            <img
                                src={session.user.image}
                                alt="User Profile"
                                className="user-profile-image"
                            />
                        )}
                        <LogoutButton className="header-logout" />
                    </div>
                ) : (
                    <Button
                        href="/auth/signin"
                        label={"Sign in"}
                    />
                )}
            </div>
        </header>
    );
}
