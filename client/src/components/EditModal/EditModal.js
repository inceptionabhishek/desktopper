import { ProjectContext } from "../../context/ProjectContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import { Dialog } from "@headlessui/react";
import Multiselect from "multiselect-react-dropdown";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import Select from "react-select";


function EditModal({
  EditProjectId,
  EditProjectName,
  setEditProjectName,
  EditProjectDescription,
  setEditProjectDescription,
  EditProjectMembers,
  showEditModal,
  setShowEditModal,
}) {
  const changeToFormatMembers = (data) => {
    const arr = data.map((item) => {
      return item?.value;
    });
    return arr;
  };
  const { EditprojectName, updateMembersToProjects, getallprojects } =
    useContext(ProjectContext);
  const { workspaceMembers, getWorkSpaceInfo, workspaceId } =
    useContext(WorkSpaceContext);
  const [selectedProjectMembers, setSelectedProjectMembers] =
    useState(EditProjectMembers);

  const [NewEditProjectName, setNewEditProjectName] = useState(EditProjectName);
  const [NewEditProjectDescription, setNewEditProjectDescription] = useState(
    EditProjectDescription
  );
  const HandleEditProjectSubmit = () => {
    const members = changeToFormatMembers(
      convertToFormat(selectedProjectMembers)
    );
    if (members.length === 0 && NewEditProjectName == "") {
      toast.error("Project Name and Members cannot be empty!");
    } else if (members.length === 0) {
      toast.error("Project Members cannot be empty!");
    } else if (NewEditProjectName == "") {
      toast.error("Project Name cannot be empty!");
    } else {
      updateMembersToProjects({
        projectId: EditProjectId,
        members: changeToFormatMembers(convertToFormat(selectedProjectMembers)),
        projectName: NewEditProjectName,
        projectDescription: NewEditProjectDescription,
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
      setShowEditModal(false);
    }
  };
  const convertToFormat = (data) => {
    const arr = data.map((item) => {
      return { value: item, label: item.fullName };
    });
    return arr;
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedProjectMembers(selectedOptions);
  };

  const convertAndFilterToFormat = (workspaceMembers, EditProjectMembers) => {
    const filteredMembers = workspaceMembers.filter((workspaceMember) => {
      return !EditProjectMembers.some(
        (editMember) => editMember.userId === workspaceMember.userId
      );
    });

    const formattedMembers = filteredMembers.map((item) => {
      return { value: item, label: item.fullName };
    });

    return formattedMembers;
  };

  return (
    <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative my-6 w-[706px] h-[610px] rounded-[20px]">
          <div className="mt-8 border-0 px-12 py-12 w-[110vh] rounded-xl mx-auto shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <h3 className="text-3xl font-semibold text-default">
              Edit Project
            </h3>
            <div className="relative flex-auto">
              <p className="text-slate-500 text-lg leading-relaxed">
                <div className="my-6">
                  <h1 className="tabletext2 leading-relaxed">Project Name</h1>
                  <input
                    className="w-full h-10 px-4 py-6 border-2 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Project name"
                    onChange={(e) => {
                      setNewEditProjectName(e.target.value);
                    }}
                    value={NewEditProjectName}
                  />
                </div>
                <div className="my-6">
                  <h1 className="tabletext2 leading-relaxed">
                    Project Description
                  </h1>
                  <input
                    className="w-full h-10 px-4 py-6 border-2 border-slate-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Project description"
                    onChange={(e) => {
                      setNewEditProjectDescription(e.target.value);
                    }}
                    value={NewEditProjectDescription}
                  />
                </div>
                <div className="my-6">
                  <h1 className="tabletext2 leading-relaxed">Members</h1>
                  <div className="">
                    {/* <Multiselect
                      options={convertToFormat(workspaceMembers)}
                      selectedValues={convertToFormat(EditProjectMembers)}
                      onSelect={(selectedList) => {
                        setSelectedProjectMembers(selectedList);
                      }}
                      onRemove={(selectedList) => {
                        setSelectedProjectMembers(selectedList);
                      }}
                      displayValue="label"
                      groupBy="group"
                      selectAll={false}
                    /> */}

                    <Select
                      isMulti
                      name="members"
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          width: "600px",
                        }),
                      }}
                      placeholder="Add Members"
                      options={convertAndFilterToFormat(
                        workspaceMembers,
                        EditProjectMembers
                      )}
                      classNamePrefix="select"
                      defaultValue={convertToFormat(EditProjectMembers)}
                      onChange={handleSelectChange}
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
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="pt-3 pb-3 pl-10 pr-10 rounded-2xl text-base bg-[#0096FB] text-white"
                type="button"
                onClick={HandleEditProjectSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </Dialog>
  );
}

export default EditModal;