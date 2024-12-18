import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ account, profile }) {
            if (!profile?.email) {
                console.error("Sign-in denied: Missing email in profile.");
                return false;
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.email = token.email;
            return session;
        },
        async redirect({ url, baseUrl }) {
            return `${baseUrl}/`;
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
        signOut: "/auth/signout",
    },
};

const handler = NextAuth(authOptions);

// Export default handler for Pages Router
export { handler as GET, handler as POST };

