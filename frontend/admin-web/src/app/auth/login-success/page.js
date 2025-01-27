"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Loader from "@/components/Loader";

export default function LoginSuccess() {
    const searchParams = useSearchParams();

    useEffect(() => {
        let token = searchParams.get("token");
        // Get token from query and clean it up afterwards
        if (token) {
            console.log("Setting token in local storage: ", token);

            Cookies.set("token", token, { expires: 30 });
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');    
            Cookies.set("user", JSON.stringify(JSON.parse(window.atob(base64)), { expires: 30 }));

            window.location.href = "/";
        }

        if (!token) {
            console.log("No token found");
            window.location.href = "/auth/signin";
        }
    }, [searchParams]);


    return (
        <div className="login-success-container">
            <Loader message="Signing in..."/>
        </div>
    );
}