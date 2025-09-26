import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import store from "./app/store/store"
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);  