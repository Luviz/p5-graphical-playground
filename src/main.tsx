import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DropSketch } from "./sketches/drop/dropSketch";
import { routerSketchElements } from "./sketches/sketchNavigator";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  ...routerSketchElements
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
