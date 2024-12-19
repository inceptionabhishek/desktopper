import React from "react";
import { TaskContext } from "../../context/TaskContext";
import TaskListDropdown from "../TaskListDropdown/TaskListDropdown";
function TaskList({ projectStatus, projectId }) {
  return (
    <>
      {projectStatus?.map((status) => {
        return (
          <>
            <TaskListDropdown status={status} />
          </>
        );
      })}
    </>
  );
}

export default TaskList;
