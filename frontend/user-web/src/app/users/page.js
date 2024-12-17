"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";
import Loader from "@/components/Loader";
import { fetchUsers } from "./api";


const userColumns = [
    { header: "ID", accessor: "id" },
    { header: "Username", accessor: "username" },
    { header: "Balance", accessor: "balance" },
    { header: "Email", accessor: "email" },
];

export default function Users() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === "authenticated") {
            const loadBikes = async () => {
                try {
                    const data = await fetchUsers();
                    setUsers(data);
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

    if (status === "unauthenticated") {
        router.push("/auth/signin");
        return null;
    }

    if (status === "loading" || loading) {
        return <Loader />;
    }

    // if (error) {
    //     return <p className="error">Error: {error}</p>;
    // }

    const handleRowClick = (row) => {
        console.log("Selected User:", row);
    };

    return (
        <div>
            <h1>Users</h1>
            <p>Manage platform users from this page.</p>
            {error && <p className="error">{error}</p>}
            <Table
                columns={userColumns}
                data={users}
                onRowClick={handleRowClick}
            />
        </div>
    );
}
