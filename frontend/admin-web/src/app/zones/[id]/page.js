"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import withAuth from "../../auth/hoc/withAuth";
import { fetchZoneById, deleteZoneById } from "../api";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Button from "@/components/Button";

const ZoneDetails = ({ session }) => {
    const { id } = useParams();
    const [zone, setZone] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();

    const handleDeleteZone = async () => {
        const confirmDelete = confirm("Are you sure you want to delete this zone?");
        if (!confirmDelete) return;

        try {
            await deleteZoneById(id);
            alert("Zone deleted successfully.");
            router.push(`/zones`);
        } catch (err) {
            console.error("Error deleting zone:", err);
            alert(`Failed to delete zone: ${err.message}`);
        }
    };

    const handleEditZone = async () => {
        router.push(`/zones/${id}/edit`);
    };

    useEffect(() => {
        if (!id) {
            setError("Invalid zone ID.");
            setLoading(false);
            return;
        }

        const loadZoneData = async () => {
            try {
                console.log("Fetching zone details for ID:", id);

                const zoneData = await fetchZoneById(id);
                console.log("Zone data:", zoneData);
                setZone(zoneData);
            } catch (err) {
                console.error(`Error fetching data: ${err.message}`);
                setError(`Failed to fetch zone details. API error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadZoneData();
    }, [id]);

    if (loading) {
        return <Loader />;
    }

    if (!zone) {
        return <p>No Zone details available.</p>;
    }

    return (
        <div>
            <h1>Zone Details</h1>
            <p><strong>Zone ID:</strong> {zone.zone_id}</p>
            <p><strong>Name:</strong> {zone.name}</p>
            <p><strong>Type:</strong> {zone.type}</p>

            <Button
                label={"Edit Zone"}
                onClick={handleEditZone}
            />
            <Button
                label={"Delete Zone"}
                onClick={handleDeleteZone}
            />
        </div>
    );
};

export default withAuth(ZoneDetails);
