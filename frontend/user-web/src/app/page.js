"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

// const mockMarkers = [
//     { id: 1, type: "bike", position: [62.1, 13.1], battery: 80, status: "available" },
//     { id: 2, type: "bike", position: [62.2, 13.1], battery: 80, status: "available" },
//     { id: 3, type: "bike", position: [62.3, 13.1], battery: 80, status: "available" },
// ];

const ebikeMarkers = [
    {
        position: { lat: 59.3290, lng: 18.0680 },
        label: 'Bike #1',
        info: { id: 'bike1', status: 'Available', battery: 87 }
    },
    {
        position: { lat: 59.3300, lng: 18.0690 },
        label: 'Bike #2',
        info: { id: 'bike2', status: 'Rented', battery: 62 }
    },
];

const parkingStations = [
    {
        position: { lat: 59.3310, lng: 18.0670 },
        label: 'Parking Station A',
        info: { id: 'stationA', status: '3 bikes parked' }
    }
];

const chargingStations = [
    {
        position: { lat: 59.3280, lng: 18.0700 },
        label: 'Charging Station 1',
        info: { id: 'charge1', status: '2 bikes charging' }
    }
];

const allowedZoneCircle = [
    {
        center: { lat: 59.3293, lng: 18.0686 },
        radius: 1000,
        options: { fillColor: '#00ff00', fillOpacity: 0.1, strokeColor: '#00ff00', strokeWeight: 1 }
    }
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

    // const Map = useMemo(() => dynamic(
    //     () => import('@/components/Map/'),
    //     {
    //         loading: () => <Loader />,
    //         ssr: false
    //     }
    // ), [])

    const Gmap = dynamic(() => import('@/components/Gmap'), {
        ssr: false
    });
    // const center = [57.534591, 18.06324];

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session.user?.name || "User"}!</p>
            <p>Your email: {session.user?.email || "Not available"}</p>
            <p>Here you can view scooter locations and manage the platform.</p>
            {/* <Map posix={[62.0, 13.0]} zoom={6} markers={mockMarkers} /> */}
            <Gmap
                center={{ lat: 59.3293, lng: 18.0686 }}
                zoom={14}
                markers={[...ebikeMarkers, ...parkingStations, ...chargingStations]}
                circles={allowedZoneCircle}
                disableDefaultUI={false}
            />
        </div>
    );
}
