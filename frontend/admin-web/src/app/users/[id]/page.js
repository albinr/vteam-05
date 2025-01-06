"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import withAuth from "../../hoc/withAuth";
import { fetchUserById } from "../api";
import Loader from "@/components/Loader";

const UserDetails = ({ session }) => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const loadUser = async () => {
            try {
                const data = await fetchUserById(id);
                setUser(data);
            } catch (err) {
                console.error("Error fetching user details:", err.message);
                setError("Failed to fetch user details.");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
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
            <h1>User Details</h1>
            {user ? (
                <>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Balance:</strong> {user.balance}</p>
                </>
            ) : (
                <p>No user details found.</p>
            )}
            <h2>Payments</h2>
            {/* Add logic for displaying payments if applicable */}
            <h2>Trips</h2>
            {/* Add logic for displaying trips if applicable */}
        </div>
    );
};

export default withAuth(UserDetails);
