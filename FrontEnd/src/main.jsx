import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";
import SocketContextProvider from "./context/SocketContext.jsx";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <AppContextProvider>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </AppContextProvider>
    </Provider>
  </BrowserRouter>
);
