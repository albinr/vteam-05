"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import Cookies from "js-cookie";
import { apiClient } from "@/services/apiClient";

import "./Header.css";

export default function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch token from cookies
        const token = Cookies.get("token");

        if (!token) {
            return;
        }

        async function fetchUser() {
            const dbUser = await apiClient.get("/user/data", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (dbUser.message == "Access denied: Invalid token") {
                return;
            }

            setUser(dbUser);
        }

        fetchUser();
    }, []);


    return (
        <header>
            {
                user ?
                    <div id="header-right">
                        <img id="header-user-img" src={user.image} alt="Profile Picture" />
                    </div> :
                    <div id="header-right">
                        <img id="header-user-img" src={"."} alt="" />
                    </div>
            }
            <div id="header-left">
                <LogoutButton />
            </div>
        </header>
    );
}
