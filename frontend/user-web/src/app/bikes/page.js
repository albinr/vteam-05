"use client";

import { useState, useEffect,useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";
import Loader from "@/components/Loader";
import { fetchBikes } from "./api";
import dynamic from "next/dynamic";

const ebikeColumns = [
    { header: "ID", accessor: "bike_id" },
    { header: "Status", accessor: "status" },
    { header: "Long", accessor: "ST_X(position)" },
    { header: "Lat", accessor: "ST_Y(position)" },

    { header: "Battery", accessor: "battery_level" },
];

export default function Bikes() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "unauthenticated") {
        router.push("/auth/signin");
        return null;
    }

    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === "authenticated") {
            const loadBikes = async () => {
                try {
                    const data = await fetchBikes();
                    console.log(data)
                    setBikes(data);
                } catch (err) {
                    console.log(err.message)
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            loadBikes();
        }
    }, [status]);


    const Map = useMemo(() => dynamic(
        () => import('@/components/Map/'),
        {
            loading: () => <Loader />,
            ssr: false
        }
    ), [])
    const center = [57.534591, 18.06324];

    if (status === "loading" || loading) {
        return <Loader />;
    }


    const handleRowClick = (row) => {
        console.log("Selected E-Bike:", row);
    };

    return (
        <div>
            <h1>Bikes</h1>
            <p>Manage all bikes on the platform from this page.</p>
            {error && <p className="error">{error}</p>}
            <Map posix={center} />
            <Table
                columns={ebikeColumns}
                data={bikes}
                onRowClick={handleRowClick}
            />
        </div>
    );
}
