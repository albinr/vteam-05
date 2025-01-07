"use client";

// import { signIn } from "next-auth/react";
import Button from "@/components/Button";

const LoginButton = ({ provider, label, className = "" }) => {
    // const handleLogin = () => {
    //     signIn(provider);
    // };

    return (
        <Button
            label={label}
            // onClick={handleLogin}
            href={`${process.env.NEXT_PUBLIC_API_AUTH_URL}/admin-web/${provider}`}
            // onClick={`${process.env.NEXT_PUBLIC_API_AUTH_URL}/admin-web/${provider}`}
            className={`login-button ${className}`}
        />
    );
};

export default LoginButton;
