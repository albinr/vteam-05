"use client";

import Button from "@/components/Button";

const LoginButton = ({ provider, label, className = "" }) => {

    return (
        <Button
            label={label}
            href={`${process.env.NEXT_PUBLIC_API_AUTH_URL}/user-app/${provider}`}
            onClick={`${process.env.NEXT_PUBLIC_API_AUTH_URL}/admin-web/${provider}`}
            className={`login-button ${className}`}
        />
    );
};

export default LoginButton;
