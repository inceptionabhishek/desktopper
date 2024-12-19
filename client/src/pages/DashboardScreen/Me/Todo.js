import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../../context/AuthContext";
import { TaskContext } from "../../../context/TaskContext";

const TimeSheet = () => {
  const { user } = useContext(AuthContext);
  const { tasks, viewTasks } = useContext(TaskContext);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    viewTasks(user?.userId);
  }, []);

  useEffect(() => {
    // Handle the case when tasks is undefined or null
    if (tasks || tasks.length !== 0) {
      const allTasks = tasks?.flatMap((task) => {
        return task?.tasks?.map((item) => ({
          ...item,
          projectName: task?.projectName,
        }));
      });
      const myTasks = allTasks?.filter(
        (item) => !item?.completed && item?.createdBy === user?.userId
      );
      myTasks.sort((task1, task2) => {
        const dueDate1 = task1?.dueDate
          ? new Date(task1?.dueDate).getTime()
          : Number.MAX_SAFE_INTEGER;
        const dueDate2 = task2?.dueDate
          ? new Date(task2?.dueDate).getTime()
          : Number.MAX_SAFE_INTEGER;

        return dueDate1 - dueDate2;
      });
      setFilteredTasks(myTasks);
    }
  }, [tasks]);

  function isLastElementInGroup(index, array) {
    return index === array.length - 1;
  }

  function checkAllTasksEmpty(projects) {
    for (const project of projects) {
      if (project?.tasks?.length > 0) {
        for (const task of project?.tasks) {
          if (task?.createdBy === user?.userId) {
            return false;
          }
        }
      }
    }
    return true;
  }

  return (
    <>
      <div
        className={`w-full border-t border-l border-r border-gray-400 border-opacity-50 mb-10 rounded-lg overflow-auto shadow-md`}
      >
        <div className="flex sticky top-0 bg-white w-full h-20 justify-between  border-b border-gray-400 border-opacity-50">
          <p className="flex ml-4 justify-center items-center text-gray-500 font-medium">
            TO DOS
          </p>

          {/* <Link
            to="/dashboard/reports"
            className="flex mr-4 justify-center items-center text-blue-400 cursor-pointer hover:text-blue-500 font-medium"
          >
            View Report
          </Link> */}
        </div>
        {tasks?.length === 0 ||
        filteredTasks?.length === 0 ||
        checkAllTasksEmpty(tasks) ? (
          <div className="w-full h-40 flex justify-center items-center">
            <p className="text-gray-500 text-lg">No records found</p>
          </div>
        ) : (
          <table className="table-fixed w-[95%] mx-auto">
            <thead className="w-full sticky top-20 bg-white h-16 border-b border-gray-400 border-opacity-50">
              <tr>
                <th className="timesheettitle text-left">Project</th>
                <th className="timesheettitle text-left">To Do</th>
                <th className="timesheettitle">Time recorded</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks
                ?.slice(0, 10)
                .filter(
                  (item) => !item?.completed && item?.createdBy === user?.userId
                ) // Filter tasks where completed is false
                .map((item, columnIndex, taskArray) => (
                  <tr
                    key={columnIndex}
                    className={`h-16 border-b ${
                      isLastElementInGroup(columnIndex, filteredTasks) ||
                      columnIndex === 9
                        ? "border-white"
                        : "border-gray-400 border-opacity-50"
                    }`}
                  >
                    <td className="timesheettext overflow-auto scrollbar-hide">{item?.projectName}</td>
                    <td className="timesheettext">{item?.taskName}</td>
                    <td className="text-center timesheettext">
                      {item?.totalTimeTaken}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default TimeSheet;
