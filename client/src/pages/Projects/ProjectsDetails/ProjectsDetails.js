import AddMemberIcon from "../../../assets/Icons/addMember.svg";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import BoardView from "../../../components/ProjectView/BoardView";
import ListView from "../../../components/ProjectView/ListView";
import ProjectRow from "../../../components/TableRow/ProjectRow";
import TaskEditModal from "../../../components/TaskEditModal/TaskEditModal";
import { ProjectContext } from "../../../context/ProjectContext";
import { ProjectDetailsContext } from "../../../context/ProjectDetailsContext";
import { TaskContext } from "../../../context/TaskContext";
import { WorkSpaceContext } from "../../../context/WorkspaceContext";
import ProjectPage from "../../../skeletonUi/ProjectPage";
import ProjectsDetailsSkeleton from "../../../skeletonUi/ProjectsDetailsSkeleton";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Avatar, AvatarGroup, Badge, MenuItem, Tooltip } from "@mui/material";
import MuiSelect from "@mui/material/Select";
import React, { Fragment, useContext, useEffect } from "react";
import { useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BsListUl, BsClipboard } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Select, { components } from "react-select";

function ProjectsDetails() {
  const [removeMemberPopUp, setRemoveMemberPopUp] = useState(false);
  const selectRef = React.useRef();
  const [memberOpen, setMemberOpen] = useState(false);
  const userRole = JSON.parse(localStorage.getItem("team-hub-user")).userRole;
  const ID = useParams();
  const projectId = ID.projectid;
  const [listOpen, setListOpen] = useState(true);
  const [activeTab, setactiveTab] = useState(false);
  const { getTasks, tasks, createTask, taskEditModal, setTaskEditModal } =
    useContext(TaskContext);
  const { getProjectsMembers, addMembersToProjects, isUserAssignedToProject } =
    useContext(ProjectContext);
  const [editAddProjectsMembers, setEditAddProjectsMembers] = useState([]);
  const {
    getProjectInfo,
    projectName,
    projectStatus,
    projectsMembers,
    addStatusToProject,
    isLoading,
  } = useContext(ProjectDetailsContext);
  const { workspaceMembers } = useContext(WorkSpaceContext);
  const [editmodal, setEditmodal] = useState(false);
  const [ListModal, setListModal] = useState(false);
  const [ListName, setListName] = useState("");
  const [listTab, setListTab] = useState(true);
  const [boardTab, setBoardTab] = useState(false);
  const [loadAgain, setLoadAgain] = useState(false);
  const [isMember, setIsMemeber] = useState(false);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    getProjectsMembers(projectId);
    getTasks(projectId);
    getProjectInfo(projectId);
    setLoader(false);
  }, [isUserAssignedToProject]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  const handleCreateTask = (data) => {
    setIsMemeber(false);
    if (editAddProjectsMembers.length > 0) {
      createTask({
        taskName: data?.taskName,
        taskDescription: data?.taskDescription,
        projectId: projectId,
        projectsMembers: changeToFormatMembers(editAddProjectsMembers),
        taskStatus: data?.taskStatus,
        dueDate: data?.dueDate,
      })
        .then(() => {
          setLoadAgain(!loadAgain);
          setTaskEditModal(false);
          getTasks(projectId);
        })
        .catch(() => {});
    } else {
      toast.error("Please add atleast one member to create Task!");
      return;
    }
  };

  const handleAddMembers = () => {
    addMembersToProjects(
      projectId,
      changeToFormatMembers(editAddProjectsMembers),
      setEditAddProjectsMembers,
      getProjectsMembers,
      setTaskEditModal
    )
      .then(() => {
        setEditAddProjectsMembers([]);
        getProjectsMembers(projectId);
      })
      .catch((e) => {});
    setTaskEditModal(false);
  };
  const convertToFormat = (data) => {
    const arr = data.map((item) => {
      return { value: item, label: item.fullName };
    });
    return arr;
  };
  const changeToFormatMembers = (data) => {
    const arr = data.map((item) => {
      return item.value;
    });
    return arr;
  };
  const getAllMemberTitle = (members) => {
    let allMembers = "";
    members.map((member) => {
      allMembers += member.label + ", ";
    });
    return allMembers;
  };
  const handleStatusCreate = () => {
    addStatusToProject(ListName, projectId);
    setListName("");
    getProjectsMembers(projectId);
    getTasks(projectId);
    getProjectInfo(projectId);
    setListModal(false);
  };
  const Option = (props) => (
    <div>
      <components.Option {...props} />
      <button>&#x2716; {/* Unicode for "✖" (multiplication sign) */}</button>
    </div>
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  useEffect(() => {
    console.log("111", editAddProjectsMembers);
  }, [editAddProjectsMembers]);
  return (
    <>
      {editmodal && (
        <TaskEditModal
          taskEditModal={editmodal}
          setTaskEditModal={setEditmodal}
          editProjectId=""
          editTaskId=""
          editTaskName=""
          editTaskDescription=""
          editTaskMembers={[]}
        />
      )}
      {isLoading ? (
        <ProjectsDetailsSkeleton />
      ) : (
        <div className="px-14 py-10">
          <div>
            <div className="flex items-center mb-12">
              <h2 className="dashboard-container-heading">{projectName}</h2>
              <button className="bg-green-500 h-[30px] flex items-center justify-center   text-white rounded-md p-3 ml-10">
                Active
              </button>
            </div>

            <div className="flex flex-row mb-10">
              <button
                onClick={() => setactiveTab(false)}
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                }}
                className={`tab ${activeTab === false ? "tab-active" : ""}`}
              >
                TASKS ({tasks?.length})
              </button>
              <button
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                }}
                onClick={() => setactiveTab(true)}
                className={`tab ${activeTab === true ? "tab-active" : ""}`}
              >
                MEMBERS ({projectsMembers?.length})
              </button>
              <div className="flex flex-row items-center justify-center space-x-4 ml-auto">
                <div
                  className="flex items-center justify-center cursor-pointer space-x-3"
                  style={{
                    color: listTab ? "rgba(0, 150, 235, 1)" : "gray",
                  }}
                  onClick={() => {
                    setBoardTab(false);
                    setListTab(true);
                  }}
                >
                  <BsListUl />
                  <h1 className="text-lg font-bold">List</h1>
                </div>

                <span className="border-r-2 border-gray-500 h-8"></span>

                <div
                  className="flex items-center justify-center cursor-pointer space-x-3"
                  style={{
                    color: boardTab ? "rgba(0, 150, 235, 1)" : "gray",
                  }}
                  onClick={() => {
                    setBoardTab(true);
                    setListTab(false);
                  }}
                >
                  <BsClipboard />
                  <h1 className="text-lg font-bold">Board</h1>
                </div>
              </div>
            </div>
          </div>
          {activeTab && (
            <>
              <div
                className="flex justify-end w-[100%] py-11 mt-[-50px]"
                style={{ zoom: "90%" }}
              >
                {userRole === "admin" || userRole === "manager" ? (
                  <Link
                    className="invite-member-btn"
                    onClick={() => {
                      setTaskEditModal(true);
                    }}
                  >
                    Add Members
                  </Link>
                ) : null}

                {taskEditModal ? (
                  <Dialog
                    open={taskEditModal}
                    onClose={() => {
                      setTaskEditModal(false);
                    }}
                  >
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                      {/* <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" /> */}
                      <div className="relative my-6">
                        {/*content*/}
                        <div className="w-[500px] border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                          {/*header*/}
                          <p className=" m-10 text-3xl font-semibold text-default ml-10 mt-[70px]">
                            Add Members
                          </p>
                          {/*body*/}
                          <div
                            className="relative p-6 flex-auto"
                            styles={{
                              width: "500px",
                            }}
                          >
                            <p className=" text-slate-500 text-lg leading-relaxed ml-auto">
                              {/* <h1 className="mb-4 text-black font-bold ml-10  text-lg leading-relaxed">
                                Add Members
                              </h1> */}
                              <div className="mb-6 ml-5 mr-5">
                                <Select
                                  isMulti
                                  name="members"
                                  styles={{
                                    width: "500px",
                                  }}
                                  options={convertToFormat(workspaceMembers)}
                                  classNamePrefix="select"
                                  onChange={(e) => {
                                    setEditAddProjectsMembers(e);
                                  }}
                                />
                              </div>
                            </p>
                          </div>
                          {/*footer*/}
                          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                              className="text-base pt-3 pb-3 rounded-2xl"
                              type="button"
                              onClick={() => setTaskEditModal(false)}
                            >
                              Cancel
                            </button>
                            <button
                              className="w-32 h-12 ml-5 rounded-[16px] bg-[#0096EB] text-white hover:cursor-pointer px-4 py-2"
                              type="button"
                              onClick={handleAddMembers}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                  </Dialog>
                ) : null}
              </div>
              {
                <div
                  className="border-2 border-[#ebeaea] p-3 rounded-lg  "
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <table className="table-fixed w-[100%] rounded">
                    <thead className="border-b-2 border-[#ebeaea]">
                      <tr>
                        <th className="py-2">Name</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Role</th>
                      </tr>
                    </thead>

                    <tbody>
                      {projectsMembers?.length > 0 &&
                        projectsMembers.map((member) => {
                          return (
                            <>
                              <ProjectRow
                                key={member.userId}
                                memberId={member.userId}
                                member={member}
                              />
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              }
            </>
          )}
          {/* list */}
          {!activeTab && (
            <>
              <div className="flex" style={{ zoom: "90%" }}></div>
              <Dialog
                open={taskEditModal}
                onClose={() => {
                  setTaskEditModal(!taskEditModal);
                }}
              >
                <div
                  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed z-50 outline-none focus:outline-none backdrop-filter"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    bottom: "10px",
                    right: "20px",
                    left: "10px",
                    top: "10px",
                  }}
                  onClick={() => {
                    setMemberOpen(false);
                    setRemoveMemberPopUp(false);
                  }}
                >
                  <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                  <div className="pt-4 max-h-[90vh] overflow-y-auto scrollbar-hide">
                    {/*content*/}
                    <div
                      className=" border-0 px-6 py-4 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                      style={{
                        borderRadius: "32px",
                      }}
                    >
                      {/*header*/}
                      <form onSubmit={handleSubmit(handleCreateTask)}>
                        <h3 className="text-xl font-semibold text-default">
                          Create Task
                        </h3>
                        {/*body*/}
                        <div className="relative mt-4 py-2 flex-auto">
                          <p className="text-slate-500 text-lg leading-relaxed">
                            <h1 className="text-black font-bold  text-sm leading-relaxed">
                              Task Name
                            </h1>
                            <input
                              className="w-full h-[80%] border-2 border-slate-200 rounded-[16px] p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              placeholder="Enter Task name"
                              {...register("taskName", {
                                required: "This field is required",
                              })}
                            />
                            <ErrorMessage
                              error={errors.taskName}
                              message={errors.taskName?.message}
                            />
                            <h1 className="mb-2 mt-6 text-black font-bold  text-sm leading-relaxed">
                              Task Description
                            </h1>
                            <textarea
                              className="w-full h-[50%] border-2 rounded-[16px] border-slate-200  p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              placeholder="Write something..."
                              {...register("taskDescription", {
                                required: "This field is required",
                              })}
                            />
                            <ErrorMessage
                              error={errors.taskDescription}
                              message={errors.taskDescription?.message}
                            />
                            <div className="flex flex-row mt-2">
                              <Controller
                                name="dueDate"
                                control={control}
                                render={({ field }) => (
                                  <div>
                                    <div>
                                      <label
                                        htmlFor="dueDate"
                                        className="mb-2 text-black font-bold text-sm leading-relaxed"
                                      >
                                        Due Date
                                      </label>
                                    </div>
                                    <input
                                      {...field}
                                      id="dueDate"
                                      type="date"
                                      placeholder="abc"
                                      className="w-[30vh] h-[6vh] border-2 border-slate-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                  </div>
                                )}
                              />
                              <div>
                                <div className=" mb-4  ml-5">
                                  <h1 className=" mt-2 text-black font-bold ml-5  text-sm leading-relaxed">
                                    Add Members
                                  </h1>
                                  <div className="flex flex-row  mt-2 mb-2 space-x-1">
                                    <div
                                      className="cursor-pointer ml-4"
                                      onClick={(e) => {
                                        setMemberOpen((prev) => !prev);
                                        e.stopPropagation();
                                        setRemoveMemberPopUp(false);
                                      }}
                                    >
                                      <img
                                        src={AddMemberIcon}
                                        alt="memeber icon"
                                      />
                                    </div>
                                    {editAddProjectsMembers.length < 2 ? (
                                      // Display all members
                                      editAddProjectsMembers.map((member) => (
                                        <Tooltip
                                          title={member?.label}
                                          key={member?.userId?.userId}
                                          arrow
                                        >
                                          <Avatar
                                            key={member?.userId?.userId}
                                            style={{ background: "#0096EB" }}
                                            alt={member?.label}
                                          >
                                            {member?.label
                                              ?.charAt(0)
                                              .toUpperCase()}
                                          </Avatar>
                                        </Tooltip>
                                      ))
                                    ) : (
                                      // Display the first 1 members and a counter for the rest
                                      <>
                                        {editAddProjectsMembers
                                          .slice(0, 1)
                                          .map((member) => (
                                            <Tooltip
                                              title={member?.label}
                                              key={member?.userId?.userId}
                                              arrow
                                            >
                                              <Avatar
                                                key={member?.userId?.userId}
                                                style={{
                                                  background: "#0096EB",
                                                }}
                                                alt={member?.label}
                                              >
                                                {member?.label
                                                  ?.charAt(0)
                                                  .toUpperCase()}
                                              </Avatar>
                                            </Tooltip>
                                          ))}
                                        <Avatar
                                          style={{
                                            background: "#0096EB",
                                          }}
                                          title={getAllMemberTitle(
                                            editAddProjectsMembers
                                          )}
                                          onClick={(e) => {
                                            setRemoveMemberPopUp(
                                              (prev) => !prev
                                            );
                                            setMemberOpen(false);
                                            e.stopPropagation();
                                            toggleDropdown();
                                          }}
                                        >
                                          +{editAddProjectsMembers.length - 1}
                                        </Avatar>
                                      </>
                                    )}
                                  </div>
                                  {isDropdownOpen && (
                                    <>
                                      <MuiSelect
                                        open={isDropdownOpen}
                                        onClose={toggleDropdown}
                                        onOpen={toggleDropdown}
                                        value=""
                                        MenuProps={{
                                          anchorOrigin: {
                                            vertical: "bottom",
                                            horizontal: "left",
                                          },
                                          transformOrigin: {
                                            vertical: "top",
                                            horizontal: "left",
                                          },
                                          getContentAnchorEl: null,
                                          PaperProps: {
                                            style: {
                                              maxHeight: 300,
                                            },
                                          },
                                        }}
                                        className="w-[20vh] h-[6vh]  p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                      >
                                        {editAddProjectsMembers.map(
                                          (member) => (
                                            <MenuItem
                                              key={member?.userId?.userId}
                                              value={member}
                                              style={{ position: "relative" }} // Add this style for relative positioning
                                            >
                                              <div
                                                key={member?.userId?.userId}
                                                className="bg-[#0096FB] rounded-3xl py-2 mr-5 px-4 mx-0.5 text-white cursor-pointer "
                                              >
                                                {member?.label
                                                  ?.charAt(0)
                                                  .toUpperCase()}

                                                <Badge
                                                  className="bg-gray-200 rounded-full px-1 py-1 text-black text-xs flex items-center justify-center hover:bg-red-500 cursor-pointer"
                                                  overlap="circular"
                                                  style={{
                                                    marginTop: "-18px",
                                                    marginRight: "-16px",
                                                    zIndex: 9,
                                                    position: "absolute",
                                                  }}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditAddProjectsMembers(
                                                      editAddProjectsMembers.filter(
                                                        (selected) =>
                                                          selected.value !==
                                                          member.value
                                                      )
                                                    );
                                                  }}
                                                >
                                                  <MdClear />
                                                </Badge>
                                              </div>
                                              {member?.label}
                                            </MenuItem>
                                          )
                                        )}
                                      </MuiSelect>
                                    </>
                                  )}
                                  {memberOpen && (
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <Select
                                        menuPlacement="top"
                                        isSearchable
                                        value=""
                                        isMulti
                                        name="members"
                                        className="w-[20vh] h-[6vh]  p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        options={convertToFormat(
                                          projectsMembers
                                        ).map((option) => ({
                                          ...option,
                                          isDisabled:
                                            editAddProjectsMembers.some(
                                              (selected) =>
                                                selected.value === option.value
                                            ),
                                        }))}
                                        classNamePrefix="select"
                                        onChange={(selectedOptions) => {
                                          setEditAddProjectsMembers(
                                            (prevSelected) => [
                                              ...prevSelected,
                                              ...selectedOptions,
                                            ]
                                          );
                                        }}
                                        menuPortalTarget={document.body}
                                        styles={{
                                          menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 9999,
                                          }),
                                        }}
                                      />
                                    </div>
                                  )}
                                  {isMember && (
                                    <span className="text-sm text-red-600 pl-2">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <label
                              htmlFor="default-radio-1"
                              className="mt-2 text-black font-bold text-sm leading-relaxed"
                            >
                              Select Status
                            </label>
                            <div className="flex mb-4 mt-4">
                              {projectStatus?.map((status) => {
                                const inputId = `status-radio-${status.id}`;
                                return (
                                  <div
                                    className="flex items-center mb-4 mr-4"
                                    key={status?.id}
                                  >
                                    <input
                                      id={inputId}
                                      type="radio"
                                      value={status.statusName}
                                      name="default-radio"
                                      className="w-4 h-4 m-2 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                      {...register("taskStatus", {
                                        required: "This field is required",
                                      })}
                                    />
                                    <label
                                      for="default-radio-1"
                                      className="text-sm font-medium text-black"
                                    >
                                      {status.statusName}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mb-4 mt-[-30px]">
                              <ErrorMessage
                                error={errors.taskStatus}
                                message={errors.taskStatus?.message}
                              />
                            </div>
                          </p>
                        </div>
                        <div className="flex flex-row justify-center m-auto pb-4">
                          <button
                            className="bg-[#0096FB]  mt-2 rounded-xl  text-white  font-bold text-sm px-40 py-4 "
                            type="submit"
                          >
                            Create Task
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </Dialog>

              {!activeTab && listTab && (
                <>
                  <ListView
                    listOpen={listOpen}
                    setListOpen={setListOpen}
                    setListModal={setListModal}
                    projectStatus={projectStatus}
                    projectId={projectId}
                  />
                </>
              )}
            </>
          )}
          {!activeTab && boardTab && (
            <>
              <BoardView
                listOpen={listOpen}
                setListOpen={setListOpen}
                setListModal={setListModal}
                projectStatus={projectStatus}
                projectId={projectId}
                ListModal={ListModal}
                loadAgain={loadAgain}
                setLoadAgain={setLoadAgain}
                projectName={projectName}
              />
            </>
          )}
        </div>
      )}

      {ListModal && (
        <Dialog
          open={ListModal}
          onClose={() => {
            setListModal(false);
          }}
        >
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter backdrop-blur-sm">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="my-6 ">
              {/*content*/}
              <div
                className=" border-0  shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "80vh",
                  height: "40vh",
                  marginRight: "100px",
                  marginBottom: "20px",
                  borderRadius: "30px",
                }}
              >
                {/*header*/}
                <h3 className=" mt-10 text-2xl font-semibold text-default ml-10">
                  Create List
                </h3>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    <h1 className="mb-4 text-black font-bold ml-10  text-sm leading-relaxed">
                      List Name
                    </h1>
                    <input
                      className="ml-10 w-[63vh] h-[5vh] border-2 border-slate-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Todo, Doing, Done"
                      onChange={(e) => {
                        setListName(e.target.value);
                      }}
                    />
                  </p>
                </div>
                <div className="flex flex-row ml-10 mb-10">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 m-2 mr-3 text-sm outline-none "
                    type="button"
                    onClick={() => setListModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-default w-[400px] rounded-lg  text-white  font-bold uppercase text-sm px-6 py-3 "
                    type="button"
                    onClick={handleStatusCreate}
                    style={{
                      width: "200px",
                    }}
                  >
                    Create List
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </Dialog>
      )}
      {!activeTab && (
        <>
          <div className="fixed bottom-0 right-0 m-16 rounded-xl cursor-pointer bg-[#0096FB] py-2 px-4 text-2xl text-white font-semibold">
            <div
              className="flex flex-row items-center justify-center text-2xl space-x-4"
              onClick={() => {
                setTaskEditModal(true);
              }}
            >
              <span className="font-medium pr-2">+</span> Task
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProjectsDetails;
