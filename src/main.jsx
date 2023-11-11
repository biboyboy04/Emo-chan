import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./components/HomePage.jsx";
import EBookReader from "./components/EBookReader .jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./normalize.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/Emo-chan/",
    element: <HomePage />,
  },
  {
    path: "/Emo-chan/App",
    element: <EBookReader />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
