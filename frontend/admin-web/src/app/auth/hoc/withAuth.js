import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loader from "@/components/Loader";

const withAuth = (WrappedComponent) => {
    const AuthenticatedComponent = (props) => {
        const [session, setSession] = useState(null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const token = Cookies.get("token");
            const user = Cookies.get("user");

            if (token && user) {
                try {
                    setSession({ user: JSON.parse(user) });
                } catch (error) {
                    console.error("Failed to parse user cookie:", error);
                    setSession(null);
                }
            } else {
                setSession(null);
            }

            setIsLoading(false);
        }, []);

        if (isLoading) {
            return <Loader />;
        }

        if (!session || !session.user) {
            if (typeof window !== "undefined") {
                window.location.href = "/auth/signin";
            }
            return null;
        }

        return <WrappedComponent {...props} session={session} />;
    };
    AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

    return AuthenticatedComponent;
};

export default withAuth;
