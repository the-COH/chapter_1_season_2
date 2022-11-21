import React from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function Layout(props: { width?: "normal" | "wide", children: JSX.Element }) {
    const { width, children } = props;
    return (
        <>
            <Navbar />
            <div className={"content py-5"}>
                <div className={width === "wide" ? "container-fluid" : "container"}>
                    {children}
                </div>
            </div>
            <Footer />
        </>
    );
}
