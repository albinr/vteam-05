"use client";

import LoginButton from "@/components/LoginButton";
import "./Signin.css";


export default function SignInPage() {

    return (
        <div className="signin-container">
            <h1>Sign In</h1>
            <LoginButton provider="google" label="Sign in with Google" className="login-button"/>
        </div>
    );
}
