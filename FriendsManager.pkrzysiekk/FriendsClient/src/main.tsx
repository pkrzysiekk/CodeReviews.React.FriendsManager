import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts"; // Import our custom CSS
import "../src/app/styles/styles.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
