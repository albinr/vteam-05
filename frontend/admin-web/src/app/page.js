"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import withAuth from "../app/hoc/withAuth";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

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

const Home = ({ session }) => {
    if (!session) {
        return <Loader />;
    }

    const Gmap = dynamic(() => import('@/components/Gmap'), {
        loading: () => <Loader />,
        ssr: false,
    });

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session.user?.name || "User"}!</p>
            <p>Your email: {session.user?.email || "Not available"}</p>
            <p>Here you can view scooter locations and manage the platform.</p>
            <Gmap
                center={{ lat: 59.3293, lng: 18.0686 }}
                zoom={14}
                markers={[...ebikeMarkers, ...parkingStations, ...chargingStations]}
                circles={allowedZoneCircle}
                disableDefaultUI={false}
            />
        </div>
    );
};

export default withAuth(Home);