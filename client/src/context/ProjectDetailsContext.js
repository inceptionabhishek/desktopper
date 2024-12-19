import axios from "axios";
import React, { createContext, useState } from "react";

const ProjectDetailsContext = createContext();

const ProjectDetailsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [projectsMembers, setProjectsMembers] = useState([]);
  const [projectName, setProjectName] = useState(null);
  const [projectDescription, setProjectDescription] = useState(null);
  const [projectStatus, setProjectStatus] = useState(null);
  const [projectsTasks, setProjectsTasks] = useState([]);

  const getProjectInfo = (projectId) => {
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
        setProjectId(data.projectId);
        setProjectName(data.projectName);
        setProjectDescription(data.projectDescription);
        setProjectStatus(data.status);
        setProjectsMembers(data.members);
        setProjectsTasks(data.tasks);
        setIsLoading(false);
      })
      .catch(() => {});
  };

  const addStatusToProject = (statusName, projectId) => {
    axios({
      url: `admin/project/addStatus`,
      method: "POST",
      data: {
        statusName: statusName,
        projectId: projectId,
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    });
  };

  const ProjectDetailsContextValue = {
    getProjectInfo,
    projectId,
    projectName,
    projectDescription,
    projectsMembers,
    projectsTasks,
    addStatusToProject,
    projectStatus,
    isLoading,
  };

  return (
    <ProjectDetailsContext.Provider value={ProjectDetailsContextValue}>
      {children}
    </ProjectDetailsContext.Provider>
  );
};

export { ProjectDetailsContext, ProjectDetailsProvider };
