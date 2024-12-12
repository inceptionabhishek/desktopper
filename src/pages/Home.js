import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProjects } from "../actions/projects";
import { setTasks } from "../actions/tasks";
import { setUser } from "../actions/user";
import { fetchProjects } from "../apiservices/FetchProjects";
import LoginButton from "../components/LoginButton";
import {
  setUserData,
  setUserToken,
  setUserExpiry,
} from "../actions/localStorage";
const { ipcRenderer } = window.require("electron");
function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function getProjectsAndData() {
    try {
      const response = await fetchProjects();
      const data = response.data;
      console.log("user Data : ", data);
      const projects = data.projects;
      const tasks = data.tasks;
      dispatch(setProjects(projects));
      dispatch(setTasks(tasks));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("team-hub-token")) {
      getProjectsAndData();
      const user = JSON.parse(localStorage.getItem("team-hub-user"));
      dispatch(setUser(JSON.parse(localStorage.getItem("team-hub-user"))));
      navigate("/dashboard");
    }
  }, []);

  return (
    <>
      <LoginButton />
    </>
  );
}

export default Home;
