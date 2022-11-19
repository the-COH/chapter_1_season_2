import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./types/fullpage.d.ts";
import StoreProvider from "store";
import { providers } from "ethers";

const infura = new providers.JsonRpcProvider(
  "https://polygon-mainnet.infura.io/v3/a9581b201b394307a242639713b2b420"
);

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider rpc={infura}>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
