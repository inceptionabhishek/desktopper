import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import "./styles.css";

function LoginButton() {
  return (
    <>
      <div
        className="d-flex flex-column align-items-center justify-content-center vh-100"
        onDrag={(e) => e.preventDefault()}
        onDragEnd={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        <img
          src={Logo}
          alt="Company Logo"
          className="logo"
          onDrag={(e) => e.preventDefault()}
          onDragEnd={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
        <h3 className="welcome-message">
          Login to start recording time and manage tasks
        </h3>
        <Link to="/login">
          <button className="login-button">
            Log In
          </button>
        </Link>
      </div>
    </>
  );
}

export default LoginButton;
