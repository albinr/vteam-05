"use client";

import withAuth from "../app/auth/hoc/withAuth";
import Link from "next/link";
import Loader from "@/components/Loader";
// import Loader from "@/components/Loader";
import { useState, useEffect, useMemo } from "react";
import { fetchBikes } from "./bikes/api";
import { fetchUsers } from "./users/api";
import { fetchZones } from "./zones/api";
import { useRouter } from "next/navigation";
import "./Home.css";
import LeafletMap from "@/components/Map";
import Table from "@/components/Table";

const adminColumns = [
    { header: "ID", accessor: "user_id" },
    {
        header: "Role",
        accessor: "admin",
        render: (role) => (role.admin === 1 ? "Admin" : "User"),
    },
    { header: "Email", accessor: "email" },
    { header: "Balance", accessor: "balance" },
    { header: "Simulated", accessor: "simulation_user" },
];

const Home = ({ session }) => {
    const router = useRouter();
    const [bikes, setBikes] = useState([]);
    const [users, setUsers] = useState([]);
    const [zones, setZones] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBikes = async () => {
            try {
                const response = await fetchBikes();
                setBikes(response);
            } catch (error) {
                console.error("Error fetching bikes:", error);
            }
        };

        const loadUsers = async () => {
            try {
                const response = await fetchUsers();
                const adminUsers = response.filter(user => user.admin === 1);
                setUsers(response);
                setAdmins(adminUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const loadZones = async () => {
            try {
                const response = await fetchZones();
                setZones(response);
            } catch (error) {
                console.error("Error fetching zones:", error);
            }
        }

        const fetchData = async () => {
            await Promise.all([loadZones(), loadBikes(), loadUsers()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    const memoizedMarkers = useMemo(() => [...zones, ...bikes], [zones, bikes]);

    const handleAdminRowClick = (id) => {
        router.push(`/users/${id}`);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="page-container">
            <h1>Dashboard</h1>
            <div>
                <p>Welcome, {session.user?.name || "User"}!</p>
            </div>
            <h2>Map</h2>
            <Link href="/map" passHref>
                <div className="dash-map" style={{ cursor: "pointer" }}>
                    <LeafletMap markers={memoizedMarkers} interactive={false} />
                </div>
            </Link>
            <h2>Statistics</h2>
            <div className="dash-stats">
                <Link href="/bikes" passHref>
                    <div className="dash-stat" style={{ cursor: "pointer" }}>
                        <h2>Number of scooters</h2>
                        <p>{bikes.length}</p>
                    </div>
                </Link>

                <Link href="/users" passHref>
                    <div className="dash-stat" style={{ cursor: "pointer" }}>
                        <h2>Number of users</h2>
                        <p>{users.length}</p>
                    </div>
                </Link>

                <Link href="/zones" passHref>
                    <div className="dash-stat" style={{ cursor: "pointer" }}>
                        <h2>Number of zones</h2>
                        <p>{zones.length}</p>
                    </div>
                </Link>
            </div>
            <div className="dash-admin-list">
                <h2>Admins</h2>
                <Table
                    columns={adminColumns}
                    data={admins}
                    onRowClick={(row) => handleAdminRowClick(row.user_id)}
                />
            </div>

        </div>
    );
};

export default withAuth(Home);