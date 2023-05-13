import React from "react";
import { ProtectedRoute } from "./components/Redirect";
import Suspense from "./components/Suspense";

const Home = Suspense(React.lazy(() => import("./pages/Home")));
const Login = Suspense(React.lazy(() => import("./pages/Login")));
const Register = Suspense(React.lazy(() => import("./pages/Register")));

export const routes = [
  {
    path: "/",
    index: true,
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
];
