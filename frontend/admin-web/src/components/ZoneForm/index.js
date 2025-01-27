"use client";

import { useState} from "react";
import { apiClient } from "@/services/apiClient";
import { useRouter } from "next/navigation";
import Button from "../Button";
import { useFlashMessage } from "../Layout";

const ZoneForm = ({ session, existingZone = null }) => {
    const [formData, setFormData] = useState({
        city: existingZone?.city || "",
        name: existingZone?.name || "",
        type: existingZone?.type || "",
        radius: existingZone?.radius || "",
        capacity: existingZone?.capacity || "",
        longitude: existingZone?.longitude || "",
        latitude: existingZone?.latitude || "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();
    

    // Handle input changes for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Determine if this is a create or update action
            if (existingZone) {
                // Update zone
                await apiClient.put(`/zones/${existingZone.zoneId}`, formData);
                // addFlashMessage("Zone updated successfully!", "success");
                router.push("/zones");
            } else {
                // Create new zone
                console.log(formData);
                await apiClient.post("/zones/add", formData);
                setSuccess("Zone created successfully!");
                setFormData({
                    city: "",
                    name: "",
                    type: "",
                    radius: "",
                    capacity: "",
                    longitude: "",
                    latitude: "",
                });
                router.push("/zones");
            }
        } catch (err) {
            console.error(err);
            setError(`Failed to ${existingZone ? "update" : "create"} zone: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>{existingZone ? "Update Zone" : "Create Zone"}</h1>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="type">Type:</label>
                    <input
                        type="text"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="longitude">Longitude:</label>
                    <input
                        type="text"
                        id="longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="latitude">Latitude:</label>
                    <input
                        type="text"
                        id="latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="radius">Radius:</label>
                    <input
                        type="number"
                        id="radius"
                        name="radius"
                        value={formData.radius}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="capacity">Capacity:</label>
                    <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <Button type="submit" disabled={loading} label={existingZone ? "Update Zone" : "Create Zone"} />
            </form>
        </div>
    );
};

export default ZoneForm;
