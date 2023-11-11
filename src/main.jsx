import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./components/HomePage.jsx";
import App from "./components/EBookReader .jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/emo-chan/",
    element: <HomePage />,
  },
  {
    path: "/emo-chan/App",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
