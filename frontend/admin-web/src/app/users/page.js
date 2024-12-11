import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}


export default function Users() {
    return (
        <div>
            <h1>Users</h1>
            <p>Manage platform users from this page.</p>
        </div>
    );
}
