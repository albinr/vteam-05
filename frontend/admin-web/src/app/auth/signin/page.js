"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
    return (
        <div className="signin-container">
            <h1>Sign In</h1>
            <p>Choose a provider to sign in:</p>
            <button onClick={() => signIn("google")}>Sign in with Google</button>
            <button onClick={() => signIn("github")}>Sign in with GitHub</button>
        </div>
    );
}
