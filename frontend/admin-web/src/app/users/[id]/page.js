"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import withAuth from "../../hoc/withAuth";
import { fetchUserById, fetchUserTripsById, fetchUserPaymentsById } from "../api";
import Loader from "@/components/Loader";

const UserDetails = ({ session }) => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState(null);
    const [payments, setPayments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setError("Invalid user ID.");
            setLoading(false);
            return;
        }

        const loadUserData = async () => {
            try {
                const user = await fetchUserById(id);
                const trips = await fetchTripsByUserId(id);
                const payments = await fetchPaymentsByUserId(id);
                console.log(user)
                console.log(trips)
                console.log(payments)
                setUser(...user);
                setTrips(trips);
                setPayments(trips);
            } catch (err) {
                console.error("Error fetching data:", err.message);
                setError("Failed to fetch user details or trips or payments.");
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [id]);

    if (loading) {
        return <Loader/>;
    }

    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <p className="error">{error}</p>
            </div>
        );
    }

    if (!user) {
        return <p>No User details available.</p>;
    }

    return (
        <div>
            <h1>User Details</h1>
            <p><strong>User ID:</strong> {user.user_id}</p>
            {trips && (
                <div>
                    <h2>Trips</h2>
                    <ul>
                        {trips.map((trip) => (
                            <li key={trip.id}>{trip.details}</li>
                        ))}
                    </ul>
                </div>
            )}
            {payments && (
                <div>
                    <h2>Payments</h2>
                    <ul>
                        {payments.map((payment) => (
                            <li key={payment.id}>{payment.details}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default withAuth(UserDetails);
