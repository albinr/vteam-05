"use client";

import { useState, useEffect } from "react";
import withAuth from "../auth/hoc/withAuth";
import Table from "@/components/Table";
import Loader from "@/components/Loader";
import { fetchUsers } from "./api";
import { useRouter } from "next/navigation";

const userColumns = [
    { header: "ID", accessor: "user_id" },
    { header: "Email", accessor: "Email" },
    { header: "Balance", accessor: "balance" },
    { header: "Simulated", accessor: "simulation_user" },

];

const Users = ({ session }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers();
                console.log(data)
                setUsers(data);
            } catch (err) {
                console.error("Error fetching users:", err.message);
                setError("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    if (loading) {
        return <Loader />;
    }

    const handleRowClick = (row) => {
        console.log("Selected User:", row);
        router.push(`/users/${row.user_id}`);
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
};

export default withAuth(Users);
