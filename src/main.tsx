import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { Provider } from "react-redux";
import { Toaster } from "./components/_ui/toast/toaster.tsx";
import { store } from "./redux/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="m-auto flex w-full overflow-hidden">
      <Provider store={store}>
        <App />
      </Provider>
      <Toaster />
    </div>
  </React.StrictMode>,
);
