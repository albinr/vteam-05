"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import withAuth from "../app/hoc/withAuth";
import Loader from "@/components/Loader";

const Home = () => {
    // Redirect to /map page
    const router = useRouter();

    useEffect(() => {
        router.push("/map");
    }, []);


    return (
        <div>
            <Loader />
        </div>
    );
};

export default withAuth(Home);