"use client";

import { useState, useEffect, useMemo } from "react";
import withAuth from "../hoc/withAuth";
import dynamic from "next/dynamic";
import Table from "@/components/Table";
import Loader from "@/components/Loader";
import { fetchBikes } from "./api";

// Table columns for e-bike management
const ebikeColumns = [
    { header: "ID", accessor: "bike_id" },
    { header: "Status", accessor: "status" },
    { header: "Longitude", accessor: "ST_X(position)" },
    { header: "Latitude", accessor: "ST_Y(position)" },
    { header: "Battery", accessor: "battery_level" },
];

const parkingStations = [
    { position: { lat: 59.3310, lng: 18.0670 }, label: "Parking Station A", info: { id: "stationA", status: "3 bikes parked" } },
];

const chargingStations = [
    { position: { lat: 59.3280, lng: 18.0700 }, label: "Charging Station 1", info: { id: "charge1", status: "2 bikes charging" } },
];

const allowedZoneCircle = [
    { center: { lat: 59.3293, lng: 18.0686 }, radius: 16000, options: { fillColor: "#00ff00", fillOpacity: 0.1, strokeColor: "#00ff00", strokeWeight: 1 } },
];

const Bikes = ({ session }) => {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch bike data on page load
    useEffect(() => {
        const loadBikes = async () => {
            try {
                const data = await fetchBikes();
                setBikes(data);
            } catch (err) {
                console.error("Failed to fetch bikes:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadBikes();
    }, []);

    const Gmap = useMemo(
        () =>
            dynamic(() => import('@/components/Gmap'), {
                loading: () => <Loader />,
                ssr: false,
            }),
        []
    );

    const ebikeMarkers = bikes.map((bike) => ({
        position: { lat: bike["ST_Y(position)"], lng: bike["ST_X(position)"] },
        label: `Bike ${bike.bike_id}`,
    }));

    const handleRowClick = (row) => {
        console.log("Selected E-Bike:", row);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <h1>Bikes</h1>
            <p>Welcome, {session.user?.name || "User"}!</p>
            <p>Manage all bikes on the platform from this page.</p>
            {error && <p className="error">{error}</p>}

            <Gmap
                center={{ lat: 59.3293, lng: 18.0686 }}
                zoom={6}
                markers={[...ebikeMarkers, ...parkingStations, ...chargingStations]}
                circles={allowedZoneCircle}
                disableDefaultUI={false}
            />

            <Table
                columns={ebikeColumns}
                data={bikes}
                onRowClick={handleRowClick}
            />
        </div>
    );
};

export default withAuth(Bikes);
