import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles.css";
import { AuthProvider } from "./auth/AuthContext";
import App from "./App";
import {Toaster} from "react-hot-toast";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" />  
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
