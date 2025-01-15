"use client";
import { useState, useEffect } from "react";
import Table from "@/components/Table";
import { useRouter } from "next/navigation";
import { fetchZones } from "./api"; // Updated API call
import Button from "@/components/Button";

const zoneColumns = [
    { header: "ID", accessor: "zone_id" },
    { header: "City", accessor: "city" },
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    { header: "Radius", accessor: "radius" },
    { header: "Capacity", accessor: "capacity" },
];

const Zones = () => {
    const [zones, setZones] = useState([]); // All zone data
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const zonesPerPage = 10; // Number of zones per page

    const router = useRouter(); // Create router instance

    // Search logic
    const [searchTerm, setSearchTerm] = useState(""); // Search term
    const [filteredZones, setFilteredZones] = useState([]); // Filtered zones

    useEffect(() => {
        const loadZones = async () => {
            const response = await fetchZones();
            console.log(response)
            setZones(response);
            setFilteredZones(response);
        };

        loadZones();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(filteredZones.length / zonesPerPage);
    const startIndex = (currentPage - 1) * zonesPerPage;
    const currentZones = filteredZones.slice(startIndex, startIndex + zonesPerPage);

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
            setFilteredZones(zones); // Show all zones if search field is empty
        } else {
            const filtered = zones.filter(
                (zone) =>
                    zone.name.toLowerCase().includes(term) || // Filter by name
                    zone.zone_id.toString().includes(term) ||  // Filter by ID
                    zone.city.toLowerCase().includes(term) // Filter by city
            );
            setFilteredZones(filtered);
        }

        setCurrentPage(1); // Reset to first page on search
    };

    const handleZoneRowClick = (id) => {
        router.push(`/zones/${id}`); // Navigate to the zone detail page
    };

    return (
        <div>
            <h1>Zones</h1>
            <p>Manage and control zones</p>
            <div className="pagination-controls">
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
                />
                <Button
                    label="<"
                    onClick={() => handlePageChange("prev")}
                    disabled={currentPage === 1}
                />

                <Button
                    label=">"
                    onClick={() => handlePageChange("next")}
                    disabled={currentPage === totalPages}
                />
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <Button label={"New Zone"} href="zones/create" />
            </div>
            <Table
                columns={zoneColumns}
                data={currentZones}
                onRowClick={(row) => handleZoneRowClick(row.zone_id)}
            />
        </div>
    );
};

export default Zones;
