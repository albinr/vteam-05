"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams for dynamic route parameters
import { fetchBikeById } from "../api"; // Ensure this is the correct path to your API utility
import Loader from "@/components/Loader";

const BikeDetails = () => {
    const { id } = useParams(); // Get the dynamic route `id`
    const [bike, setBike] = useState(null); // Store the bike details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return; // Avoid running if `id` is not available

        const loadBike = async () => {
            try {
                const data = await fetchBikeById(id); // Pass the `id` to the fetch function
                setBike(data);
            } catch (err) {
                console.error(err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadBike();
    }, [id]);

    if (loading) return <Loader/>;

    return (
        <div>
            <h1>Bike Details</h1>
            {error && <p className="error">{error}</p>}
            <p>Bike ID: {id}</p>
        </div>
    );
};

export default BikeDetails;
