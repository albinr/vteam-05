"use client";

import withAuth from "../app/hoc/withAuth";
// import Loader from "@/components/Loader";
import Map from "@/components/Map";
import { useState, useEffect } from "react";
import { fetchBikes } from "./bikes/api";

const Home = ({ session }) => {
    const [bikes, setBikes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchBikes();
                setBikes(response);
                console.log(response);
            } catch (error) {
                console.error("Error fetching bikes:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session.user?.name || "User"}!</p>
            <p>Here you can view scooter locations and manage the platform.</p>
            <Map markers={bikes} />
        </div>
    );
};

export default withAuth(Home);