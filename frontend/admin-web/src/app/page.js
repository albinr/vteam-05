"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Map from "@/components/Map";
import Loader from "@/components/Loader";

const center = [59.334591, 18.06324];

export default function Home() {
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
            <h1>Dashboard</h1>
            <p>Welcome, {session.user?.name || "User"}!</p>
            <p>Your email: {session.user?.email || "Not available"}</p>
            <p>Here you can view scooter locations and manage the platform.</p>
            <Map posix={center} />
        </div>
    );
}
