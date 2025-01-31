"use client";
import { useState, useEffect } from "react";
import Table from "@/components/Table";
import { useRouter } from "next/navigation";
import { fetchZones, deleteZoneById, updateZone, createZone } from "./api";
import Button from "@/components/Button";
import { useFlashMessage } from "@/components/Layout";
import "./Zones.css"
import withAuth from "../auth/hoc/withAuth";

const Zones = () => {
    const zoneColumns = [
        { header: "ID", accessor: "zone_id" },
        { header: "City", accessor: "city" },
        { header: "Name", accessor: "name" },
        { header: "Type", accessor: "type" },
        { header: "Radius", accessor: "radius" },
        { header: "Capacity", accessor: "capacity" },
        {
            header: "Actions", render: (row) => (
                <>
                    {/* <Button onClick={() => handleZoneUpdate(row)} label={"Edit"} /> */}
                    <Button onClick={() => handleZoneDelete(row.zone_id)} label={"Delete"} />
                </>
            ),
        },
    
    ];

    const [zones, setZones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const zonesPerPage = 10;
    const addFlashMessage = useFlashMessage()

    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredZones, setFilteredZones] = useState([]);

    useEffect(() => {
        const loadZones = async () => {
            const response = await fetchZones();
            // console.log(response)
            setZones(response);
            setFilteredZones(response);
        };

        loadZones();
    }, []);

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
            setFilteredZones(zones);
        } else {
            const filtered = zones.filter(
                (zone) =>
                    zone.name.toLowerCase().includes(term) ||
                    zone.zone_id.toString().includes(term) ||
                    zone.city.toLowerCase().includes(term)
            );
            setFilteredZones(filtered);
        }

        setCurrentPage(1);
    };

    const handleZoneRowClick = (id) => {
        router.push(`/zones/${id}`);
    };

    const handleZoneDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this zone?")) {
            try {
                await deleteZoneById(id);
                const updatedZones = zones.filter((zone) => zone.zone_id !== id);
                setZones(updatedZones);

                if (searchTerm.trim() !== "") {
                    const newFilteredZones = updatedZones.filter(
                        (zone) =>
                            zone.name.toLowerCase().includes(searchTerm) ||
                            zone.zone_id.toString().includes(searchTerm) ||
                            zone.city.toLowerCase().includes(searchTerm)
                    );
                    setFilteredZones(newFilteredZones);
                } else {
                    setFilteredZones(updatedZones);
                }

                addFlashMessage("Zone deleted successfully!", "success");
            } catch (error) {
                console.error("Error deleting zone:", error);
                alert("Failed to delete the zone.");
            }
        }
    };

    const handleZoneUpdate = (zone) => {
        router.push(`/zones/edit/${zone.zone_id}`);
    };

    return (
        <div className="page-container">
            <h1>Zones</h1>
            <p>Manage and control zones</p>
            <div className="pagination-controls">
                <input
                    type="text"
                    placeholder="Search by name or ID..."
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
                <Button label={"New Zone"} href="zones/create" />
            </div>
            <Table
                columns={zoneColumns}
                data={currentZones}
            />
        </div>
    );
};

export default withAuth(Zones);
