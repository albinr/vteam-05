"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams for dynamic route parameters
import { fetchUserById } from "../api"; // Ensure this is the correct path to your API utility
import Loader from "@/components/Loader";

const UserDetails = () => {
    const { id } = useParams(); // Get the dynamic route `id`
    const [user, setUser] = useState(null); // Store the user details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return; // Avoid running if `id` is not available

        const loadUser = async () => {
            try {
                const data = await fetchUserById(id); // Pass the `id` to the fetch function
                setUser(data);
            } catch (err) {
                console.error(err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id]);

    if (loading) return <Loader/>;

    return (
        <div>
            <h1>User Details</h1>
            {error && <p className="error">{error}</p>}
            <p>User ID: {id}</p>
            <h2>Payments</h2>
            <h2>Trips</h2>
        </div>
    );
};

export default UserDetails;
