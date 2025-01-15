"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import withAuth from "../../auth/hoc/withAuth";
import { fetchUserById, fetchUserTripsById, fetchUserPaymentsById } from "../api";
import Loader from "@/components/Loader";
import Button from "@/components/Button";

const UserDetails = ({ session }) => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);
    const [payments, setPayments] = useState([]);
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
                console.log("Fetching user details for ID:", id);

                // Fetch user details
                const userData = await fetchUserById(id);
                console.log("User data:", userData);
                setUser(userData);
                // Fetch user trips
                const userTrips = await fetchUserTripsById(id);
                console.log("User trips:", userTrips);
                setTrips(userTrips || []);
                // Fetch user payments
                // const userPayments = await fetchUserPaymentsById(id);
                // console.log("User payments:", userPayments);

                // Update states
                // setPayments(userPayments || []);
            } catch (err) {
                console.error(`Error fetching data: ${err.message}`);
                // setError(`Failed to fetch user details, trips, or payments. API error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [id]);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <p>No User details available.</p>;
    }

    return (
        <div>
            <h1>User Details</h1>
            <p><strong>User ID:</strong> {user.user_id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Balance:</strong> {user.balance}</p>
            <Button
            label={"Update User"}
            />
            <Button
            label={"Delete User"}
            />
            {trips.length > 0 && (
                <div>
                    <h2>Trips</h2>
                    <ul>
                        {trips.map((trip) => (
                            <li key={trip.id}>{trip.details}</li>
                        ))}
                    </ul>
                </div>
            )}
            {payments.length > 0 && (
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
