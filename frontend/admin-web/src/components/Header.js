import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
    const { data: session } = useSession();

    return (
        <header className="header">
            <h1 className="header-title">Admin Panel</h1>
            {session ? (
                <div>
                    <p>Welcome, {session.user.name}</p>
                    <button
                        className="header-logout"
                        onClick={() => signOut()}
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <button
                    className="header-login"
                    onClick={() => signIn("google")}
                >
                    Sign In
                </button>
            )}
        </header>
    );
}
