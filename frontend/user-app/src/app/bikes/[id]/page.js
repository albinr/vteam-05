"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import withAuth from "../../hoc/withAuth";
import { fetchBikeById } from "../api";
import Loader from "@/components/Loader";

const BikeDetails = ({ session }) => {
    const { id } = useParams();
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const loadBike = async () => {
            try {
                const data = await fetchBikeById(id);
                setBike(data);
            } catch (err) {
                console.error("Error fetching bike details:", err.message);
                setError("Failed to fetch bike details.");
            } finally {
                setLoading(false);
            }
        };

        loadBike();
    }, [id]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <p className="error">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Bike Details</h1>
            <p>Welcome, {session.user?.name || "User"}!</p>
            {bike ? (
                <>
                    <p><strong>Bike ID:</strong> {bike.id}</p>
                    <p><strong>Status:</strong> {bike.status}</p>
                    <p><strong>Battery Level:</strong> {bike.battery_level}%</p>
                    <p><strong>Longitude:</strong> {bike["ST_X(position)"]}</p>
                    <p><strong>Latitude:</strong> {bike["ST_Y(position)"]}</p>
                </>
            ) : (
                <p>No bike details available.</p>
            )}
        </div>
    );
};

export default withAuth(BikeDetails);
