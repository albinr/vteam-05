import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import Loader from "@/components/Loader";

const withAuth = (WrappedComponent) => {
    return (props) => {
        const { data: session, status } = useSession();

        useEffect(() => {
            if (status === "unauthenticated") {
                signIn();
            }
        }, [status]);

        if (status === "loading") {
            return <Loader/>;
        }

        if (!session) {
            return null;
        }

        return <WrappedComponent {...props} session={session} />;
    };
};

export default withAuth;
