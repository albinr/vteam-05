"use client";

import "../app/globals.css";
import Layout from "@/components/Layout";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <SessionProvider> */}
          <Layout>{children}</Layout>
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}