import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createScreenshot } from "../apiservices/CreateScreenshots";
import { createReport } from "../apiservices/CreateSession";
import TimerLogo from "../assets/btnrecord.png";
import ProjectsDetails from "./ProjectsDetails";
import "./styles.css";

import {
  setCurrentTimer,
  setEndTime,
  setIdleTime,
  setResetSession,
  setSession,
  setSessionOn,
  setStartTime,
  setTimeElapsed,
  setTimerRunning,
} from "../actions/session";
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
function formatMilliseconds(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return `${hours}:${String(minutes).padStart(2, "0")}`;
}
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

function Projects() {
  const [idleTimerArray, setIdleTimerArray] = useState([]);
  const idleTimerArrayRef = useRef(idleTimerArray);
  const [activeAgain, setActiveAgain] = useState(false);
  const [buttonClick, setButtonClick] = useState(false);
  let idleTimeout;
  let timeoutval, apitimeoutval;
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
  const [waitForUserResponse, setWaitForUserResponse] = useState(false);
  const waitForUserResponseRef = useRef(waitForUserResponse);

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
  const dispatch = useDispatch();
  const [idleContinous, setIdleContinous] = useState(0);
  const idleContinousRef = useRef(idleContinous);

  async function countTotalIdleTime(array) {
    let totalIdleTime = 0;
    for (let i = 0; i < array.length; ) {
      if (array[i] > 0) {
        let j = i + 1;
        let currmax = array[i];
        while (j < array.length && array[j] > 0) {
          currmax = Math.max(currmax, array[j]);
          j++;
        }
        totalIdleTime += currmax;
        i = j;
      } else {
        i++;
      }
    }
    return totalIdleTime;
  }
  async function makeSession() {
    console.log(idleTimerArrayRef.current);
    try {
      let idlevalue = await countTotalIdleTime(idleTimerArrayRef.current);
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
        idleTime: idlevalue,
        workspaceId: userRef.current?.workspaceId,
        projectId: selectedTaskRef.current?.projectId,
        taskId: selectedTaskRef.current?.taskId,
      });
      const data = response.data;
      console.log("data: ", data);
      dispatch(setResetSession(true));
      dispatch(setStartTime(getDateAndTime()));
      // reset idle timer array
      setIdleTimerArray([]);
      idleTimerArrayRef.current = [];
      timeref.current = 0;
    } catch (error) {
      console.log(error);
    }
  }
  const makeScreenshot = async (base64Data) => {
    const screenshot = await createScreenshot({ screenshot: base64Data });
    const screenshotTime = getDateAndTime();
    console.log("screenshot: ", screenshot.data.screenshotUrl);
    dispatch(
      setSession({
        screenshotUrl: screenshot.data.screenshotUrl,
        screenshotTime: screenshotTime,
      })
    );
  };
  const getDesktopSources = async (opts) => {
    const sources = await ipcRenderer.invoke(
      "DESKTOP_CAPTURER_GET_SOURCES",
      opts
    );

    return sources;
  };

  function captureScreenshotAndSend() {
    if (timeRunningStateRef.current === false) {
      return;
    }
    (async () => {
      const sources = await getDesktopSources({
        types: ["screen", "window"],
        thumbnailSize: {
          width: 700,
          height: 400,
        },
      });
      console.log("sources: ", sources);
      const source = sources[0];
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: source.id,
            minWidth: 1920,
            maxWidth: 1920,
            minHeight: 1080,
            maxHeight: 1080,
          },
        },
      });
      const videoTrack = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);
      const bitmap = await imageCapture.grabFrame();
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bitmap, 0, 0);
      const base64Data = canvas.toDataURL("image/png");
      ipcRenderer.send("screenshot-captured", base64Data);
      if (
        timeRunningStateRef.current === true &&
        currentProject?.projectId !== null &&
        selectedTask?.taskId !== null &&
        user?.userId !== null
      ) {
        makeScreenshot(base64Data);
        await ipcRenderer.invoke("screenshot_notification");
      }
    })();
  }
  function myFunc() {
    return new Promise((resolve, reject) => {
      const systemIdleTime = ipcRenderer.invoke("systemIdleTime");
      resolve(systemIdleTime);
    });
  }
  async function showIdleMessage() {
    const response = await ipcRenderer.invoke("show_idle_message");
    return response;
  }
  async function getSystemIdleState() {
    try {
      const systemIdleTime = await myFunc();

      if (timeRunningStateRef.current === true) {
        idleContinousRef.current = systemIdleTime;
      }
      if (timeRunningStateRef.current === true) {
        idleTimerArrayRef.current.push(systemIdleTime);
      }
      if (
        idleContinousRef.current > 270 &&
        timeRunningStateRef.current === true
      ) {
        setWaitForUserResponse(false);
        waitForUserResponseRef.current = false;
        setIdleContinous(0);
        setTimeRunningState(false);
        dispatch(setTimerRunning(false));
        dispatch(setEndTime(getDateAndTime()));
        dispatch(setSessionOn(false));
        dispatch(setCurrentTimer(null));
        makeSession();
        clearInterval(currentTimer);
        setTime(0);
        setIdleContinous(0);
        const response = await showIdleMessage(); // Wait for the promise to resolve
        console.log("response: ", response);
        if (response === true) {
          setButtonClick(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if (buttonClick === true) {
      setButtonClick(false);
      projectTimerStarted();
      const startTime = Date.now() - timeElapsed;
      const timer = setInterval(() => {
        if (timeRunningStateRef.current === true) {
          dispatch(setTimeElapsed(Date.now() - startTime));
        } else {
          clearInterval(timer);
        }
      }, 1000);
      setTime(0);
      setTimeRunningState(true);
      dispatch(setResetSession());
      dispatch(setCurrentTimer(timer));
      dispatch(setSessionOn(true));
      dispatch(setStartTime(getDateAndTime()));
      dispatch(setTimerRunning(true));
      dispatch(setEndTime(null));
      dispatch(setIdleTime(0));
    }
  }, [buttonClick]);
  const projectTimerStarted = async () => {
    await ipcRenderer.invoke(
      "project_time_tracker_start",
      selectedTask?.taskName
    );
  };
  const projectTimerStoped = async () => {
    await ipcRenderer.invoke(
      "project_time_tracker_ended",
      selectedTask?.taskName
    );
  };
  const handleTimerClick = () => {
    if (timerRunning) {
      projectTimerStoped();
      dispatch(setTimerRunning(false));
      dispatch(setEndTime(getDateAndTime()));
      dispatch(setSessionOn(false));
      dispatch(setCurrentTimer(null));
      makeSession();
      clearInterval(currentTimer);
      setTimeRunningState(false);
      setTime(0);
    } else {
      projectTimerStarted();
      const startTime = Date.now() - timeElapsed;
      const timer = setInterval(() => {
        if (timeRunningStateRef.current === true) {
          dispatch(setTimeElapsed(Date.now() - startTime));
        } else {
          clearInterval(timer);
        }
      }, 1000);
      setTime(0);
      setTimeRunningState(true);
      dispatch(setResetSession());
      dispatch(setCurrentTimer(timer));
      dispatch(setSessionOn(true));
      dispatch(setStartTime(getDateAndTime()));
      dispatch(setTimerRunning(true));
      dispatch(setEndTime(null));
      dispatch(setIdleTime(0));
    }
  };
  useEffect(() => {
    timeoutval = setInterval(captureScreenshotAndSend, 600000);
    return () => {
      clearInterval(timeoutval);
    };
  }, []);
  useEffect(() => {
    apitimeoutval = setInterval(() => {
      if (timeRunningStateRef.current === true) {
        makeSession();
      }
    }, 900000);
    return () => {
      clearInterval(apitimeoutval);
    };
  }, []);
  useEffect(() => {
    idleTimeout = setInterval(getSystemIdleState, 1000);
    return () => {
      clearInterval(idleTimeout);
    };
  }, []);
  return (
    <div className="projects">
      <div className="timer">
        <div className="tracker">
          <div className="tracker__display">
            {timerRunning ? (
              <img
                src={TimerLogo}
                alt="TimerLogo"
                onClick={selectedTask === null ? () => {} : handleTimerClick}
                className="timerLogo"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="26"
                viewBox="0 0 24 26"
                className="timerLogo"
                onClick={selectedTask === null ? () => {} : handleTimerClick}
              >
                <path
                  d="M21.7612 9.69115C22.3616 10.0104 22.8638 10.487 23.214 11.0699C23.5642 11.6527 23.7492 12.3199 23.7492 12.9999C23.7492 13.6799 23.5642 14.347 23.214 14.9299C22.8638 15.5128 22.3616 15.9894 21.7612 16.3086L5.74625 25.0174C3.1675 26.4199 0 24.5949 0 21.7099V4.29115C0 1.40365 3.1675 -0.420104 5.74625 0.981146L21.7612 9.69115Z"
                  fill="#617989"
                />
              </svg>
            )}
          </div>
          <div className="tracker__controls">
            <button className="tracker__controls__button">
              {formatTime(timeElapsed)}
            </button>
          </div>
        </div>
        <div className="proj-Name-cont">
          <h3 className="project-Name">{currentProject?.projectName}</h3>
          <br />
        </div>
        <div className="proj-Name-cont">
          <h3 className="task-Name">{selectedTask?.taskName}</h3>
        </div>
        <div className="project-limits">
          <div className="limit_details">
            {selectedTask?.dueDate === null || selectedTask === null ? (
              <p>No Limits</p>
            ) : (
              <p>{selectedTask?.dueDate}</p>
            )}
          </div>
          <div className="divider" />
          <div className="limit_time">
            <p>Today : {formatMilliseconds(timeElapsed)}</p>
          </div>
        </div>
        <div className="horizontal-line" />
      </div>
      <ProjectsDetails />
    </div>
  );
}

export default Projects;
