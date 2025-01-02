"use client";

import { useState, useEffect } from "react";
import withAuth from "../hoc/withAuth";
import Table from "@/components/Table";
import Loader from "@/components/Loader";
import { fetchZones } from "./api";

const zoneColumns = [
    { header: "ID", accessor: "id" },
    { header: "Type", accessor: "type" },
    { header: "Name", accessor: "name" },
    { header: "Longitude", accessor: "ST_X(position)" },
    { header: "Latitude", accessor: "ST_Y(position)" },
    { header: "Radius", accessor: "radius" },
];

const Zones = ({ session }) => {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadZones = async () => {
            try {
                const data = await fetchZones();
                setUsers(data);
            } catch (err) {
                console.error("Error fetching zones:", err.message);
                setError("Failed to load zones.");
            } finally {
                setLoading(false);
            }
        };

        loadZones();
    }, []);

    if (loading) {
        return <Loader />;
    }

    const handleRowClick = (row) => {
        console.log("Selected Zone:", row);
    };

    return (
        <div>
            <h1>Zones</h1>
            {error && <p className="error">{error}</p>}
            <Table
                columns={zoneColumns}
                data={zones}
                onRowClick={handleRowClick}
            />
        </div>
    );
};

export default withAuth(Zones);
