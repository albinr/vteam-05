"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import withAuth from "../../auth/hoc/withAuth";
import { fetchUserById, fetchUserTripsById, deleteUserById, promoteUserToAdmin } from "../api";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { useFlashMessage } from "@/components/Layout";

const UserDetails = ({ session }) => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const addFlashMessage = useFlashMessage();

    const router = useRouter();

    const handleDeleteUser = async () => {
        const confirmDelete = confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await deleteUserById(id);
            addFlashMessage(`User ${id} deleted successfully`, "success");
            router.push(`/users`)
        } catch (err) {
            console.error("Error deleting user:", err);
            addFlashMessage(`Failed to delete user: ${err.message}`, "error");
        }
    };

    const handleEditUser = async () => {
        router.push(`/users/${id}/edit`)
    }

    const handlePromoteUser = async () => {
        if (!user) return;
    
        const newRole = user.admin === 1 ? 0 : 1;
        const action = newRole === 1 ? "promote" : "demote";
    
        try {
            await promoteUserToAdmin(id);
            setUser({ ...user, admin: newRole });
            addFlashMessage(`User successfully ${action}d`, "success");
        } catch (error) {
            console.error(`Error updating user role:`, error);
            addFlashMessage(`Failed to ${action} user`, "error");
        }
    };

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const loadUserData = async () => {
            try {
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
        <div className="page-container">
            <h1>User Details</h1>
            <p><strong>User ID:</strong> {user.user_id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Balance:</strong> {user.balance}</p>
            <p><strong>Role:</strong> {user.admin == 0 ? "User" : "Admin"}</p>

            <Button
                label={"Edit User"}
                onClick={handleEditUser}
            />
            <Button
                label={"Delete User"}
                onClick={handleDeleteUser}
            />
            {user.admin === 0 && (
            <Button
                label={"Make Admin"}
                onClick={handlePromoteUser}
            />
            )}
            {trips.length > 0 && (
                <div>
                    <h2>Trips</h2>
                    <ul>
                        {trips.map((trip, index) => (
                            <li key={trip.id || index}>{trip.trip_id} - {trip.price}</li>
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
