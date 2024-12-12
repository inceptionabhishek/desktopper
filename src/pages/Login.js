import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Css/Login.css";
import { setProjects } from "../actions/projects";
import { setTasks } from "../actions/tasks";
import { setUser } from "../actions/user";
import { fetchProjects } from "../apiservices/FetchProjects";
import LoginUser from "../apiservices/LoginUser";
const { ipcRenderer } = window.require("electron");

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("team-hub-token")) {
      navigate("/dashboard");
    }
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      email,
      password,
    };
    try {
      const data = await LoginUser(credentials);
      console.log("data at login", data);
      if (data.token) {
        localStorage.setItem("team-hub-token", data.token);
        localStorage.setItem("team-hub-user", JSON.stringify(data.data));
        // create a expiry of 1 week in milliseconds
        const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
        console.log("expiry", expiry);
        localStorage.setItem("team-hub-token-expiry", expiry);
        toast.success("Login Successful");
        dispatch(setUser(data.data));
        getProjectsAndData();
        navigate("/dashboard");
      }
    } catch (error) {
      const response = await ipcRenderer.invoke("wrong_credentials");
      setPassword("");
      setEmail("");
    }
  };
  async function getProjectsAndData() {
    try {
      const response = await fetchProjects();
      console.log("user data", response.data);
      const data = response.data;
      const projects = data.projects;
      const tasks = data.tasks;
      dispatch(setProjects(projects));
      dispatch(setTasks(tasks));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{
          width: "300px",
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center",
          color: "#fff",
        }}
      />
      <div className="login-container">
        <div className="card-login">
          <h2 className="heading_login">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="email_text">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="passoword_text">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button type="submit" className="login_btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
