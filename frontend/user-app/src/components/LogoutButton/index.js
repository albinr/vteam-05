"use client";

import Button from "@/components/Button";
import { useRouter} from "next/navigation";


const LogoutButton = ({ label = "Sign Out", className = "" }) => {
    const router = new useRouter();

    const handleLogout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
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
