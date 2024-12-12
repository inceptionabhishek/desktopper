import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentProject } from "../actions/currentProject";
import { setCurrentTask } from "../actions/currentTask";
import { setProjects } from "../actions/projects";
import { setSelectedTask } from "../actions/selectedTask";

import {
  setCurrentTimer,
  setEndTime,
  setIdleTime,
  setSession,
  setSessionOn,
  setStartTime,
  setTimeElapsed,
  setTimerRunning,
} from "../actions/session";
import { setTasks } from "../actions/tasks";
import { setUser } from "../actions/user";
import { setWorkspaceDetails } from "../actions/workspaceDetails";
import { fetchTotalTime } from "../apiservices/FetchTodayTotalTime";
import { readWorkspace } from "../apiservices/ReadWorkspace";
import { verifyLoginToken } from "../apiservices/VerifyLoginToken";
import Projects from "../components/Projects";
import Tasks from "../components/Tasks";
import "./styles.css";
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};
function DashBoard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("team-hub-token") === null) {
      navigate("/login");
    }
  }, []);
  const projects = useSelector((state) => state.projects.projects);
  const user = useSelector((state) => state.user.user);
  const currentDate = getTodayDate();
  async function fetchTotalTimeForToday() {
    try {
      const res = await fetchTotalTime({ userId: user?.userId });
      const data = res.data;
      dispatch(setTimeElapsed(data.totalTimeTracked));
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 403) {
        handleLogoutFunction();
      }
    }
  }
  async function getWorkspaceDetails() {
    try {
      console.log("workspace");
      const response = await readWorkspace({
        workspaceId: JSON.parse(localStorage.getItem("team-hub-user"))
          ?.workspaceId,
      });
      const data = response?.data;
      dispatch(setWorkspaceDetails(data));
    } catch (error) {
      console.error("workspace error", error.response);
      if (error?.response?.status === 403) {
        handleLogoutFunction();
      }
    }
  }
  useEffect(() => {
    fetchTotalTimeForToday();
    getWorkspaceDetails();
  }, [user]);
  const isValidLoginToken = async () => {
    console.log("validating token");
    try {
      const response = await readWorkspace({
        workspaceId: JSON.parse(localStorage.getItem("team-hub-user"))
          ?.workspaceId,
      });
      console.log("workspace", response.response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleLogoutFunction = () => {
    // dispatch everything to thier initial state
    dispatch(setSession(null));
    dispatch(setTimerRunning(false));
    dispatch(setTimeElapsed(0));
    dispatch(setCurrentTimer(null));
    dispatch(setSessionOn(false));
    dispatch(setStartTime(null));
    dispatch(setEndTime(null));
    dispatch(setIdleTime(0));
    dispatch(setSelectedTask(null));
    dispatch(setCurrentProject(null));
    dispatch(setCurrentTask(null));
    dispatch(setProjects(null));
    dispatch(setTasks(null));
    dispatch(setWorkspaceDetails(null));
    dispatch(setUser(null));
    localStorage.removeItem("team-hub-token");
    localStorage.removeItem("team-hub-user");
    localStorage.removeItem("persist:root");
    navigate("/login");
  };
  const handleResetStateOnFirstLoad = () => {
    dispatch(setSession(null));
    dispatch(setTimerRunning(false));
    dispatch(setTimeElapsed(0));
    dispatch(setCurrentTimer(null));
    dispatch(setSessionOn(false));
    dispatch(setStartTime(null));
    dispatch(setEndTime(null));
    dispatch(setIdleTime(0));
  };
  useEffect(() => {
    handleResetStateOnFirstLoad();
  }, []);
  return (
    <>
      <div className="dashboard_cont">
        <div className="projects-section">
          <Projects />
        </div>
        <div className="tasks-section">
          <Tasks />
        </div>
      </div>
    </>
  );
}

export default DashBoard;
