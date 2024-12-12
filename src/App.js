import React from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import NavbarComp from "./components/NavbarComp";
import "./index.css";
import DashBoard from "./pages/DashBoard";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <div className="disabled">
      <NavbarComp />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
