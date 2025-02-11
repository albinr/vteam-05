"use client";

import withAuth from "../app/hoc/withAuth";
import "./Home.css";

const Home = ({ session }) => {

    return (
        <div className="outer-box">
            <div className="inner-box">
                <h1>Home</h1>
                <h3>Welcome, {session.user?.name || "User"}!</h3>
                <p>Here you can see recent trips and payment</p>
            </div>
        </div>
    );
};

export default withAuth(Home);