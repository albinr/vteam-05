"use client";

import withAuth from "../app/hoc/withAuth";
import "./Home.css";

const Home = ({ session }) => {

    return (
        <div>
            <h1>Home</h1>
            <p>Welcome, {session.user?.name || "User"}!</p>
        </div>
    );
};

export default withAuth(Home);