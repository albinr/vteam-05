"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LoginButton from "@/components/LoginButton";
import "./Signin.css";

export default function SignInPage() {
    const router = useRouter();

    useEffect(() => {
        // Check for the authentication token or user cookie
        const token = Cookies.get("token");
        const user = Cookies.get("user");

        if (token && user) {
            router.push("/");
        }
    }, [router]);

    return (
        <div className="signin-container">
            <h1>Sign In</h1>
            <p>Choose a provider to sign in:</p>
            <LoginButton provider="google" label="Sign in with Google" />
            {/* <LoginButton provider="github" label="Sign in with GitHub" /> */}
        </div>
    );
}
