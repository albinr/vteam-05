"use client";

import React from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
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
                    <button
                        className="header-logout"
                        onClick={() => signOut()}
                    >
                        Sign Out
                    </button>
                ) : (
                    <button
                        className="header-login"
                        onClick={() => signIn("google")}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </header>
    );
}
