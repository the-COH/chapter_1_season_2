import React from "react";
import DuneIframe from "../components/DuneIframe";
import Layout from "../Layout";

const duneQueries: string[] = [
    "https://dune.com/embeds/1182395/2023931/e7ecdd5d-cfe9-4fba-915e-7b6baebee455",
    "https://dune.com/embeds/1182395/2023776/42b132c4-52a2-4e63-819c-39c2d00806f9",
];

export default function Analytics(): JSX.Element {
    return (
        <Layout>
            <>
                <header className="hero py-2 pb-4">
                    <h1 className={"m-0"}>
                        📊 Analytics
                    </h1>
                    <p className="ms-3 text-muted lead mt-3">
                        Statistics of the Canto blockchain and ecosystem
                    </p>
                </header>
                <div className="analytics">
                    <div className="row justify-content-center">
                        {duneQueries.map(src => (
                            <div
                                key={src}
                                className="col-md-6"
                            >
                                <DuneIframe src={src} />
                            </div>
                        ))}
                    </div>
                </div>
            </>
        </Layout>
    );
}
