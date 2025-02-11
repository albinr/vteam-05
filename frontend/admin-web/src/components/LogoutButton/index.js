"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const LogoutButton = ({ label = "Sign Out", className = "" }) => {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove("user");
        Cookies.remove("token");

        // router.push("/auth/signin");
        window.location.href = "/auth/signin";
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
