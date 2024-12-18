"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginButton from "@/components/LoginButton";
import "./Signin.css";


export default function SignInPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    return (
        <div className="signin-container">
            <h1>Sign In</h1>
            <p>Choose a provider to sign in:</p>
            <LoginButton provider="google" label="Sign in with Google" />
            <LoginButton provider="github" label="Sign in with GitHub" />
        </div>
    );
}
