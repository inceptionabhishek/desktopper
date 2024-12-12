import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { setCurrentProject } from "../actions/currentProject";
import { setCurrentTask } from "../actions/currentTask";
import { totalTimeTrackedForProjects } from "../apiservices/TotalTimeTrackedForProjects";
import "./styles.css";
function formatMilliseconds(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return `${hours}:${String(minutes).padStart(2, "0")}`;
}

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

function ProjectsDetails({ projects, tasks, selectedTask }) {
  let projectTimeUpdateVal;
  const [projectTimes, setProjectTimes] = useState({});
  const dispatch = useDispatch();
  const timerRunning = useSelector((state) => state.session.timerRunning);
  const workspaceDetails = useSelector(
    (state) => state.workspaceDetails.workspaceDetails
  );
  const timeTracked = useSelector(
    (state) => state.projectTimeTracked.timeTracked
  );
  const user = useSelector((state) => state.user.user);

  const userProjectsTimeUpdateFunction = async () => {
    const currentDate = getTodayDate();
    const fetchTotalTime = async () => {
      if (projects === null) {
        return;
      }
      console.log("projects", projects);
      const promises = projects?.map((project) =>
        totalTimeTrackedForProjects({
          date: currentDate,
          projectId: project?.projectId,
          userId: user?.userId,
        })
      );
      const responses = await Promise.all(promises);
      const projectTimes = {};
      responses.forEach((response, index) => {
        const time = response?.data?.totalTimeTracked;
        projectTimes[projects[index].projectId] = formatMilliseconds(time);
      });
      setProjectTimes(projectTimes);
    };
    fetchTotalTime();
  };
  useEffect(() => {
    userProjectsTimeUpdateFunction();
  }, [projects, user, timerRunning]);
  useEffect(() => {
    userProjectsTimeUpdateFunction();
  }, [timerRunning]);
  return (
    <>
      <div className="company">
        <h3 className="company-name">{workspaceDetails?.workspaceName}</h3>
      </div>
      <div className="projects_list">
        {projects?.length > 0 ? (
          projects?.map((project) => (
            <>
              <div
                className="project"
                key={project.projectId}
                style={{
                  backgroundColor:
                    selectedTask?.projectId === project.projectId
                      ? "rgba(0, 150, 235, 1)"
                      : "",
                  color:
                    selectedTask?.projectId === project.projectId
                      ? "#FFFFFF"
                      : "#000000",
                }}
                onClick={() => {
                  const filteredTasks = tasks?.filter(
                    (task) => task?.projectId === project?.projectId
                  );
                  dispatch(setCurrentProject(project));
                  dispatch(setCurrentTask(filteredTasks));
                }}
              >
                <div className="project-name">{project?.projectName}</div>
                <div className="timer_details">
                  {projectTimes[project.projectId] || "Loading..."}
                </div>
              </div>
            </>
          ))
        ) : (
          <div className="no-projects">
            Please add projects to your workspace from Dashboard.
          </div>
        )}
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects.projects,
    tasks: state.tasks.tasks,
    selectedTask: state.selectedTask.selectedTask,
  };
};

export default connect(mapStateToProps)(ProjectsDetails);
