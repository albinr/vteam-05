"use client";
import { useState, useEffect } from "react";
import Table from "@/components/Table";
import { useRouter } from "next/navigation";
// import { fetchZones, deleteZoneById, updateZone, createZone } from "./api";
import Button from "@/components/Button";
import withAuth from "@/app/auth/hoc/withAuth";
import ZoneForm from "@/components/ZoneForm";

const CreateZone = () => {

    return (
        <div className="page-container">
            <ZoneForm />
        </div>
    );
};

export default withAuth(CreateZone);
