"use client";

import React from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import "./Header.css";

export default function Header({ onToggleSidebar }) {
    const { data: session } = useSession();

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="header-title">Ebike-rental</h1>
            </div>
            <nav className="header-nav">
                    <Link href="/" className="header-link">
                        Home
                    </Link>
                    <Link href="/account" className="header-link">
                        Account
                    </Link>
                    <Link href="/history" className="header-link">
                        History
                    </Link>
                </nav>
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
