import React from "react";

import {Nav, Navbar as BSNavbar, NavDropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import {RouteList} from "../Routes";

export default function Navbar(): JSX.Element
{
    return (
        <>
            <BSNavbar
                expand="lg"
                className={"bg-transparent navbar-dark"}
            >
                <div className={"container-fluid"}>
                    <Link to={"/"} className="navbar-brand">
                        🧰 canto.tools
                        <small
                            className={"text-green ms-2"}
                            style={{
                                opacity: .5
                            }}
                        >beta</small>
                    </Link>
                    <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
                    <BSNavbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <li className="nav-item">
                                <Link to={RouteList.home.path} className={"nav-link"+" "+(RouteList.home.path == window.location.pathname ? "active" : "")}>
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={RouteList.analytics.path} className={"nav-link"+" "+(RouteList.analytics.path == window.location.pathname ? "active" : "")}>
                                    Analytics
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={RouteList.ecosystem.path} className={"nav-link"+" "+(RouteList.ecosystem.path == window.location.pathname ? "active" : "")}>
                                    Projects
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={RouteList.calendar.path} className={"nav-link"+" "+(RouteList.calendar.path == window.location.pathname ? "active" : "")}>
                                    Calendar
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a href={"https://canto.io"} target={"_blank"} className="nav-link" rel="noreferrer">
                                    canto.io
                                    <small>
                                        <sup>
                                            <span className="fa-solid fa-arrow-up-right-from-square ms-2" />
                                        </sup>
                                    </small>
                                </a>
                            </li>
                        </Nav>
                        <Nav className="ms-auto">
                            <NavDropdown title={"About Canto"} id="basic-nav-dropdown">
                                <a href={"https://evm.explorer.canto.io"} target={"_blank"} className="dropdown-item" rel="noreferrer">
                                    Explorer
                                    <small>
                                        <sup>
                                            <span className="fa-solid fa-arrow-up-right-from-square ms-2" />
                                        </sup>
                                    </small>
                                </a>
                                <a href={"https://canto.io"} target={"_blank"} className="dropdown-item" rel="noreferrer">
                                    canto.io
                                    <small>
                                        <sup>
                                            <span className="fa-solid fa-arrow-up-right-from-square ms-2" />
                                        </sup>
                                    </small>
                                </a>
                                <a href={"https://docs.canto.io"} target={"_blank"} className="dropdown-item" rel="noreferrer">
                                    Docs
                                    <small>
                                        <sup>
                                            <span className="fa-solid fa-arrow-up-right-from-square ms-2" />
                                        </sup>
                                    </small>
                                </a>
                            </NavDropdown>
                            <li className="nav-item">
                                <a href={"https://twitter.com/CantoTools"} target={"_blank"} className="nav-link" rel="noreferrer">
                                    <i className="fab fa-twitter" /> Twitter
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href={"https://discord.gg/WzAFmFjJEF"} target={"_blank"} className="nav-link" rel="noreferrer">
                                    <i className="fab fa-discord" /> Discord
                                </a>
                            </li>
                        </Nav>
                    </BSNavbar.Collapse>
                </div>
            </BSNavbar>
        </>
    );
}
