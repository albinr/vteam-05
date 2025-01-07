"use client";

import React, { useEffect, useState } from "react";
// import LoginButton from "@/components/LoginButton";
// import LogoutButton from "@/components/LogoutButton";
import { FaLocationDot, FaSquareArrowUpRight, FaBell } from "react-icons/fa6";

import "./Navigation.css";

export default function Navigation() {

    const [session, setSession] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setSession({ user: JSON.parse(user) });
        } else {
            setSession(null);
        }
    }, []);


    return (
        <nav className="bottom-nav">
            <ul>
                <li>
                    <a href="/map"><FaLocationDot /></a>
                </li>
                <li>
                    <a href="/trip"><FaSquareArrowUpRight /></a>
                </li>
                <li>
                    <a href="/history"><FaBell /></a>
                </li>
            </ul>
        </nav>
    );
}
