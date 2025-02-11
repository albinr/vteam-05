"use client";

import React, { useEffect, useState } from "react";
// import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import "./Header.css";
import Cookies from "js-cookie";
import Button from "../Button";

export default function Header({}) {
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
                <h1 className="header-title">User-web</h1>
            </div>
            <div className="header-right">
                {session ? (
                    <div className="user-info">
                        <Button
                        href="/account"
                        label={"Account"}
                    />
                    <Button
                        href="/history"
                        label={"History"}
                    />
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
