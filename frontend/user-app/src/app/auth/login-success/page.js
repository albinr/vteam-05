"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
// import LoginButton from "@/components/LoginButton";


export default function LoginSuccess() {
    const router = new useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        let token = searchParams.get("token");
        // Get token from query and clean it up afterwards
        if (token) {
            // router.replace(router.pathname, undefined, { shallow: true });
            localStorage.setItem("token", token);
            Cookies.set("token", token, { expires: 30 });

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            localStorage.setItem("user", JSON.stringify(JSON.parse(window.atob(base64))));
            Cookies.set("user", JSON.stringify(JSON.parse(window.atob(base64)), { expires: 30 }));

            // router.push("/");
            window.location.href = "/";
        }

        if (!token) {
            console.log("No token found");
            // router.push("/auth/signin");
            window.location.href = "/auth/signin";
        }
    }, [searchParams, router]);


    return (
        <div className="login-success-container">
            <h1>Saving information</h1>
            <p>Redirecting...</p>
        </div>
    );
}
