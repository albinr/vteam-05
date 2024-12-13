import React from "react";
import { render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import Header from "../index";

test("renders Header with Sign In button when not authenticated", () => {
    render(
        <SessionProvider session={null}>
            <Header />
        </SessionProvider>
    );
    expect(screen.getByText("Sign In")).toBeInTheDocument();
});
