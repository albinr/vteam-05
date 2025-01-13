"use client";

import withAuth from "../hoc/withAuth";


const Account = ({ session }) => {

    return (
        <div>
            <h1>Account</h1>
            <p>Welcome, {session.user?.name || "User"}!</p>
        </div>
    );
};

export default withAuth(Account);