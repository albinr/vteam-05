"use client"
import { useState, useEffect } from "react";
import Table from "@/components/Table";
import { useRouter } from "next/navigation";
import { fetchUsers } from "./api";
import Button from "@/components/Button";
import "./Users.css"
import withAuth from "../auth/hoc/withAuth";

const userColumns = [
    { header: "Admin", accessor: "admin" },
    { header: "ID", accessor: "user_id" },
    { header: "Email", accessor: "email" },
    { header: "Balance", accessor: "balance" },
    { header: "Simulated", accessor: "simulation_user" },
];

const Users = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10; 
    const router = useRouter();


    // search logic
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users


    useEffect(() => {
        const loadUsers = async () => {
            const response = await fetchUsers();
            console.log(response)
            setUsers(response);
            setFilteredUsers(response)
        };

        loadUsers();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

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
            setFilteredUsers(users); // Visa alla användare om sökfältet är tomt
        } else {
            const filtered = users.filter(
                (user) =>
                    user.email.toLowerCase().includes(term) || // Filtrera på email
                    user.user_id.toString().includes(term)    // Filtrera på ID
            );
            setFilteredUsers(filtered);
        }

        setCurrentPage(1); // Återställ till första sidan vid sökning
    };

    const handleUserRowClick = (id) => {
        router.push(`/users/${id}`); // Navigera till detaljsidan
    };


    return (
        <div className="users-container">
            <h1>Users</h1>
            <p>Manage and control users</p>
            <div className="pagination-controls">
                <input
                    type="text"
                    placeholder="Search by email or ID..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
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
                columns={userColumns}
                data={currentUsers}
                onRowClick={(row) => handleUserRowClick(row.user_id)}
            />

        </div>
    );
};

export default withAuth(Users);
