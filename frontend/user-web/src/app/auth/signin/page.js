"use client";

import { useRouter } from "next/navigation";
import LoginButton from "@/components/LoginButton";
import "./Signin.css";


export default function SignInPage() {
    const router = useRouter();

    return (
        <div className="signin-container">
            <h1>Sign In</h1>
            <p>Choose a provider to sign in:</p>
            <LoginButton provider="google" label="Sign in with Google" />
        </div>
    );
}
