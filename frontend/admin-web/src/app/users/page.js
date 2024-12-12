"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";


export default function Users() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "unauthenticated") {
        router.push("/auth/signin");
        return null;
    }

    if (status === "loading") {
        return <Loader />;

    }

    return (
        <div>
            <h1>Users</h1>
            <p>Manage platform users from this page.</p>
        </div>
    );
}
