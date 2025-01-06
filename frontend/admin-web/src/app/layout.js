"use client";

import "../app/globals.css";
import Layout from "@/components/Layout";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <Layout>{children}</Layout>
      </body>
    </html>
  );
}
