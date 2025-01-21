"use client";

import { useState } from "react";
import withAuth from "../../auth/hoc/withAuth";
import { apiClient } from "@/services/apiClient";

const CreateUser = ({ session }) => {
    const [formData, setFormData] = useState({
        user_id: "",
        email: "",
        balance: "",
        isSimulated: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await apiClient.post("/users", formData);

            setSuccess("User created successfully!");
            setFormData({ user_id: "", email: "", balance: "", isSimulated: 0 });
            console.log("User created:", result);
        } catch (err) {
            console.error(err);
            setError(`Failed to create user: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Create User</h1>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
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
                    <label htmlFor="user_id">User Id:</label>
                    <input
                        type="input"
                        id="user_id"
                        name="user_id"
                        value={formData.user_id || ""}
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
                <div>
                    <label htmlFor="isSimulated">
                        <input
                            type="checkbox"
                            id="isSimulated"
                            name="isSimulated"
                            checked={!!formData.isSimulated}
                            onChange={handleInputChange}
                        />
                        Is Simulated
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create User"}
                </button>
            </form>
        </div>
    );
};

export default withAuth(CreateUser);
