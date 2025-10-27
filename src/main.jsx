import React from "react"; // calling React components in main.jsx file
import { createRoot } from "react-dom/client"; // a react-dom component which used to create Routes for web page
import {
  createBrowserRouter, // use to create router for bowser between files
  RouterProvider, // a provide to connect router to main file
  Navigate, // as for navigate
} from "react-router-dom";
import { Provider } from "react-redux"; // it help to know page that user login or not
import store from "./Store/store.js"; // as from store file authslice file is used

import App from "./App.jsx";
import Home from "./Application_files/Home_page/Home.jsx";
import Profile from "./Application_files/User_Profile/Profile.jsx";
import About from "./Application_files/About/About.jsx";
import Login from "./Application_files/Loginin_signup/Login/Login.jsx";
import Signup from "./Application_files/Loginin_signup/Signup/Signup.jsx";
import AuthLayout from "./Data_management/AuthLayout.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="/about" replace />,
      },

      {
        path: "/about",
        element: (
          <AuthLayout authentication={false}>
            <About />
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },

      {
        path: "/home",
        element: (
          <AuthLayout authentication={true}>
            <Home />
          </AuthLayout>
        ),
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication={true}>
            <Profile />
          </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
