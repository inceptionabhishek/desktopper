import React from "react";
import Spinner from "react-bootstrap/Spinner";
import { AiOutlineCheck } from "react-icons/ai";
import { connect, useDispatch, useSelector } from "react-redux";
import { setCurrentTask } from "../actions/currentTask";
import { setProjects } from "../actions/projects";
import { setSelectedTask } from "../actions/selectedTask";
import { setTasks } from "../actions/tasks";
import { fetchProjects } from "../apiservices/FetchProjects";
import { makeTaskCompleted } from "../apiservices/MakeTaskCompleted";
const { ipcRenderer } = window.require("electron");
function DescriptionViewer({ selectedTask }) {
  const [loader, setLoader] = React.useState(false);
  const dispatch = useDispatch();
  const currentProject = useSelector(
    (state) => state.currentProject.currentProject
  );
  const session = useSelector((state) => state.session);
  const handleMakeCompleted = async () => {
    if (session.timerRunning) {
      await ipcRenderer.invoke("show_timerrunning");
      return;
    }
    try {
      setLoader(true);
      const response = await makeTaskCompleted({
        taskId: selectedTask.taskId,
        taskStatus: "completed",
      });
      const projectsData = await fetchProjects();
      const projects = projectsData.data.projects;
      const tasks = projectsData.data.tasks;
      dispatch(setProjects(projects));
      dispatch(setTasks(tasks));
      const filteredTasks = tasks?.filter(
        (task) => task.projectId === currentProject.projectId
      );
      dispatch(setCurrentTask(filteredTasks));
      dispatch(setSelectedTask(null));
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="">
      <div className="desc_viewer">
        <div className="desc_viewer__content">Task Description</div>
        {selectedTask && (
          <button
            title="Mark This as Completed"
            className="desc_completed__button"
            onClick={handleMakeCompleted}
          >
            <AiOutlineCheck
              size={15}
              style={{
                marginRight: "5px",
              }}
            />
            Complete
            <Spinner
              animation="border"
              role="status"
              hidden={!loader}
              style={{
                height: "15px",
                width: "15px",
                margin: "0 0 0 10px",
              }}
            />
          </button>
        )}
      </div>
      {/* <UpdateButton /> */}
      <hr
        style={{
          height: "1px",
          width: "100%",
        }}
      />
      <div className="Box_description">
        <div className="Box_description__content">
          {selectedTask?.taskDescription
            ? selectedTask?.taskDescription
            : "No Description"}
        </div>
        {selectedTask?.taskStatus && (
          <div className="Box_description__status">
            <p
              className="desc_status"
              style={{
                backgroundColor:
                  selectedTask?.taskStatus === "ToDo"
                    ? "#D8D9DA"
                    : selectedTask?.taskStatus === "InProgress"
                    ? "#F0DE36"
                    : selectedTask?.taskStatus === "Completed"
                    ? "#00B800"
                    : "",
                borderRadius: "25px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {selectedTask?.taskStatus === "ToDo"
                ? "To Do"
                : selectedTask?.taskStatus === "InProgress"
                ? "In Progress"
                : selectedTask?.taskStatus === "Completed"
                ? "Completed"
                : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedTask: state.selectedTask.selectedTask,
  };
};
export default connect(mapStateToProps)(DescriptionViewer);

/*



<div className="desc_viewer__content">
          {selectedTask?.taskDescription}
          <br />
          <p
            className="desc_status"
            style={{
              backgroundColor: "#337CCF",
            }}
          >
            Status: {selectedTask?.taskStatus}
          </p>
        </div>
        {selectedTask && (
          <Button
            title="Mark This as Completed"
            className="desc_completed__button"
            onClick={handleMakeCompleted}
            disabled={session.timerRunning ? true : false}
          >
            completed
            <Spinner
              animation="border"
              role="status"
              hidden={!loader}
              style={{
                height: "15px",
                width: "15px",
                margin: "0 0 0 10px",
              }}
            />
          </Button>
        )}


        */
