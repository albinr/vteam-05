import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session.user.name}!</p>
            <p>Your email: {session.user.email}</p>
            <p>Here you can view key metrics and manage the platform.</p>
        </div>
    );
}
