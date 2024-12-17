"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect} from "react";
import Loader from "@/components/Loader";

export default function History() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    if (status === "loading") {
        return <Loader />;
    }

    if (!session) {
        return null;
    }

    return (
        <div>
            <h1>History</h1>
            <p>Welcome, {session.user?.name || "User"}!</p>
            <p>Your email: {session.user?.email || "Not available"}</p>
            <p>Here you can view and manage your account.</p>
        </div>
    );
}
