"use client"
import { useState, useEffect } from "react";
import Table from "@/components/Table";
import { useRouter } from "next/navigation";
import { fetchUsers } from "./api";
import Button from "@/components/Button";
import "./Users.css"
import withAuth from "../auth/hoc/withAuth";

const userColumns = [
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

const Users = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const router = useRouter();

    // search logic
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);


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
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(
                (user) =>
                    user.email.toLowerCase().includes(term) ||
                    user.user_id.toString().includes(term)
            );
            setFilteredUsers(filtered);
        }

        setCurrentPage(1);
    };

    const handleUserRowClick = (id) => {
        router.push(`/users/${id}`);
    };


    return (
        <div className="page-container">
            <h1>Users</h1>
            <p>Manage and control users</p>
            <div className="pagination-controls">
                <input
                    type="text"
                    placeholder="Search by email or ID..."
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
                columns={userColumns}
                data={currentUsers}
                onRowClick={(row) => handleUserRowClick(row.user_id)}
            />

        </div>
    );
};

export default withAuth(Users);
