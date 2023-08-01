import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../node_modules/@fortawesome/fontawesome-free/css/fontawesome.css";
import "../node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.css";
import "../node_modules/@fortawesome/fontawesome-free/css/brands.min.css";
import "../node_modules/@fortawesome/fontawesome-svg-core/styles.css";
import "../node_modules/@fortawesome/free-solid-svg-icons/faHandsHolding";
import "../node_modules/@fortawesome/free-solid-svg-icons/faBars";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mdbreact/dist/css/mdb.css";
import reportWebVitals from "./reportWebVitals";
import "react-chat-elements/dist/main.css"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
