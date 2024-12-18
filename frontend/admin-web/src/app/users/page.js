"use client";

import { useState, useEffect } from "react";
import withAuth from "../hoc/withAuth";
import Table from "@/components/Table";
import Loader from "@/components/Loader";
import { fetchUsers } from "./api";

const userColumns = [
    { header: "ID", accessor: "id" },
    { header: "Username", accessor: "username" },
    { header: "Balance", accessor: "balance" },
    { header: "Email", accessor: "email" },
];

const Users = ({ session }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers();
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
    };

    return (
        <div>
            <h1>Users</h1>
            <p>Welcome, {session.user?.name || "User"}!</p>
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
