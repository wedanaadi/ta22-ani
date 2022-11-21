import "./bootstrap";

import React from "react";
import ReactDOM from "react-dom/client";
import "@popperjs/core";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/app.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hook/Auth";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
