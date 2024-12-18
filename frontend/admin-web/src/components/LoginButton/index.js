"use client";

import { signIn } from "next-auth/react";
import Button from "@/components/Button";

const LoginButton = ({ provider, label, className = "" }) => {
    const handleLogin = () => {
        signIn(provider);
    };

    return (
        <Button
            label={label}
            onClick={handleLogin}
            className={`login-button ${className}`}
        />
    );
};

export default LoginButton;
