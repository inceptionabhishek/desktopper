import axios from "axios";
import React, { createContext, useState } from "react";

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [taskEditModal, setTaskEditModal] = useState(false);

  const getTasks = async (projectId) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `user/task/viewall`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
        data: { projectId: projectId },
      })
        .then((response) => {
          const data = response.data;
          setTasks([...Object.values(data)]);

          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  const viewTasks = async (userId) => {
    await axios({
      url: `user/task/viewProjectTasks/${userId}`,

      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;
        setTasks([...Object.values(data)]);
      })
      .catch((e) => {});
  };

  const updateTask = async (
    taskId,
    taskName,
    taskDescription,
    dueDate,
    members,
    taskStatus
  ) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `user/task/updateTask`,
        method: "POST",
        data: {
          taskId,
          taskName,
          taskDescription,
          dueDate,
          members,
          taskStatus,
        },
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          const data = response.data;

          resolve(data);
        })

        .catch((e) => {
          reject(e);
        });
    });
  };

  const createTask = async ({
    taskName,
    taskDescription,
    projectId,
    projectsMembers,
    taskStatus,
    dueDate,
  }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `user/task/create`,
        method: "POST",
        data: {
          taskName,
          taskDescription,
          projectId,
          taskStatus,
          dueDate,
          members: projectsMembers,
        },
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          const data = response.data;
          setTasks([...tasks, data]);
          resolve(response);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  const changeStatus = async (taskId, taskStatus) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `user/task/changeStatus`,
        method: "POST",
        data: {
          taskId,
          taskStatus,
        },
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          const data = response.data;

          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  const removeStatus = async (statusName) => {
    await axios({
      url: `user/task/removeStatus`,
      method: "POST",
      data: {
        taskStatus: statusName,
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {})
      .catch((e) => {});
  };

  const TaskContextValue = {
    createTask,
    tasks,
    getTasks,
    viewTasks,
    updateTask,
    changeStatus,
    removeStatus,
    taskEditModal,
    setTaskEditModal,
  };
  return (
    <TaskContext.Provider value={TaskContextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
