/* eslint-disable react/display-name */

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

const withAuth = (WrappedComponent) => {
    return (props) => {
        const [session, setSession] = useState(null);

        useEffect(() => {
            const user = localStorage.getItem("user");
            if (user) {
                setSession({ user: JSON.parse(user) });
            } else {
                setSession(null);
            }
        }, []);

        if (session === null) {
            return <Loader />;
        }

        if (!session || !session.user) {
            return null;
        }

        return <WrappedComponent {...props} session={session} />;
    };
};

export default withAuth;