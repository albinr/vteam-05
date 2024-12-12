"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Map from "@/components/Map";
import GoogleMapComponent from "@/components/Gmap";


export default function Dashboard() {
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

    // const center = [58.0, 15.0];

    const center = { lat: 59.3293, lng: 18.0686 }; // Center on Stockholm
    const markers = [
        { position: { lat: 59.3293, lng: 18.0686 }, title: "Stockholm" },
        { position: { lat: 57.7089, lng: 11.9746 }, title: "Gothenburg" },
        { position: { lat: 55.605, lng: 13.0038 }, title: "Malmö" },
    ];

    const mapOptions = {
        disableDefaultUI: true, // Disable all default UI
        zoomControl: true, // Enable zoom control
    };

    const mapStyles = [
        {
            featureType: "poi", // Points of Interest
            stylers: [{ visibility: "off" }],
        },
        {
            featureType: "transit", // Transit Stations
            stylers: [{ visibility: "off" }],
        },
        {
            featureType: "road", // Hide road labels
            elementType: "labels",
            stylers: [{ visibility: "off" }],
        },
    ];

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session.user.name}!</p>
            <p>Your email: {session.user.email}</p>
            <p>Here you can view scooter locations and manage the platform.</p>
            {/* <Map posix={center} /> */}
            {/* <GoogleMapComponent
                center={center}
                zoom={6}
                markers={markers}
                options={mapOptions}
                styles={mapStyles}
            /> */}
        </div>
    );
}
