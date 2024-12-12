"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";
import Loader from "@/components/Loader";


const ebikesData = [
    { id: 1, model: "E-Bike X", status: "Available", battery: "85%" },
    { id: 2, model: "E-Bike Y", status: "In Use", battery: "45%" },
    { id: 3, model: "E-Bike Z", status: "Charging", battery: "100%" },
];

const ebikeColumns = [
    { header: "ID", accessor: "id" },
    { header: "Model", accessor: "model" },
    { header: "Status", accessor: "status" },
    { header: "Battery", accessor: "battery" },
];

export default function Bikes() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "unauthenticated") {
        router.push("/auth/signin");
        return null;
    }

    if (status === "loading") {
        return <Loader />;
    }

    const handleRowClick = (row) => {
        console.log("Selected E-Bike:", row);
    };

    return (
        <div>
            <h1>Bikes</h1>
            <p>Manage all bikes on the platform from this page.</p>
            <Table columns={ebikeColumns} data={ebikesData} onRowClick={handleRowClick} />
        </div>
    );
}
