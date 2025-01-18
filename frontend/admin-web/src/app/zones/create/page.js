"use client";

import { useState } from "react";
import withAuth from "../../auth/hoc/withAuth";
import { apiClient } from "@/services/apiClient";

const CreateZone = ({ session }) => {
    const [formData, setFormData] = useState({
        city: "",
        name: "",
        type: "",
        radius: "",
        capacity: "",
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

            setSuccess("Zone created successfully!");
            setFormData({ user_id: "", email: "", balance: "", isSimulated: 0 });
            console.log("Zone created:", result);
        } catch (err) {
            console.error(err);
            setError(`Failed to create Zone: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Create Zone</h1>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">name:</label>
                    <input
                        type="name"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="zone_id">Zone Id:</label>
                    <input
                        type="input"
                        id="zone_id"
                        name="zone_id"
                        value={formData.zone_id || ""}
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
                    {"Create Zone"}
                </button>
            </form>
        </div>
    );
};

export default withAuth(CreateZone);
