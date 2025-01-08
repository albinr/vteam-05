"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Loader from "@/components/Loader";

export default function LoginSuccess() {
    const router = new useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        let token = searchParams.get("token");
        // Get token from query and clean it up afterwards
        if (token) {
            // router.replace(router.pathname, undefined, { shallow: true });
            console.log("Setting token in local storage: ", token);
            localStorage.setItem("token", token);

            Cookies.set("token", token, { expires: 30 });

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            localStorage.setItem("user", JSON.stringify(JSON.parse(window.atob(base64))));
    
            Cookies.set("user", JSON.stringify(JSON.parse(window.atob(base64)), { expires: 30 }));

            localStorage.removeItem("token");
            localStorage.removeItem("user");


            window.location.href = "/";
        }

        if (!token) {
            console.log("No token found");
            window.location.href = "/auth/signin";
        }
    }, [searchParams, router]);


    return (
        <div className="login-success-container">
            <Loader message="Signing in..."/>
        </div>
    );
}