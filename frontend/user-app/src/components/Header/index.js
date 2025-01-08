"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import { FaLocationDot, FaSquareArrowUpRight, FaBell } from "react-icons/fa6";
import Cookies from "js-cookie";

// import "./Header.css";

export default function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user_id from cookies
        const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

        setUser(user);
        // Fetch user
        // const getUser = async () => {
        //     const user = await apiClient.get(`/users/${user_id}`);
        //     setUser(user);
        // };


        // getUser();
    }, []);



    return (
        <header>
            <div>
                <p>{user.id || ""}</p>
            </div>
        </header>
    );
}
