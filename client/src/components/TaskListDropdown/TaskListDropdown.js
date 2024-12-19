import AddMemberIcon from "../../assets/Icons/addMember.svg";
import { ProjectDetailsContext } from "../../context/ProjectDetailsContext";
import { TaskContext } from "../../context/TaskContext";
import TaskEdit from "../TaskEditModal/TaskEdit";
import { Avatar, AvatarGroup } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { blue } from "@mui/material/colors";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import { useParams } from "react-router-dom";

function TaskListDropdown({ status }) {
  const ID = useParams();
  const projectId = ID.projectid;
  const [completedList, setCompletedList] = useState(true);
  const [taskEdit, setTaskEdit] = useState(false);
  const [Task, setTask] = useState("");
  const { getProjectInfo, projectName } = useContext(ProjectDetailsContext);

  const { getTasks, tasks } = useContext(TaskContext);
  useEffect(
    () => {
      getTasks(projectId);
    },
    [projectId],
    tasks,
    taskEdit
  );
  const convertToDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <>
      {taskEdit ? (
        <>
          <TaskEdit
            projectName={projectName}
            Task={Task}
            status={status}
            setTaskEdit={setTaskEdit}
            convertToDate={convertToDate}
            taskEdit={taskEdit}
          />
        </>
      ) : null}
      <div className="border border-primary mt-2 p-2 rounded-md">
        <div
          className="flex space-x-2 items-center cursor-pointer m-2"
          onClick={() => {
            setCompletedList(!completedList);
          }}
        >
          {completedList ? (
            <BsCaretUpFill style={{ color: "#545454" }} />
          ) : (
            <BsCaretDownFill style={{ color: "#545454" }} />
          )}
          <h1
            className="text-xs font-semibold  text-white bg-green-500 p-2 rounded-md"
            style={
              status.statusName === "completed"
                ? { backgroundColor: "#11CE00" }
                : status.statusName === "InProgress"
                ? { backgroundColor: "#E3CC00" }
                : { backgroundColor: "#A4A4A4" }
            }
          >
            {status?.statusName === "completed"
              ? "COMPLETED"
              : status.statusName === "InProgress"
              ? "IN PROGRESS"
              : "TO DO"}
          </h1>
          {/* {status.statusName === "completed" ||
          status.statusName === "others" ? (
            <></>
          ) : (
            <>
              <div className="flex flex-row items-center justify-center space-x-4 ml-auto">
                <img
                  src={require("../../assets/Icons/icon-Trash.png")}
                  alt="File-Attachment"
                  className="w-5 h-5 mt-1 ml-2 mr-1 cursor-pointer"
                  onClick={() => {
                    // removeStatus(status.statusName);
                  }}
                />
              </div>
            </>
          )} */}
        </div>
        {completedList && (
          <>
            {tasks
              ?.filter((currTask) => currTask.taskStatus === status.statusName)
              .map((task) => {
                const dueDate = new Date(task.dueDate);
                const currentDate = new Date();
                let isPastDue = dueDate < currentDate;
                if (
                  status.statusName === "completed" ||
                  task.dueDate === null
                ) {
                  isPastDue = false;
                }

                return (
                  <>
                    <div
                      className="ml-8 my-2 rounded cursor-pointer hover:bg-[#e5e5e5]"
                      onClick={() => {
                        setTaskEdit(!taskEdit);
                        setTask(task);
                      }}
                    >
                      <div
                        className={`border rounded border-primary px-5 py-3 ${
                          isPastDue ? "border-red-500" : ""
                        }`}
                      >
                        <div className="flex flex-row justify-between">
                          <h1
                            className={`text-sx text-black text-left  ${
                              isPastDue ? "text-red-500" : ""
                            }`}
                          >
                            {task.taskName}
                          </h1>
                          <div className="flex flex-row ml-auto">
                            <AvatarGroup max={4}>
                              {task?.members?.map((member) => (
                                <Tooltip
                                  title={member?.fullName}
                                  key={member?._id}
                                >
                                  <Avatar
                                    className={` ${
                                      isPastDue ? "bg-red-500" : ""
                                    }`}
                                    sx={{ bgcolor: blue[500] }}
                                    key={member?._id}
                                  >
                                    <p className="font-medium text-white">
                                      {member?.fullName
                                        ?.split(" ")[0][0]
                                        .toUpperCase()}
                                    </p>
                                  </Avatar>
                                </Tooltip>
                              ))}
                            </AvatarGroup>

                            {task?.members.length === 0 && (
                              <div className="cursor-pointer mr-10 ">
                                <img src={AddMemberIcon} alt="add mage" />
                              </div>
                            )}

                            <div className="w-[80px] m-auto ml-4">
                              <p
                                className={`text-xs text-blue-500 font-bold text-left  ${
                                  isPastDue ? "text-red-500" : ""
                                }`}
                              >
                                {moment(task.dueDate).format("ddd, MMM D") ===
                                "Invalid date"
                                  ? "No Due Date"
                                  : moment(task.dueDate).format("ddd, MMM D")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
          </>
        )}
      </div>
    </>
  );
}

export default TaskListDropdown;
