import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import IconStoped from "../assets/btnrecord.png";
// import IconPlay from "../assets/Icons/play.png";
import { MdTask } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentTask } from "../actions/currentTask";
import { setProjects } from "../actions/projects";
import { setSelectedTask } from "../actions/selectedTask";
import { setTasks } from "../actions/tasks";
import createTask from "../apiservices/CreateTask";
import { fetchProjects } from "../apiservices/FetchProjects";
import TaskTable from "./TaskTable";

import { Button, Modal } from "antd";

function TasksDescription() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [completed, setCompleted] = useState(false);
  const [taskName, setTaskName] = useState("");
  const navigate = useNavigate();
  const currentProject = useSelector(
    (state) => state.currentProject.currentProject
  );
  const currentTask = useSelector((state) => state.currentTask.currentTask);
  const { timerRunning, timeElapsed, currentTimer, session } = useSelector(
    (state) => state.session
  );
  const selectedTask = useSelector((state) => state.selectedTask.selectedTask);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  const [search, setSearch] = useState("");
  const convertToDateFormat = (date) => {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const newDate = day + "/" + month + "/" + year;
    return newDate;
  };

  const handleTaskCreate = async () => {
    try {
      const response = await createTask({
        userId: user.userId,
        projectId: currentProject.projectId,
        taskName: taskName,
        taskStatus: "ToDo",
        members: [
          {
            userId: user.userId,
            fullName: user.fullName,
            userRole: user.userRole,
          },
        ],
      });
      const data = response.data;
      const projectsData = await fetchProjects();
      const projects = projectsData.data.projects;
      const tasks = projectsData.data.tasks;
      dispatch(setProjects(projects));
      dispatch(setTasks(tasks));
      const filteredTasks = tasks?.filter(
        (task) => task.projectId === currentProject.projectId
      );
      dispatch(setCurrentTask(filteredTasks));
      setTaskName("");
    } catch (error) {
      console.log(error);
    }

    setTaskName("");
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        title={
          <div className="modal_title">
            <MdTask className="modal_title_icon" />
            <h3 className="modal_title_text">Add Task</h3>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}
      >
        <div className="modal_content">
          <input
            className="Task-search-modal"
            type="text"
            placeholder="Enter Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          ></input>
          <Button
            className="modal_add_button"
            onClick={handleTaskCreate}
            style={{
              height: "30px",
            }}
          >
            Add
          </Button>
        </div>
      </Modal>
      <div>
        <div className="task_container">
          <h3 className="task_heading"> Tasks</h3>
        </div>
        <div className="task_container_name_and_completed">
          <h3 className="task_Name_heading"> {currentProject?.projectName}</h3>
        </div>

        <div className="task_container">
          <div className="task_container_dropdown">
            <input
              className="Task-search"
              type="text"
              placeholder="  Search Tasks  "
              onChange={(e) => setSearch(e.target.value)}
            ></input>
            {currentProject && (
              <Button className="add_new_task" onClick={showModal}>
                Add Task
              </Button>
            )}
          </div>
          <div className="checkbox_div">
            <input
              type="checkbox"
              className="task_completed_checkbox"
              onChange={(e) => setCompleted(e.target.checked)}
            ></input>
            <label className="task_completed_label">Show Completed</label>
          </div>
        </div>
      </div>
      {!completed &&
      currentTask?.filter((curr) => {
        if (curr?.taskStatus !== "completed") {
          return curr;
        }
      })?.length === 0 ? (
        <>
          <div className="no_task_container">
            <h3 className="no_task_heading">You have no tasks assigned</h3>
          </div>
        </>
      ) : (
        <>
          <TaskTable
            currentTask={currentTask}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            search={search}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            dispatch={dispatch}
            convertToDateFormat={convertToDateFormat}
            completed={completed}
          />
        </>
      )}
    </>
  );
}

export default TasksDescription;
