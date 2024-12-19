import { Dialog } from "@headlessui/react";
import Tooltip from "@mui/material/Tooltip";
import React, { useContext, useState, useEffect } from "react";
import { BsPencil } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import "./Projects.css";
import AddMemberIcon from "../../assets/Icons/addMember.svg";
import EditModal from "../../components/EditModal/EditModal";
import PlanDetails from "../../components/PopUpBox/PlanDetails";
import TrialEndModal from "../../components/PopUpBox/TrialEndPopUp";
import DeletePopUp from "../../components/ProjectView/DeletePopUp";
import { AuthContext } from "../../context/AuthContext";
import { PaymentContext } from "../../context/PaymentContext";
import { ProjectContext } from "../../context/ProjectContext";
import { UserContext } from "../../context/UserContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import ProjectPage from "../../skeletonUi/ProjectPage";
import ProjectRow from "./ProjectRow";
import { Avatar, AvatarGroup } from "@mui/material";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Select from "react-select";


function Projects() {
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [selectProjectId, setselectProjectId] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setactiveTab] = useState(false);
  const { user } = useContext(AuthContext);
  const [EditProjectId, setEditProjectId] = useState("");
  const [EditProjectName, setEditProjectName] = useState("");
  const [EditProjectDescription, setEditProjectDescription] = useState("");
  const [EditProjectMembers, setEditProjectMembers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [EditProjectTodos, setEditProjectTodos] = useState([]);
  const { workspaceMembers, getWorkSpaceInfo, workspaceId } =
    useContext(WorkSpaceContext);
  const { projects, getallprojects, createProject, DeleteProject, isLoading } =
    useContext(ProjectContext);

  const { superAdmin } = useContext(UserContext);

  const {
    subscription,
    APIComplete,
    isMembersPossible,
    showTrialEndModal,
    setShowTrialEndModal,
    isPlanDetailsVisible,
    setIsPlanDetailsVisible,
    isLoading: paymentLoading,
    viewSubscription,
  } = useContext(PaymentContext);

  useEffect(() => {
    setIsPlanDetailsVisible(false);

    getWorkSpaceInfo(
      JSON.parse(localStorage.getItem("team-hub-user"))?.workspaceId ||
        workspaceId
    );
    getallprojects(
      JSON.parse(localStorage.getItem("team-hub-user"))?.workspaceId ||
        workspaceId
    );

    if (superAdmin?.email && workspaceMembers.length > 0) {
      viewSubscription(superAdmin?.email, workspaceMembers);
    }
  }, []);

  useEffect(() => {
    getWorkSpaceInfo(user?.workspaceId);
  }, [user, projects]);

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

  const handleCreateProject = () => {
    if (members.length === 0 && newProjectName == "") {
      toast.error("Project Name and Members cannot be empty!");
    } else if (members.length === 0) {
      toast.error("Project Members cannot be empty!");
    } else if (newProjectName == "") {
      toast.error("Project Name cannot be empty!");
    } else {
      createProject({
        projectName: newProjectName,
        projectDescription: newProjectDescription,
        workspaceId: workspaceId,
        members: changeToFormatMembers(members),
      })
        .then(() => {
          getWorkSpaceInfo(
            JSON.parse(localStorage.getItem("team-hub-user"))?.workspaceId ||
              workspaceId
          );
          getallprojects(
            JSON.parse(localStorage.getItem("team-hub-user"))?.workspaceId ||
              workspaceId
          );
        })
        .catch((error) => {
          toast.error("Something went wrong!");
        });
      setShowModal(false);
    }
  };
  const handleDeleteProject = () => {
    DeleteProject(selectProjectId);
    setDeletePopUp(false);
  };

  const EditAction = (project) => {
    setEditProjectId(project?.projectId);
    setEditProjectName(project?.projectName);
    setEditProjectDescription(project?.projectDescription);
    setEditProjectMembers(project?.members);
    setEditProjectTodos(project?.todos);
    setShowEditModal(!showEditModal);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      {showEditModal && (
        <EditModal
          setShowEditModal={setShowEditModal}
          EditProjectId={EditProjectId}
          EditProjectName={EditProjectName}
          setEditProjectName={setEditProjectName}
          EditProjectDescription={EditProjectDescription}
          setEditProjectDescription={setEditProjectDescription}
          EditProjectMembers={EditProjectMembers}
          setEditProjectMembers={setEditProjectMembers}
          EditProjectTodos={EditProjectTodos}
          setEditProjectTodos={setEditProjectTodos}
          showEditModal={showEditModal}
        />
      )}
      <div
        className={`px-14 py-10  ${
          showTrialEndModal || isPlanDetailsVisible || !isMembersPossible
            ? "blur"
            : ""
        }`}
      >
        <div className="flex justify-between">
          <h2 className="dashboard-container-heading">Projects</h2>
          <button
            className="create-project-btn"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Add Projects
          </button>
        </div>
        {activeTab && (
          <>
            <div className="flex justify-between w-[100%] py-5"></div>
            {showModal ? (
              <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative my-6">
                    {/*content*/}
                    <div
                      className="border-0 px-12 py-12 rounded-xl mx-auto shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                      style={{ width: "80%" }}
                    >
                      {/*header*/}
                      <h3 className="text-3xl font-semibold text-default">
                        New Project
                      </h3>
                      {/*body*/}
                      <div className="relative p-6 flex-auto">
                        <p className="text-slate-500 text-lg leading-relaxed">
                          <h1 className="tabletext2 leading-relaxed">
                            Project Name
                          </h1>
                          <input
                            className="w-full h-10 px-4 py-6 border-2 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Project Name"
                            onChange={(e) => {
                              setNewProjectName(e.target.value);
                            }}
                          />
                          <h1 className="tabletext2 leading-relaxed">
                            Project Description
                          </h1>
                          <input
                            className="w-full h-10 px-4 py-6 border-2 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Project Description"
                            style={{
                              width: "500px",
                            }}
                            onChange={(e) => {
                              setNewProjectDescription(e.target.value);
                            }}
                          />
                          <h1 className="tabletext2 leading-relaxed">
                            Members
                          </h1>
                          <div className="">
                            <Select
                              isMulti
                              name="members"
                              options={convertToFormat(workspaceMembers)}
                              classNamePrefix="select"
                              onChange={(e) => {
                                setMembers(e);
                              }}
                            />
                          </div>
                        </p>
                      </div>
                      {/*footer*/}
                      <div className="flex items-center space-x-4 justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase text-sm outline-none focus:outline-none ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                          type="button"
                          onClick={handleCreateProject}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </>
            ) : null}
            {isLoading ||
            paymentLoading ||
            subscription?.length === 0 ||
            APIComplete === false ? (
              <ProjectPage />
            ) : (
              <table className="table-fixed w-[100%]">
                <thead className="border-b-2 boder-[#4b4b4b]">
                  <tr>
                    <th className="text-start w-1/4 py-2">Name</th>
                    <th className="text-start w-1/4 py-2">Members</th>
                    <th className="text-start w-1/4 py-2">Todo's</th>
                    <th className="text-start w-1/4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length > 0 &&
                    projects
                      ?.filter((pro) => pro.archive === true)
                      .map((project) => (
                        <tr
                          className="border-b-2 boder-[#4b4b4b]"
                          key={project?.id}
                        >
                          <td className="text-start w-1/4 py-2">
                            {project?.projectName}
                          </td>
                          <td className="text-start w-1/4 py-2">
                            {project?.members?.map((member) => (
                              <div
                                key={member?.id}
                                className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-default rounded-full"
                              >
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {member?.fullName?.charAt(0)}
                                </span>
                              </div>
                            ))}
                          </td>
                          <td className="text-start w-1/4 py-2">
                            {project?.todos?.length}
                          </td>
                          <td className="text-start w-1/4 py-2">
                            <button
                              className="w-[100px] border-2 border-slate-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-default"
                              onClick={() => {
                                EditAction(project);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            )}
          </>
        )}
        {!activeTab && (
          <>
            <div className="flex justify-between w-[100%] py-11 "></div>
            <Dialog open={showModal} onClose={() => setShowModal(false)}>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <div className="relative my-6 w-[706px] h-[610px] rounded-[20px]">
                  {/*content*/}
                  <div className="mt-8 border-0 px-12 py-12 w-[110vh] rounded-xl mx-auto shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <h3 className="text-3xl font-semibold text-default">
                      New Project
                    </h3>
                    {/*body*/}
                    <div className="relative flex-auto">
                      <p className="text-slate-500 text-lg leading-relaxed">
                        <div className="my-6">
                          <h1 className="tabletext2 leading-relaxed">
                            Project Name
                          </h1>
                          <input
                            className="w-full h-10 px-4 py-6 border-2 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Enter project name"
                            onChange={(e) => {
                              setNewProjectName(e.target.value);
                            }}
                          />
                        </div>
                        <div className="my-6">
                          <h1 className="tabletext2 leading-relaxed">
                            Project Description
                          </h1>
                          <input
                            className="w-full h-10 px-4 py-6 border-2 border-slate-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Enter description"
                            onChange={(e) => {
                              setNewProjectDescription(e.target.value);
                            }}
                          />
                        </div>
                        <div className="my-6">
                          <h1 className="tabletext2 leading-relaxed">
                            Members
                          </h1>
                          <div className="">
                            <Select
                              isMulti
                              name="members"
                              styles={{
                                width: "500px",
                              }}
                              placeholder="Add Members"
                              options={convertToFormat(workspaceMembers)}
                              classNamePrefix="select"
                              onChange={(e) => {
                                setMembers(e);
                              }}
                            />
                          </div>
                        </div>
                      </p>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center space-x-4 justify-end rounded-b">
                      <button
                        className="text-base pt-3 pb-3 rounded-2xl"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="pt-3 pb-3 pl-10 pr-10 rounded-2xl text-base bg-[#0096FB] text-white"
                        type="button"
                        onClick={handleCreateProject}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </Dialog>
            {isLoading ||
            paymentLoading ||
            subscription?.length === 0 ||
            APIComplete === false ? (
              <ProjectPage />
            ) : (
              <>
                <div
                  className="border-2 border-[#ebeaea] p-3 rounded-lg   "
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <table className="table-fixed w-[100%] rounded">
                    <thead className="border-b-2 border-[#ebeaea]">
                      <tr>
                        <th className="py-2">Name</th>
                        <th className="py-2">Members</th>
                        <th className="py-2">To Do's</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.length > 0 &&
                        projects?.map((project) => (
                          <ProjectRow
                            projectName={project?.projectName}
                            projectMembers={project?.members}
                            projectTodos={project?.task}
                            project={project}
                            user={user}
                            EditAction={EditAction}
                            setDeletePopUp={setDeletePopUp}
                            setselectProjectId={setselectProjectId}
                          />
                        ))}
                    </tbody>
                  </table>
                  {projects.length === 0 && (
                    <div className="flex justify-center items-center h-[70vh]">
                      <div className="text-center">
                        <p>
                          While there isn't an existing project, you have the
                          opportunity to add one
                        </p>
                        <button
                          className="create-project-btn mt-8"
                          onClick={() => {
                            setShowModal(true);
                          }}
                        >
                          Add Projects
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
        {deletePopUp && (
          <div onClick={() => setDeletePopUp(false)}>
            <DeletePopUp
              onDelete={handleDeleteProject}
              setDeletePopUp={setDeletePopUp}
              deletePopUp={deletePopUp}
              onCancel={() => {
                setDeletePopUp(false);
              }}
            />
          </div>
        )}
      </div>
      {showTrialEndModal && (
        <TrialEndModal
          setShowTrialEndModal={setShowTrialEndModal}
          isMembersPossible={isMembersPossible}
          setIsPlanDetailsVisible={setIsPlanDetailsVisible}
        />
      )}
      {isPlanDetailsVisible && (
        <PlanDetails
          setIsPlanDetailsVisible={setIsPlanDetailsVisible}
          isfromHome={true}
          setShowTrialEndModal={setShowTrialEndModal}
        />
      )}
    </>
  );
}

export default Projects;