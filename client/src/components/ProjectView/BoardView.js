import React, { useContext, useEffect } from "react";
import { TaskContext } from "../../context/TaskContext";
import KanbanBoard from "./KanbanBoard";
function BoardView({ projectStatus, projectId, ListModal }) {
  const { getTasks, tasks } = useContext(TaskContext);

  useEffect(() => {
    getTasks(projectId);
  }, []);

  const getDataInFormat = (projectStatus, tasks) => {
    const data = {
      columns: {},
      columnOrder: [],
    };
    projectStatus?.forEach((status) => {
      data.columns[status?.statusName] = {
        id: status?.statusName,
        title: status?.statusName,
        taskIds: [],
      };
      data.columnOrder.push(status.statusName);
    });
    tasks?.forEach((task) => {
      data.columns[task?.taskStatus].taskIds?.push({
        id: task.taskId,
        name: task.taskName,
      });
    });
    return data;
  };
  return (
    <>
      <KanbanBoard
        initialData={getDataInFormat(projectStatus, tasks)}
        projectId={projectId}
        ListModal={ListModal}
        projectName={projectStatus[0]?.projectName}
      />
    </>
  );
}

export default BoardView;
