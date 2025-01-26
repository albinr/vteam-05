"use client";

import withAuth from "../app/auth/hoc/withAuth";
import Link from "next/link";
import Loader from "@/components/Loader";
// import Loader from "@/components/Loader";
import Map from "@/components/Map";
import { useState, useEffect } from "react";
import { fetchBikes } from "./bikes/api";
import { fetchUsers } from "./users/api";
import { fetchZones } from "./zones/api";

import "./Home.css";

const Home = ({ session }) => {
    const [bikes, setBikes] = useState([]);
    const [users, setUsers] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBikes = async () => { // Renamed to `loadBikes`
            try {
                const response = await fetchBikes(); // Calls the imported `fetchBikes`
                setBikes(response);
            } catch (error) {
                console.error("Error fetching bikes:", error);
            }
        };

        const loadUsers = async () => { // Renamed to `loadUsers`
            try {
                const response = await fetchUsers(); // Calls the imported `fetchUsers`
                setUsers(response);
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

        loadZones();
        loadBikes();
        loadUsers();
        setLoading(false); // Set loading to false after both calls
    }, []);


    if (loading) {
        return <Loader />;
    }

    return (
        <div className="page-container">
            <h1>Dashboard</h1>
            <div>
                <p>Welcome, {session.user?.name || "User"}!</p>
                <img src={session.user?.image} alt={session.user?.name} />
            </div>
            <div className="dash-stats">
                <div className="dash-stat">
                    <h2>Number of scooters</h2>
                    <p>{bikes.length}</p>
                </div>
                <div className="dash-stat">
                    <h2>Number of users</h2>
                    <p>{users.length}</p>
                </div>
                <div className="dash-stat">
                    <h2>Number of zones</h2>
                    <p>{zones.length}</p>
                </div>
            </div>

        </div>
    );
};

export default withAuth(Home);