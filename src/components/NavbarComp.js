import React, { useRef, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import { AiOutlineClose } from "react-icons/ai";
import { BiFullscreen } from "react-icons/bi";
import { FaRegWindowMinimize } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentProject } from "../actions/currentProject";
import { setCurrentTask } from "../actions/currentTask";
import { setProjects } from "../actions/projects";
import { setSelectedTask } from "../actions/selectedTask";
import {
  setCurrentTimer,
  setEndTime,
  setError,
  setIdleTime,
  setLoading,
  setResetSession,
  setSession,
  setSessionOn,
  setStartTime,
  setTimeElapsed,
  setTimerRunning,
} from "../actions/session";
import { setTasks } from "../actions/tasks";
import { setUser } from "../actions/user";
import { setWorkspaceDetails } from "../actions/workspaceDetails";
import { createReport } from "../apiservices/CreateSession";
import Logo from "../assets/Logo-White.png";
import "./styles.css";
import {
  setUserData,
  setUserExpiry,
  setUserToken,
} from "../actions/localStorage";
const { ipcRenderer } = window.require("electron");
const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = (minutes % 60).toString().padStart(2, "0");
  const formattedSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
const getDateAndTime = () => {
  let date = new Date();
  let options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  let time = date.toLocaleTimeString("en-us", options);
  return time;
};
const timeDifference = (startTime, endTime) => {
  let start = new Date(startTime);
  let end = new Date(endTime);
  let difference = end - start;
  return difference;
};
function NavbarComp() {
  const navigate = useNavigate();
  const userTotalTime = useSelector(
    (state) => state.userTotalTime.totalTodayTime
  );
  const timerRunning = useSelector((state) => state.session.timerRunning);
  const selectedTask = useSelector((state) => state.selectedTask.selectedTask);
  const currentProject = useSelector(
    (state) => state.currentProject.currentProject
  );
  const user = useSelector((state) => state.user.user);
  const currentTimer = useSelector((state) => state.session.currentTimer);
  const timeElapsed = useSelector((state) => state.session.timeElapsed);
  const session = useSelector((state) => state.session);
  const idleTime = useSelector((state) => state.session.idleTime);
  const [timeRunningState, setTimeRunningState] = useState(false);
  const [time, setTime] = useState(0);
  const timeref = useRef(time);

  const timeRunningStateRef = useRef(timeRunningState);
  timeRunningStateRef.current = timeRunningState;
  const userRef = useRef(user);
  userRef.current = user;
  const selectedTaskRef = useRef(selectedTask);
  selectedTaskRef.current = selectedTask;
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const [idleContinous, setIdleContinous] = useState(0);
  const idleContinousRef = useRef(idleContinous);
  async function makeSession() {
    try {
      const response = await createReport({
        memberName: userRef.current?.fullName,
        date: new Date().toISOString().slice(0, 10),
        taskName: selectedTaskRef.current?.taskName,
        timeTracked: timeDifference(
          sessionRef.current?.startTime,
          getDateAndTime()
        ),
        startTime: sessionRef.current?.startTime,
        endTime: getDateAndTime(),
        screenshot: sessionRef.current?.session,
        idleTime: timeref.current,
        workspaceId: userRef.current?.workspaceId,
        projectId: selectedTaskRef.current?.projectId,
        taskId: selectedTaskRef.current?.taskId,
      });
      const data = response.data;
      console.log("data: ", data);
      dispatch(setResetSession(true));
      dispatch(setStartTime(getDateAndTime()));
      timeref.current = 0;
    } catch (error) {
      console.log(error);
    }
  }
  const dispatch = useDispatch();
  const handleMinimizeScreen = () => {
    ipcRenderer.send("minimize-app");
  };
  const hanleFullScreen = () => {
    ipcRenderer.send("full-screen-app");
  };
  ipcRenderer.on("stop_all_timer", function() {
    if (timerRunning) {
      makeSession();
      dispatch(setSession(null));
      dispatch(setTimerRunning(false));
      dispatch(setCurrentTimer(null));
      dispatch(setSessionOn(false));
      dispatch(setLoading(false));
      dispatch(setError(null));
      dispatch(setStartTime(null));
      dispatch(setEndTime(null));
    }
  });

  const handleCloseScreen = () => {
    ipcRenderer.send("close-app");
  };
  async function deleteUserDataFromElectronStore() {
    try {
      const userData = await ipcRenderer.invoke("set_user_data", null);
      return userData;
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteUserTokenFromElectronStore() {
    try {
      const userToken = await ipcRenderer.invoke("set_user_token", null);
      return userToken;
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteUserSessionExpiryFromElectronStore() {
    try {
      const userSessionExpiry = await ipcRenderer.invoke(
        "set_user_session_expiry",
        null
      );
      return userSessionExpiry;
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogoutFunction = () => {
    deleteUserDataFromElectronStore();
    deleteUserTokenFromElectronStore();
    deleteUserSessionExpiryFromElectronStore();
    // dispatch everything to thier initial state
    dispatch(setUserData(null));
    dispatch(setUserExpiry(null));
    dispatch(setUserToken(null));
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
  console.log("timerRunning: ", timerRunning);
  return (
    <>
      <Navbar className="navbar_body" onDoubleClick={hanleFullScreen}>
        <Navbar.Brand>
          <img src={Logo} className="logo-nav" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className=" justify-content-end">
          <Navbar.Text>
            <div className="nav-icon">
              <FiLogOut
                color="white"
                title={
                  timerRunning === true
                    ? "Please stop the timer to logout"
                    : "Logout"
                }
                onClick={
                  timerRunning === true ? () => {} : handleLogoutFunction
                }
              />
            </div>
          </Navbar.Text>
          <Navbar.Text>
            <div className="nav-icon" onClick={handleMinimizeScreen}>
              <FaRegWindowMinimize color="white" />
            </div>
          </Navbar.Text>
          <Navbar.Text>
            <div className="nav-icon" onClick={hanleFullScreen}>
              <BiFullscreen color="white" />
            </div>
          </Navbar.Text>
          <Navbar.Text>
            <div className="nav-icon">
              <AiOutlineClose color="white" onClick={handleCloseScreen} />
            </div>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default NavbarComp;
