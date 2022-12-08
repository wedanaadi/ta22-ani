import "./bootstrap";

import React from "react";
import ReactDOM from "react-dom/client";
import "@popperjs/core";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/app.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import App from "./App";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { AuthProvider } from "./hook/Auth";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  // </React.StrictMode>
);
