import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentProject } from "../actions/currentProject";
import { setCurrentTask } from "../actions/currentTask";
import { setLastUpdated } from "../actions/lastUpdatedStatus";
import { setProjects } from "../actions/projects";
import { setSelectedTask } from "../actions/selectedTask";

import {
  setCurrentTimer,
  setEndTime,
  setError,
  setIdleTime,
  setLoading,
  setSession,
  setSessionOn,
  setStartTime,
  setTimeElapsed,
  setTimerRunning,
} from "../actions/session";
import { setTasks } from "../actions/tasks";
import { fetchProjects } from "../apiservices/FetchProjects";
import { fetchTotalTime } from "../apiservices/FetchTodayTotalTime";
import { MdOutlineBrowserUpdated } from "react-icons/md";
import refreshIcon from "../assets/Icons/refresh.png";
import UpdateModal from "./UpdateModal";
const { ipcRenderer } = window.require("electron");
function Footer() {
  const [appVersion, setAppVersion] = React.useState(null); // [1
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const lastUpdated = useSelector(
    (state) => state.lastUpdatedStatus.lastUpdated
  );
  const currentTask = useSelector((state) => state.currentTask.currentTask);
  const currentProject = useSelector(
    (state) => state.currentProject.currentProject
  );
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  async function getProjectsAndData() {
    try {
      const response = await fetchProjects();
      const data = response.data;
      const projects = data.projects;
      const tasks = data.tasks;
      dispatch(setProjects(projects));
      dispatch(setTasks(tasks));
      if (projects.length === 0) {
        dispatch(setSelectedTask(null));
        dispatch(setCurrentProject(null));
        dispatch(setCurrentTask(null));
        dispatch(setCurrentTimer(null));
        dispatch(setSession(null));
        dispatch(setTimerRunning(false));
        dispatch(setSessionOn(false));
        dispatch(setLoading(false));
        dispatch(setError(null));
        dispatch(setStartTime(null));
        dispatch(setEndTime(null));
        dispatch(setIdleTime(null));
        return;
      }
      // check if current project is still in the list of projects
      const filteredProjects = projects?.filter(
        (project) => project.projectId === currentProject.projectId
      );
      if (filteredProjects.length === 0) {
        dispatch(setSelectedTask(null));
        dispatch(setCurrentProject(null));
        dispatch(setCurrentTask(null));
        dispatch(setCurrentTimer(null));
        dispatch(setSession(null));
        dispatch(setTimerRunning(false));
        dispatch(setSessionOn(false));
        dispatch(setLoading(false));
        dispatch(setError(null));
        dispatch(setStartTime(null));
        dispatch(setEndTime(null));
        dispatch(setIdleTime(null));
        return;
      }

      const filteredTasks = tasks?.filter(
        (task) => task.projectId === currentProject.projectId
      );
      dispatch(setCurrentTask(filteredTasks));
    } catch (error) {
      console.error(error);
    }
  }
  async function fetchTotalTimeForToday() {
    try {
      const res = await fetchTotalTime({ userId: user?.userId });
      const data = res.data;
      dispatch(setTimeElapsed(data.totalTimeTracked));
    } catch (error) {
      console.error(error);
    }
  }
  const handlStateFetchAndFetched = () => {
    dispatch(setLastUpdated(new Date().toLocaleString()));
    getProjectsAndData();
    fetchTotalTimeForToday();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getVersion = async () => {
    const appVersion = await ipcRenderer.invoke("get_current_app_version");
    return appVersion;
  };

  return (
    <>
      <div className="footer">
        <img
          title="Refresh"
          src={refreshIcon}
          alt="Logo"
          className="refresh-icon"
          onClick={handlStateFetchAndFetched}
        />
        {user && (
          <p className="last-updated">Last Updated at: {lastUpdated} </p>
        )}
        {/* <div className="last-updated-icon-container">
          <MdOutlineBrowserUpdated
            className="last-updated-icon"
            title="check for updates"
            onClick={() => {
              setIsModalOpen(true);
            }}
          />
        </div> */}
        {/* <p className="last-updated">Version: {appVersion}</p> */}
      </div>
      {isModalOpen && (
        <>
          <UpdateModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            handleCancel={handleCancel}
          />
        </>
      )}
    </>
  );
}
export default Footer;
