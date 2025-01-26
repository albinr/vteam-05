"use client";

import { useState, useEffect } from "react";
import withAuth from "../auth/hoc/withAuth";
import Table from "@/components/Table";
import { useRouter } from "next/navigation";
// import { apiClient } from "@/services/apiClient";
import { fetchBikes } from "./api";
import Button from "@/components/Button";
import "./Bikes.css";

const bikeColumns = [
    { header: "ID", accessor: "bike_id" },
    { header: "Status", accessor: "status" },
    { header: "Longitude", accessor: "longitude" },
    { header: "Latitude", accessor: "latitude" },
    { header: "Battery", accessor: "battery_level" },
    { header: "Simulated", accessor: "simulation" },
];

const Bikes = () => {
    const [bikes, setBikes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const bikesPerPage = 10;

    const router = useRouter();

    // Search logic
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBikes, setFilteredBikes] = useState([]);

    useEffect(() => {
        const loadBikes = async () => {
            const response = await fetchBikes();
            console.log(response)
            setBikes(response);
            setFilteredBikes(response);
        };

        loadBikes();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(filteredBikes.length / bikesPerPage);
    const startIndex = (currentPage - 1) * bikesPerPage;
    const currentBikes = filteredBikes.slice(startIndex, startIndex + bikesPerPage);

    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setFilteredBikes(bikes);
        } else {
            const filtered = bikes.filter(
                (bike) =>
                    bike.status.toLowerCase().includes(term) ||
                    bike.bike_id.toString().includes(term)
            );
            setFilteredBikes(filtered);
        }

        setCurrentPage(1);
    };

    const handleBikeRowClick = (id) => {
        router.push(`/bikes/${id}`);
    };

    return (
        <div className="page-container">
            <h1>Bikes</h1>
            <p>Manage and view bikes</p>
            <div className="pagination-controls">
                <input
                    type="text"
                    placeholder="Search by status or ID..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Button
                    label="<"
                    onClick={() => handlePageChange("prev")}
                    disabled={currentPage === 1}
                />
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    label=">"
                    onClick={() => handlePageChange("next")}
                    disabled={currentPage === totalPages}
                />

            </div>
            <Table
                columns={bikeColumns}
                data={currentBikes}
                onRowClick={(row) => handleBikeRowClick(row.bike_id)}
            />
        </div>
    );
};

export default withAuth(Bikes);
