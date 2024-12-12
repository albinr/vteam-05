"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";
import Loader from "@/components/Loader";
import { fetchBikes } from "./api";

const ebikeColumns = [
    { header: "ID", accessor: "id" },
    { header: "Model", accessor: "model" },
    { header: "Status", accessor: "status" },
    { header: "Battery", accessor: "battery" },
];

export default function Bikes() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === "authenticated") {
            const loadBikes = async () => {
                try {
                    const data = await fetchBikes();
                    setBikes(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            loadBikes();
        }
    }, [status]);

    if (status === "unauthenticated") {
        router.push("/auth/signin");
        return null;
    }

    if (status === "loading" || loading) {
        return <Loader />;
    }

    if (error) {
        return <p className="error">Error: {error}</p>;
    }

    const handleRowClick = (row) => {
        console.log("Selected E-Bike:", row);
    };

    return (
        <div>
            <h1>Bikes</h1>
            <p>Manage all bikes on the platform from this page.</p>
            <Table columns={ebikeColumns} data={bikes} onRowClick={handleRowClick} />
        </div>
    );
}
