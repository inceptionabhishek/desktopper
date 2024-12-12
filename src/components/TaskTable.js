import React from "react";
import { useSelector } from "react-redux";
function TaskTable({
  currentTask,
  selectedTask,
  setSelectedTask,
  search,
  handleMouseEnter,
  handleMouseLeave,
  dispatch,
  convertToDateFormat,
  completed,
}) {
  const timerRunning = useSelector((state) => state.session.timerRunning);
  return (
    <div className="table_details">
      <table className="table table-hover ">
        <thead>
          <th>TASK</th>
          <th>DUE DATE</th>
          <th>CREATED DATE</th>
          <th>UPDATED AT</th>
        </thead>
        <tbody>
          {currentTask
            ?.filter((curr) => {
              if (search === "") {
                return curr;
              } else if (
                curr.taskName.toLowerCase().includes(search.toLowerCase())
              ) {
                return curr;
              }
            })
            ?.filter((curr) => {
              if (completed === true) {
                return curr.taskStatus === "completed";
              } else {
                return curr.taskStatus !== "completed";
              }
            })
            .map((task, index) => (
              <tr
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  if (completed === true) return;
                  dispatch(setSelectedTask(task));
                  // handleTimerClick();
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <td
                  style={{
                    backgroundColor:
                      selectedTask?.taskId === task.taskId
                        ? "rgba(0, 150, 235, 1)"
                        : "#FFFFFF",
                    color: selectedTask?.taskId === task.taskId ? "#fff" : "",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: "24px",
                    fontWeight: "500",
                  }}
                >
                  {task.taskName}
                </td>
                <td
                  style={{
                    backgroundColor:
                      selectedTask?.taskId === task.taskId
                        ? "rgba(0, 150, 235, 1)"
                        : "#FFFFFF",
                    color: selectedTask?.taskId === task.taskId ? "#fff" : "",
                    fontWeight:
                      selectedTask?.taskId === task.taskId ? "" : "bold",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: "24px",
                    fontWeight: "500",
                  }}
                >
                  {task?.dueDate
                    ?.split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-")}
                </td>
                <td
                  style={{
                    backgroundColor:
                      selectedTask?.taskId === task.taskId
                        ? "rgba(0, 150, 235, 1)"
                        : "#FFFFFF",
                    color: selectedTask?.taskId === task.taskId ? "#fff" : "",
                    fontWeight:
                      selectedTask?.taskId === task.taskId ? "" : "bold",
                    fontWeight:
                      selectedTask?.taskId === task.taskId ? "" : "bold",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: "24px",
                    fontWeight: "500",
                  }}
                >
                  {task?.createdAt
                    ?.split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-")}
                </td>
                <td
                  style={{
                    backgroundColor:
                      selectedTask?.taskId === task.taskId
                        ? "rgba(0, 150, 235, 1)"
                        : "#FFFFFF",
                    color: selectedTask?.taskId === task.taskId ? "#fff" : "",
                    fontWeight:
                      selectedTask?.taskId === task.taskId ? "" : "bold",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: "24px",
                    fontWeight: "500",
                  }}
                >
                  {task?.createdAt
                    ?.split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-")}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskTable;
