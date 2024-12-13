"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

const mockMarkers = [
    { id: 1, type: "bike", position: [62.1, 13.1], battery: 80, status: "available" },
    { id: 2, type: "bike", position: [62.2, 13.1], battery: 80, status: "available" },
    { id: 3, type: "bike", position: [62.3, 13.1], battery: 80, status: "available" },
];

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

    const Map = useMemo(() => dynamic(
        () => import('@/components/Map/'),
        {
            loading: () => <Loader />,
            ssr: false
        }
    ), [])
    // const center = [57.534591, 18.06324];

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session.user?.name || "User"}!</p>
            <p>Your email: {session.user?.email || "Not available"}</p>
            <p>Here you can view scooter locations and manage the platform.</p>
            <Map posix={[62.0, 13.0]} zoom={6} markers={mockMarkers} />
        </div>
    );
}
