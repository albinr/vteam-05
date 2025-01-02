"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginButton from "@/components/LoginButton";


export default function LoginSuccess() {
    const router = new useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        let token = searchParams.get("token");
        // Get token from query and clean it up afterwards
        if (token) {
            router.replace(router.pathname, undefined, { shallow: true });
            console.log("Setting token in local storage: ", token);
            localStorage.setItem("token", token);

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            sessionStorage.setItem("user", JSON.stringify(JSON.parse(window.atob(base64))));

            router.push("/");
        }

        if (!token) {
            console.log("No token found");
            router.push("/auth/signin");
        }
    }, [searchParams, router]);


    return (
        <div className="login-success-container">
            <h1>Saving information</h1>
            <p>Redirecting...</p>
        </div>
    );
}
