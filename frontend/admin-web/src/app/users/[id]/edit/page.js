"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import withAuth from "@/app/auth/hoc/withAuth";
import { fetchUserById, updateUser } from "../../api";
import { apiClient } from "@/services/apiClient";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const UpdateUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        balance: "",
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (!id) {
            setError("Invalid user ID.");
            setLoading(false);
            return;
        }

        const loadUserData = async () => {
            try {
                // const userData = await fetchUserById(id);
                const userData = await apiClient.get(`/users/one/${id}`);

                setUser({
                    ...userData,
                    user_id: userData.user_id.toString(), // Ensure user_id is a string
                });

                setFormData({
                    email: userData.email,
                    balance: userData.balance,
                });

            } catch (err) {
                setError(`Failed to fetch user details: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "balance" ? parseFloat(value) || 0 : value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError(null);

        if (!formData.email || formData.email.trim() === "") {
            setError("Email cannot be empty.");
            setUpdating(false);
            return;
        }
        if (!formData.balance || isNaN(parseFloat(formData.balance))) {
            setError("Balance must be a valid number.");
            setUpdating(false);
            return;
        }

        try {
            console.log("user_id:", user.user_id, typeof user.user_id); // Should show 'string'
            console.log("formData:", formData); // Ensure formData is correct
            // const response = await updateUser(user.user_id, formData);
            const response = await apiClient.put(`/users/${id}`, formData);
            console.log("User updated successfully!:", response);
            router.push(`/users/${user.user_id}`);
        } catch (err) {
            console.error("Error updating user:", err);
            setError(`Failed to update user: ${err.message}`);
        } finally {
            setUpdating(false);
        }
    };

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
            <h1>Update User</h1>
            <form onSubmit={handleUpdate}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="balance">Balance:</label>
                    <input
                        type="number"
                        id="balance"
                        name="balance"
                        value={formData.balance}
                        onChange={handleInputChange}
                    />
                </div>
                <Button type="submit" disabled={updating} label={"Update User"} />
            </form>
        </div>
    );
};

export default withAuth(UpdateUser);
