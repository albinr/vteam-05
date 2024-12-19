"use client";

import React from "react";
import { useSession } from "next-auth/react";
import LoginButton from "@/components/LoginButton"; // Ensure the path is correct
import LogoutButton from "@/components/LogoutButton"; // Ensure the path is correct
import "./Header.css";

export default function Header({ onToggleSidebar }) {
    const { data: session } = useSession();

    return (
        <header className="header">
            <div className="header-left">
                {/* Hamburger Menu */}
                <button className="hamburger-menu" onClick={onToggleSidebar}>
                    ☰
                </button>
                <h1 className="header-title">Admin Panel</h1>
            </div>
            <div className="header-right">
                {session ? (
                    <div className="user-info">
                        {/* Display User's Profile Image */}
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
                    <LoginButton
                        provider="google"
                        label="Sign In"
                        className="header-login"
                    />
                )}
            </div>
        </header>
    );
}
