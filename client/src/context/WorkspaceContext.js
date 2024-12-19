import axios from "axios";
import React, { createContext, useState } from "react";
import { toast } from "react-hot-toast";


const WorkSpaceContext = createContext();

const WorkSpaceProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(null);
  const [workspaceId, setWorkspaceId] = useState(() => {
    const Id = localStorage.getItem("team-hub-workspace");
    return Id ? JSON.parse(Id) : null;
  });
  const [workspaceMembers, setWorkspaceMember] = useState([]);
  const [approvalMembers, setApprovalMember] = useState([]);

  const handleUpdateProfile = (updatedData) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `/user/updateUserProfile/${updatedData.profileId}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
        data: updatedData,
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

  const getWorkSpaceInfo = (WorkspaceID) => {
    setIsLoading(true);
    axios({
      url: `admin/workspace/read/${WorkspaceID}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;
        setWorkspaceId(data.workspaceId);
        setWorkspaceName(data.workspaceName);
        setWorkspaceMember(data.members);
        setApprovalMember(data.approvalMembers);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const approveUserToWorkspace = (data) => {
    setIsLoading(true);

    axios({
      url: `admin/workspace/allowUsers`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
      data: data,
    })
      .then((response) => {
        const data = response.data;
        const newApprovalMembers = approvalMembers.filter(
          (member) => member.userId !== data.userId
        );
        setApprovalMember(newApprovalMembers);
        setWorkspaceMember([...workspaceMembers, data]);
        toast.success("User is added into the workspace!");
        setIsLoading(false);
      })
      .catch((e) => {
        toast.error(e?.response?.data.err);
        setIsLoading(false);
      });
  };

  const declineUserFromWorkspace = (data) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      axios({
        url: `admin/workspace/declineUsers`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
        data: data,
      })
        .then((response) => {
          const newWorkspaceMember = workspaceMembers.filter(
            (member) => member.userId !== data.memberId
          );
          setWorkspaceMember(newWorkspaceMember);
          setIsLoading(false);
          resolve(data);
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const changeWorkspace = (data) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: `admin/workspace/change-user-workspace`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
        data: data,
      })
        .then((response) => {
          localStorage.removeItem("team-hub-workspace");
          setIsLoading(false);
          resolve(data);
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const joinWorkspace = (workspaceId) => {
    setIsLoading(true);

    axios({
      url: `admin/workspace/join/${workspaceId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then(() => {
        setWorkspaceId(workspaceId);
        localStorage.setItem("team-hub-workspace", JSON.stringify(workspaceId));
        const user = JSON.parse(localStorage.getItem("team-hub-user"));
        user.userRole = "pending";
        localStorage.setItem("team-hub-user", JSON.stringify(user));
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const createWorkSpace = (data) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      axios({
        url: "admin/workspace/create",
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
        data: data,
      })
        .then((response) => {
          const data = response.data;
          setWorkspaceId(data.workspaceId);
          setWorkspaceName(data.workspaceName);
          setWorkspaceMember(data.members);
          setIsLoading(false);
          localStorage.setItem(
            "team-hub-workspace",
            JSON.stringify(data.workspaceId)
          );
          resolve(data);
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const removeWorkspace = (userId) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: `admin/workspace/remove/${userId}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          const data = response.data;

          localStorage.removeItem("team-hub-workspace");
          setIsLoading(false);
          resolve(data);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    });
  };

  const getMemberProfile = (memberId) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      axios({
        url: `admin/project/viewProfile/${memberId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
        data: { memberId },
      })
        .then((response) => {
          const data = response.data;

          setIsLoading(false);
          resolve(data);
        })
        .catch((e) => {
          setIsLoading(false);

          reject(e);
        });
    });
  };

  const updateUserRole = (data) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      axios({
        url: `admin/workspace/changeUserRole/${data.memberId}/${data.workspaceId}/${data.selectedOption}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          const data = response.data;

          setIsLoading(false);
          resolve(data);
        })
        .catch((e) => {
          setIsLoading(false);

          reject(e);
        });
    });
  };

  const WorkSpaceContextValue = {
    isLoading,
    workspaceId,
    workspaceName,
    workspaceMembers,
    approvalMembers,
    joinWorkspace,
    createWorkSpace,
    approveUserToWorkspace,
    declineUserFromWorkspace,
    getWorkSpaceInfo,
    getMemberProfile,
    handleUpdateProfile,
    updateUserRole,
    removeWorkspace,
    changeWorkspace,
    setWorkspaceMember,
    setApprovalMember,
  };

  return (
    <WorkSpaceContext.Provider value={WorkSpaceContextValue}>
      {children}
    </WorkSpaceContext.Provider>
  );
};

export { WorkSpaceContext, WorkSpaceProvider };