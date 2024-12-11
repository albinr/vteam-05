import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Bikes() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    return (
        <div>
            <h1>Bikes</h1>
            <p>Manage all bikes on the platform from this page.</p>
        </div>
    );
}
