import { Dialog } from "@headlessui/react";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { BsChevronLeft } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import Select from "react-select";
import "react-calendar/dist/Calendar.css";
import AddMemberIcon from "../../assets/Icons/addMember.svg";
import { ProjectContext } from "../../context/ProjectContext";
import { ProjectDetailsContext } from "../../context/ProjectDetailsContext";
import { TaskContext } from "../../context/TaskContext";
import { Badge } from "@mui/material";
import { MdClear } from "react-icons/md";
import { useParams } from "react-router-dom";


function TaskEdit({ projectName, Task, status, setTaskEdit, taskEdit }) {
  const { getProjectsMembers } = useContext(ProjectContext);
  const { projectStatus, projectsMembers } = useContext(ProjectDetailsContext);
  const { changeStatus, updateTask, getTasks } = useContext(TaskContext);
  const ID = useParams();
  const projectId = ID.projectid;

  const [calenderOpen, setCalenderOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [dueDate, setDueDate] = useState(Task?.dueDate);
  const [taskStatus, setTaskStatus] = useState(status.statusName);
  const [taskName, setTaskName] = useState(Task.taskName);
  const [taskDescription, setTaskDescription] = useState(Task.taskDescription);
  const [taskMember, setTaskMember] = useState(Task?.members);

  const convertToFormat = (data) => {
    const arr = data.map((item) => {
      return { value: item, label: item.fullName };
    });
    return arr;
  };

  const handleTaskEditFunction = () => {
    Promise.all([
      changeStatus(Task.taskId, taskStatus),
      updateTask(
        Task.taskId,
        taskName,
        taskDescription,
        dueDate,
        taskMember,
        taskStatus
      ),
    ]).then(() => {
      setTaskEdit(false);
      if (!Task.projectId) {
        getTasks(projectId);
      } else {
        getTasks(Task.projectId);
      }
    });
  };

  useEffect(() => {
    getProjectsMembers(Task.projectId);
  }, [projectsMembers]);

  return (
    <Dialog
      open={taskEdit}
      onClose={() => {
        setTaskEdit(false);
      }}
    >
      <div className="items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="my-6">
          {/*content*/}
          <div
            className=" border-0 rounded-lg shadow-lg relative   bg-white outline-none focus:outline-none"
            style={{
              margin: "auto",
              width: "70%",
              height: "70%",
            }}
            onClick={() => {
              setMemberOpen(false);
              setCalenderOpen(false);
            }}
          >
            <div className="flex justify-between p-4">
              <div className="flex space-x-4 items-center">
                <h3 className="text-base font-semibold text-default ">
                  {projectName}
                </h3>
                <BsChevronLeft />
                <h3 className="text-base font-semibold text-default ">
                  {Task.taskName}
                </h3>
              </div>
              <div className="flex flex-row items-center justify-center space-x-5">
                <IoMdClose
                  size={20}
                  className="cursor-pointer"
                  onClick={() => setTaskEdit(false)}
                />
              </div>
            </div>

            <hr className="border-[#CACCCB]" />

            <div className="flex flex-row items-center justify-between bg-[#F6FCFF] p-4">
              <div
                className={`font-bold rounded-lg text-center px-4 py-2 text-white flex justify-start ${
                  taskStatus === "InProgress"
                    ? "bg-[#E3CC00]"
                    : taskStatus === "completed"
                    ? "bg-[#11CE00]"
                    : "bg-[#A4A4A4]"
                }`}
              >
                <select
                  style={{ outline: "none" }}
                  className={`${
                    taskStatus === "InProgress"
                      ? "bg-[#E3CC00]"
                      : taskStatus === "completed"
                      ? "bg-[#11CE00]"
                      : "bg-[#A4A4A4]"
                  }`}
                  onChange={(e) => {
                    setTaskStatus(e.target.value);
                  }}
                  value={taskStatus}
                >
                  {projectStatus?.map((status) => (
                    <option key={status.id}>{status.statusName}</option>
                  ))}
                </select>
              </div>

              <div className="flex">
                <div className="flex flex-row items-center justify-center space-x-1">
                  {taskMember?.map((member) => (
                    <Tooltip title={member?.fullName} key={member?.id} arrow>
                      <div
                        key={member?.id}
                        className="bg-[#0096FB] rounded-3xl py-2 px-4 mx-0.5 text-white cursor-pointer "
                      >
                        {member?.fullName?.charAt(0).toUpperCase()}

                        <Badge
                          className="bg-gray-200 rounded-full px-1 py-1 text-black text-xs flex items-center justify-center hover:bg-red-500 cursor-pointer"
                          overlap="circular"
                          style={{
                            marginTop: "-18px",
                            marginRight: "-16px",
                            zIndex: 9,
                            position: "absolute",
                          }}
                          onClick={() => {
                            setTaskMember((prevMembers) =>
                              prevMembers.filter(
                                (prevMember) =>
                                  prevMember.userId !== member.userId
                              )
                            );
                          }}
                        >
                          <MdClear />
                        </Badge>
                      </div>
                    </Tooltip>
                  ))}

                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMemberOpen((prev) => !prev);
                    }}
                  >
                    <img src={AddMemberIcon} alt="memeber icon" />
                  </div>
                  {memberOpen && (
                    <div
                      className="absolute mt-20"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Select
                        isMulti
                        className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        name="members"
                        value=""
                        options={convertToFormat(projectsMembers).filter(
                          (member) =>
                            !taskMember.some(
                              (existingMember) =>
                                existingMember.fullName ===
                                member.value.fullName
                            )
                        )}
                        classNamePrefix="select"
                        onChange={(selectedOptions) => {
                          const newValues = selectedOptions.map(
                            (item) => item?.value
                          );
                          const uniqueNewValues = newValues.filter(
                            (value) =>
                              !taskMember.some(
                                (existingMember) =>
                                  existingMember.fullName === value.fullName
                              )
                          );

                          setTaskMember([...taskMember, ...uniqueNewValues]);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-10 ">
                <div>
                  <h1 className="modaltitle">CREATED</h1>
                  <h1 className="modaltext mt-2">
                    {moment(Task.createdAt).format("lll")}
                  </h1>
                </div>
                <div>
                  <h1 className="modaltitle">DUE DATE</h1>
                  <h1
                    className="modaltext mt-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCalenderOpen((prev) => !prev);
                    }}
                  >
                    {moment(dueDate).format("lll") === "Invalid date"
                      ? "No Due Date"
                      : moment(dueDate).format("lll")}
                  </h1>
                  {/* {calenderOpen && (
                    <div className="absolute">
                      <Calendar
                        onChange={setDueDate}
                        value={dueDate}
                        minDate={new Date()}
                      />
                    </div>
                  )} */}
                  {calenderOpen && (
                    <div
                      className="absolute right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Calendar
                        onChange={(date) => {
                          setDueDate(date);
                          setCalenderOpen(false);
                        }}
                        value={dueDate}
                        minDate={new Date()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-[#CACCCB]" />
            {/*body*/}

            <div className="border-1 mx-10 mt-10">
              <p className="text-slate-500 text-lg leading-relaxed">
                <input
                  className="w-full text-black font-bold text-2xl border-2 border-slate-200 rounded-md p-5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Task Name"
                  onChange={(e) => {
                    setTaskName(e.target.value);
                  }}
                  value={taskName}
                />
              </p>
              <p className="text-slate-500 mt-4 text-lg leading-relaxed">
                <textarea
                  className="w-full h-[200px] text-gray-500 text-xl border-2 border-slate-200 rounded-md p-5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Task description..."
                  rows={10}
                  onChange={(e) => {
                    setTaskDescription(e.target.value);
                  }}
                  value={taskDescription}
                />
              </p>
              <div className="flex space-x-4 mt-4 justify-end">
                <button
                  className="text-base pt-3 pb-3 rounded-2xl"
                  type="button"
                  onClick={() => setTaskEdit(false)}
                >
                  Cancel
                </button>
                <button
                  className="pt-3 pb-3 pl-10 pr-10 rounded-2xl text-base bg-[#0096FB] text-white my-10"
                  type="button"
                  onClick={handleTaskEditFunction}
                >
                  Save Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </Dialog>
  );
}

export default TaskEdit;