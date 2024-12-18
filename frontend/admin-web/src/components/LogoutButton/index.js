"use client";

import { signOut } from "next-auth/react";
import Button from "@/components/Button";

const LogoutButton = ({ label = "Sign Out", className = "" }) => {
    const handleLogout = () => {
        signOut();
    };

    return (
        <Button
            label={label}
            onClick={handleLogout}
            className={`logout-button ${className}`}
        />
    );
};

export default LogoutButton;
