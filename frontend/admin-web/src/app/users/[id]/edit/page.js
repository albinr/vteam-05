"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import withAuth from "@/app/auth/hoc/withAuth";
import { apiClient } from "@/services/apiClient";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useFlashMessage } from "@/components/Layout";


const UpdateUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        balance: "",
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const router = useRouter();
    const addFlashMessage = useFlashMessage();

    useEffect(() => {
        if (!id) {
            setLoading(false);
            addFlashMessage(`No valid user id`, "error")
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
                addFlashMessage(`Failed to fetch user details: ${err.message}`, "error")
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [id, addFlashMessage]);

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

        if (!formData.email || formData.email.trim() === "") {
            addFlashMessage("Email cannot be empty.", "error");
            setUpdating(false);
            return;
        }
        if (!formData.balance || isNaN(parseFloat(formData.balance))) {
            addFlashMessage("Balance must be a valid number.", "error");
            setUpdating(false);
            return;
        }

        try {
            // console.log("user_id:", user.user_id, typeof user.user_id);
            // console.log("formData:", formData);
            // const response = await updateUser(user.user_id, formData);
            const response = await apiClient.put(`/users/${id}`, formData);
            addFlashMessage("User updated successfully!", "success");
            // console.log("User updated successfully!:", response);
            router.push(`/users/${user.user_id}`);
        } catch (err) {
            // console.error("Error updating user:", err);
            addFlashMessage(`Failed to update user: ${err.message}`, "error");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="page-container">
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
