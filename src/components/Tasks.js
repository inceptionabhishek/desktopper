import React from "react";

import DescriptionViewer from "./DescriptionViewer";
import TasksDescription from "./TasksDescription";

function Tasks() {
  return (
    <div className="taskcontainer">
      <div className="task-details">
        <TasksDescription />
      </div>
      <div className="task_details_desc">
        <DescriptionViewer />
      </div>
    </div>
  );
}

export default Tasks;
