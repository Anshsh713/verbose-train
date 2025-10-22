import "./App.css";
import Footer from "./Application_files/Main_boxes/Footer/Footer";
import Header from "./Application_files/Main_boxes/Header/Header";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import authservice from "./Appwrite/AuthService";
import { login, logout } from "./Store/AuthSlice";

function App() {
  const [loading, setloading] = useState(true);
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  useEffect(() => {
    authservice
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setloading(false));
  }, [dispatch]);
  return !loading ? (
    <div className="app-container">
      <div className="content-wrapper">
        {authStatus && <Header />}
        <main className="main-content">
          <Outlet />
        </main>
        {authStatus && <Footer />}
      </div>
    </div>
  ) : null;
}

export default App;
