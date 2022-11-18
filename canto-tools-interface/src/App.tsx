import React from "react";
import Routes from "./Routes";

import "./assets/sass/style.scss";
import {dom, library} from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, fab);

// Kicks off the process of finding <i> tags and replacing with <svg>
dom.watch();

export default function App(): JSX.Element {
    return (
        <>
            <Routes />
        </>
    );
}
