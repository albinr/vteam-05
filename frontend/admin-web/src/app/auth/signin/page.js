"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    return (
        <div className="signin-container">
            <h1>Sign In</h1>
            <p>Choose a provider to sign in:</p>
            <button onClick={() => signIn("google")}>Sign in with Google</button>
            <button onClick={() => signIn("github")}>Sign in with GitHub</button>
        </div>
    );
}
