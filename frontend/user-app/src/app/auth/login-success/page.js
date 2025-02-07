"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

function LoginSuccessComponent() {
    const searchParams = useSearchParams();

    useEffect(() => {
        let token = searchParams.get("token");
        // Get token from query and clean it up afterwards
        if (token) {
            localStorage.setItem("token", token);
            Cookies.set("token", token, { expires: 30 });

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            localStorage.setItem("user", JSON.stringify(JSON.parse(window.atob(base64))));
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
            <h1>Saving information</h1>
            <p>Redirecting...</p>
        </div>
    );
}

export default function LoginSuccess() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginSuccessComponent />
        </Suspense>
    );
}
