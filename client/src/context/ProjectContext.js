import axios from "axios";
import React, { createContext, useState } from "react";


const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsMembers, setProjectsMembers] = useState([]);
  const [isUserAssignedToProject, setIsUserAssignedToProject] = useState(false);

  const getProjectsMembers = (projectId) => {
    setIsLoading(true);
    axios({
      url: `admin/project/view/${projectId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;
        setProjectsMembers([...Object.values(data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const DeleteProject = (ID) => {
    setIsLoading(true);
    axios({
      url: `admin/project/delete/${ID}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        setProjects([
          ...projects.filter((project) => {
            return project.projectId !== ID;
          }),
        ]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const getallprojects = (workspaceId) => {
    setIsLoading(true);
    axios({
      url: `admin/project/viewall`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
      data: { workspaceId: workspaceId },
    })
      .then((response) => {
        setProjects([...Object.values(response.data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const viewAllprojects = (userId, managerId) => {
    setIsLoading(true);
    axios({
      url: `user/viewProjectbyUserId/${userId}/${managerId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
      data: { userId: userId },
    })
      .then((response) => {
        setProjects([...Object.values(response.data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const createProject = (project) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: `admin/project/create`,
        method: "POST",
        data: project,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then(async (response) => {
          const data = response.data;
          const projectId = data.projectId;
          setProjects([...projects, data]);
          await addMembersToProjects(projectId, project.members);
          setIsLoading(false);
          resolve(data);
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const addMembersToProjects = (projectId, members, setTaskEditModal) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: `admin/project/addUsers`,
        method: "POST",
        data: {
          projectId: projectId,
          members: members,
        },
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          setIsUserAssignedToProject((prev) => !prev);
          resolve(response);
          setIsLoading(false);
        })
        .catch((e) => {
          setTaskEditModal(false);
          reject(e);
          setIsLoading(false);
        });
    });
  };

  const updateMembersToProjects = ({
    projectId,
    members,
    projectName,
    projectDescription,
  }) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      const membersList = members.map((member) => {
        if (member.userId) {
          return {
            label: member.fullName,
            value: {
              accountStatus: member.accountStatus,
              approvalStatus: member.approvalStatus,
              dateAdded: member.dateAdded,
              email: member.email,
              fullName: member.fullName,
              password: member.password || "",
              userId: member.userId,
              userRole: member.userRole,
              workspaceId: member.workspaceId,
            },
          };
        }
        return member;
      });

      axios({
        url: `admin/project/updateUsers`,
        method: "POST",
        data: {
          projectId: projectId,
          members: membersList,
          // projectName: projectName,
          // projectDesciption: projectDesciption,
        },
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          EditprojectNameAndDesciption({
            projectId,
            members: membersList,
            projectName,
            projectDescription,
          })
            .then((response) => {
              setIsLoading(false);
              resolve(response);
            })
            .catch((e) => {
              setIsLoading(false);
              reject(e);
            });
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const EditprojectNameAndDesciption = ({
    projectId,
    members,
    projectName,
    projectDescription,
  }) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      axios({
        url: `admin/project/updateProjectNameandDescrition`,
        method: "POST",
        data: {
          projectId,
          members,
          projectName,
          projectDescription,
        },
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          setIsLoading(false);
          resolve(response);
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const EditprojectName = (project) => {
    setIsLoading(true);
    axios({
      url: `admin/project/updateProject`,
      method: "POST",
      data: project,
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;

        const newProducts = projects.map((obj) => {
          if (data.projectId === obj.projectId) {
            return {
              ...obj,
              ...data,
            };
          }
          return obj;
        });

        setProjects([...newProducts]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const emptyProject = () => {
    setProjects([]);
  };

  const ProjectContextValue = {
    isLoading,
    projects,
    isUserAssignedToProject,
    projectsMembers,
    setIsUserAssignedToProject,
    emptyProject,
    setProjects,
    getallprojects,
    viewAllprojects,
    createProject,
    EditprojectName,
    EditprojectNameAndDesciption,
    getProjectsMembers,
    addMembersToProjects,
    DeleteProject,
    updateMembersToProjects,
  };
  return (
    <ProjectContext.Provider value={ProjectContextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectContext, ProjectProvider };