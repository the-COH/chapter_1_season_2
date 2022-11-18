import React from "react";

import { BrowserRouter, Routes as Switch, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Ecosystem from "./pages/Ecosystem";
import Calendar from "./pages/Calendar";
import Project from "./pages/Project";
import Analytics from "./pages/Analytics";

export interface IRoute {
    path: string
    children: JSX.Element
}

export const RouteList: { [routeName: string]: IRoute } = {
    home: {
        path: "/",
        children: <Home />
    },
    analytics: {
        path: "/analytics",
        children: <Analytics />
    },
    ecosystem: {
        path: "/ecosystem",
        children: <Ecosystem />
    },
    project: {
        path: "/projects/:projectId",
        children: <Project />
    },
    calendar: {
        path: "/calendar",
        children: <Calendar />
    },
};

export default function Routes(): JSX.Element {
    return (
        <>
            <BrowserRouter>
                <Switch>
                    {Object.values(RouteList)
                        .map((route: IRoute) => <Route key={route.path} path={route.path} element={route.children} />)
                    }
                </Switch>
            </BrowserRouter>
        </>
    );
}
