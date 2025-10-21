import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";
import SocketContextProvider from "./context/SocketContext.jsx";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </AppContextProvider>
  </BrowserRouter>
);
