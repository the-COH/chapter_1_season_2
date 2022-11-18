import React, {useEffect, useState} from "react";
import bg from "../assets/images/bg1.png";
import {Link} from "react-router-dom";
import {RouteList} from "../Routes";
import Layout from "../Layout";

export default function Home(): JSX.Element {
    const [price, setPrice] = useState<number|null>(null);

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=canto&vs_currencies=usd")
            .then((response) => response.json())
            .then((response) => setPrice(Number((Math.round(response.canto.usd * 100) / 100).toFixed(4))));
    }, []);

    return (
        <Layout>
            <>
                <header
                    className="hero"
                    style={{
                        backgroundImage: "url("+bg+")",
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                        padding: "10vh 0",
                        borderRadius: ".25rem"
                    }}
                >
                    <h1 className={"fw-bold"}>
                        The Canto Ecosystem
                    </h1>
                    <p className={"text-white lead"}>
                        Explore the dApps, jobs, bounties, and resources from the Canto ecosystem.
                    </p>
                    <ul className="list-inline m-0">
                        <li className="list-inline-item">
                            <Link to={RouteList.ecosystem.path} className="btn btn-dark">
                                Ecosystem
                            </Link>
                        </li>
                        <li className="list-inline-item">
                            <a href={"https://evm.explorer.canto.io"} target={"_blank"} className="btn btn-dark" rel="noreferrer">
                                Explorer
                                <small>
                                    <sup>
                                        <span className="fa-solid fa-arrow-up-right-from-square ms-2" />
                                    </sup>
                                </small>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href={"https://docs.canto.io"} target={"_blank"} className="btn btn-dark" rel="noreferrer">
                                Docs
                                <small>
                                    <sup>
                                        <span className="fa-solid fa-arrow-up-right-from-square ms-2" />
                                    </sup>
                                </small>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href={"https://coingecko.com/en/coins/canto"} target={"_blank"} className="btn btn-dark" rel="noreferrer">
                                CoinGecko
                                <small>
                                    <sup>
                                        <span className="fa-solid fa-arrow-up-right-from-square ms-2" />
                                    </sup>
                                </small>
                            </a>
                        </li>
                    </ul>
                </header>
                <div className="py-5">
                    <div className="row text-white">
                        <div className="col-md-6">
                            <div className="">
                                <h4>
                                    Current Price:
                                </h4>
                                <p className="display-6">
                                    {null === price ? "Loading..." : "$"+price}
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 text-lg-end">
                            <h4>
                                Online Hackathon
                                <br />
                                Chapter 1: Season 2
                            </h4>
                            <p>
                                Dates: November 2 - 20
                            </p>
                            <p>
                                <a href="https://thecoh.build/" target={"_blank"} rel="noreferrer">
                                    thecoh.build
                                    <small>
                                        <sup>
                                            <span className="fa-solid fa-arrow-up-right-from-square ms-2" />
                                        </sup>
                                    </small>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </>
        </Layout>
    );
}
