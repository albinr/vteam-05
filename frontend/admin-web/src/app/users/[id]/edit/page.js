"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import withAuth from "@/app/auth/hoc/withAuth";
import { fetchUserById, updateUser } from "../../api";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const UpdateUser = ({ session }) => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        balance: "",
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (!id) {
            setError("Invalid user ID.");
            setLoading(false);
            return;
        }

        const loadUserData = async () => {
            try {
                const userData = await fetchUserById(id);
                setUser(userData);
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
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError(null);
        setSuccess(null);

        try {
            await updateUser(id, formData);
            console.log("User updated successfully!");
            router.push(`/users/${id}`)
        } catch (err) {
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
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
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
                <Button type="submit" disabled={updating} label={updating ? "Updating..." : "Update User"} />
            </form>
        </div>
    );
};

export default withAuth(UpdateUser);
