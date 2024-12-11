"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {
    const { data: session } = useSession();
    const router = useRouter();

    // Redirect authenticated users
    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>Sign In</h1>
            <p>Choose a provider to sign in:</p>

            <button
                style={{
                    padding: "10px 20px",
                    margin: "10px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#4285F4",
                    color: "white",
                    cursor: "pointer",
                }}
                onClick={() => signIn("google")}
            >
                Sign in with Google
            </button>

            <button
                style={{
                    padding: "10px 20px",
                    margin: "10px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#333",
                    color: "white",
                    cursor: "pointer",
                }}
                onClick={() => signIn("github")}
            >
                Sign in with GitHub
            </button>
        </div>
    );
}
