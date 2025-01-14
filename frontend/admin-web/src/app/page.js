"use client";

import withAuth from "../app/auth/hoc/withAuth";
import Link from "next/link";
import Loader from "@/components/Loader";
// import Loader from "@/components/Loader";
import Map from "@/components/Map";
import { useState, useEffect } from "react";
import { fetchBikes } from "./bikes/api";
import "./Home.css";

const Home = ({ session }) => {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchBikes();
                setBikes(response);
                console.log(response);
            } catch (error) {
                console.error("Error fetching bikes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session.user?.name || "User"}!</p>
            <p>Here you can view scooter locations and manage the platform.</p>
            <div className="dash-map">
                <Map markers={bikes} />
            </div>
            <div className="dash-links">
                <Link href="/users">Users</Link>
                <Link href="/bikes">Bikes</Link>
            </div>

        </div>
    );
};

export default withAuth(Home);