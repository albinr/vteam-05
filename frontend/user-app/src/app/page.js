"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import withAuth from "../app/hoc/withAuth";
import Loader from "@/components/Loader";

const Home = () => {
    // Redirect to /map page
    const router = useRouter();

    useEffect(() => {
        router.push("/map");
    }, []);


    return (
        <div>
            {/* <h1>Dashboard</h1> */}
            {/* <p>Welcome, {session.user?.name || "User"}!</p>
            <p>Your email: {session.user?.email || "Not available"}</p>
            <p>Here you can view scooter locations and manage the platform.</p> */}
            { /* <Gmap
                center={{ lat: 59.3293, lng: 18.0686 }}
                zoom={14}
                markers={[...ebikeMarkers, ...parkingStations, ...chargingStations]}
                circles={allowedZoneCircle}
                disableDefaultUI={false}
            /> */ }
            <Loader />
        </div>
    );
};

export default withAuth(Home);