import React from "react";
import ReactDOM from "react-dom/client";

import { Toaster } from "react-hot-toast";

import "./styles/Global.css";
import "./styles/theme.css";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(

    <React.StrictMode>

        <Toaster
            position="top-right"
            reverseOrder={false}
            containerStyle={{
                zIndex: 999999
            }}
            toastOptions={{
                duration: 4000,
                style: {
                    zIndex: 999999,
                    fontSize: "16px"
                }
            }}
        />

        <App />

    </React.StrictMode>

);
