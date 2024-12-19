const express = require("express");
const { dbHandler } = require("../database/db");
const { isToday, isThisWeek } = require("date-fns");

const router = express.Router();
const taskRouter = express.Router();
router.use("/task", taskRouter);

function formatTime(totalTimeInMilliseconds) {
  const totalSeconds = totalTimeInMilliseconds / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

router.post("/updateProfile/:profileId", async (req, res, next) => {
  // const { userId } = req.cookies;
  const { profileId } = req.params;
  const { projects, ...updatedData } = req.body;

  const user = await dbHandler("readUserByUserId", { userId: profileId });
  const profile = await dbHandler("readUserByUserId", { userId: profileId });

  const prevProjects = profile?.data?.projects;

  if (!user.status || !profile.status) {
    return res.status(401).json({ err: user.err || profile.err });
  }

  const isAuthorized =
    user.data.userId === profile.data.userId &&
    user.data.userRole === "admin" &&
    profile.data.userRole === "admin";

  const isAllowed =
    (user.data.userRole === "admin" &&
      (profile.data.userRole === "manager" ||
        profile.data.userRole === "user")) ||
    (user.data.userRole === "manager" &&
      (profile.data.userRole === "manager" ||
        profile.data.userRole === "user"));

  if (isAuthorized || isAllowed) {
    const updatedUser = await dbHandler("updateUser", {
      userId: profileId,
      updatedData,
    });

    if (projects?.length) {
      for (const project of prevProjects) {
        await dbHandler("removeMembersFromProject", {
          projectId: project.projectId,
          projectName: project.projectName,
          members: [
            {
              userId: profileId,
              userRole: profile.data.userRole,
              fullName: profile.data.fullName,
            },
          ],
        });
      }

      for (const project of projects) {
        await dbHandler("addMembersToProject", {
          projectId: project.projectId,
          projectName: project.projectName,
          members: [
            {
              userId: profileId,
              userRole: profile.data.userRole,
              fullName: profile.data.fullName,
            },
          ],
        });
      }
    }

    res.send(updatedUser.data);
  } else {
    res.send({ err: "Not Authorized" });
  }
});

router.post("/updatePopupStatus/:email", async (req, res, next) => {
  // const { userId } = req.cookies;
  const { email } = req.params;

  const user = await dbHandler("updateIsPopupShowed", { email });

  if (!user.status) {
    return res.status(401).json({ err: user.err });
  }

  res.json(user.data);
});

taskRouter.get("/join/:workspaceId", async (req, res, next) => {
  const { userId } = req.cookies;
  const { workspaceId } = req.params;

  const user = await dbHandler("readUserByUserId", { userId });

  if (!user.status) {
    return res.status(401).json({ err: user.err });
  }

  // if (!user.data.accountStatus) {
  //   return res
  //     .status(401)
  //     .json({ err: "Please verify your account before proceeding" });
  // }

  if (user.data.workspaceId === workspaceId) {
    return res.status(409).send("Already joined the workspace");
  }

  if (user.data.workspaceId?.length > 0) {
    return res.status(409).send("Already a member of a workspace");
  }

  const workspace = await dbHandler("readWorkSpace", {
    workspaceId,
  });

  if (!workspace.status || !workspace.data) {
    return res.status(401).send("Workspace does not exist");
  }

  const updatedUser = await dbHandler("updateUser", {
    userId,
    updatedData: {
      workspaceId,
      userRole: "pending",
      approvalStatus: false,
    },
  });

  if (!updatedUser.status) {
    return res.status(500).json({ err: updatedUser.err });
  }

  await dbHandler("addMembersToWorkSpace", {
    userId,
    workspaceId,
    fullName: user.data.fullName,
    email: user.data.email,
  });

  res.send("Joined workspace");
});

taskRouter.get("/checkStatus", async (req, res, next) => {
  const { userId } = req.cookies;

  const user = await dbHandler("readUserByUserId", { userId });

  if (!user.status) return res.status(401).json({ err: user.err });

  if (!user?.data?.accountStatus)
    return res
      .status(401)
      .json({ err: "Please verify your account before proceeding" });

  console.log(user);

  res.json(user.data);
});

taskRouter.get("/userData", async (req, res, next) => {
  const { userId } = req.cookies;
  const user = await dbHandler("readUserByUserId", { userId });
  if (!user.status) return res.status(401).json({ err: user.err });
  res.json({ ...user.data });
});

router.get("/getuserData/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const user = await dbHandler("readUserByUserIdforArray", { userId });
  if (!user.status) return res.status(401).json({ err: user.err });

  res.json({ ...user.data });
});

router.get("/getSuperAdmin/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const user = await dbHandler("readUserByUserIdforArray", { userId });
  if (!user.status) return res.status(401).json({ err: user.err });

  const workspaceId = user?.data[0]?.workspaceId;

  const workspace = await dbHandler("readWorkSpace", { workspaceId });
  if (!workspace.status) return res.status(401).json({ err: workspace.err });

  const adminId = workspace?.data?.admin;

  const admin = await dbHandler("readUserByUserIdforArray", {
    userId: adminId,
  });
  if (!admin.status) return res.status(401).json({ err: admin.err });

  res.json({ ...admin.data });
});

router.get("/getAllUserData/:workspaceId", async (req, res, next) => {
  const { userId } = req.cookies;
  const { workspaceId } = req.params;
  const user = await dbHandler("getAllUser", { userId, workspaceId });

  if (!user.status) return res.status(401).json({ err: user.err });

  const usersWithTotalTime = await Promise.all(
    user.data.map(async (userData) => {
      const { userId } = userData;

      // Calculate total time worked today and this week for the user
      const reports = await dbHandler("readReportByUserId", { userId });

      let totalActiveTimeToday = 0;
      let totalActiveTimeThisWeek = 0;

      let totalEfficiencyToday = 0;
      let totalEfficiencyThisWeek = 0;

      let totalTimeTrackedToday = 0;
      let totalIdleTimeToday = 0;

      let totalTimeTrackedThisWeek = 0;
      let totalIdleTimeThisWeek = 0;

      const today = new Date();
      const thisWeekStart = new Date();

      let i = 0,
        j = 0;

      if (reports.status) {
        for (const report of reports.data) {
          const { date, timeTracked, idleTime, efficiency } = report;

          // Check if the report date is today and add to totalActiveTimeToday
          if (isToday(new Date(date))) {
            totalActiveTimeToday += timeTracked;
            totalEfficiencyToday += parseFloat(efficiency ? efficiency : 0);
            totalTimeTrackedToday += timeTracked;
            totalIdleTimeToday += idleTime;
            i = i + 1;
          }

          // Check if the report date is within this week and add to totalActiveTimeThisWeek
          if (isThisWeek(new Date(date), { weekStartsOn: 1 })) {
            totalActiveTimeThisWeek += timeTracked;
            totalEfficiencyThisWeek += parseFloat(efficiency ? efficiency : 0);
            totalTimeTrackedThisWeek += timeTracked;
            totalIdleTimeThisWeek += idleTime;
            j = j + 1;
          }
        }
      }

      const totalWorkHoursToday = formatTime(totalActiveTimeToday);
      const totalWorkHoursThisWeek = formatTime(totalActiveTimeThisWeek);

      return {
        ...userData,
        totalTimeToday: totalWorkHoursToday,
        totalTimeThisWeek: totalWorkHoursThisWeek,
        totalEfficiencyToday: Math.floor(
          totalTimeTrackedToday !== 0
            ? ((totalTimeTrackedToday - totalIdleTimeToday * 1000) /
                totalTimeTrackedToday) *
                100
            : 0
        ),
        totalEfficiencyThisWeek: Math.floor(
          totalTimeTrackedThisWeek !== 0
            ? ((totalTimeTrackedThisWeek - totalIdleTimeThisWeek * 1000) /
                totalTimeTrackedThisWeek) *
                100
            : 0
        ),
        totalTimeTrackedToday,
        totalIdleTimeToday,
        totalTimeTrackedThisWeek,
        totalIdleTimeThisWeek,
      };
    })
  );

  res.json({ ...usersWithTotalTime });
});

router.get("/getUserProjectsMembers/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const user = await dbHandler("getUserMembers", { userId });
  if (!user.status) return res.status(401).json({ err: user.err });

  const usersWithTotalTime = await Promise.all(
    user.data.map(async (userData) => {
      const { userId } = userData;

      // Calculate total time worked today and this week for the user
      const reports = await dbHandler("readReportByUserId", { userId });

      let totalActiveTimeToday = 0;
      let totalActiveTimeThisWeek = 0;

      let totalEfficiencyToday = 0;
      let totalEfficiencyThisWeek = 0;

      let totalTimeTrackedToday = 0;
      let totalIdleTimeToday = 0;

      let totalTimeTrackedThisWeek = 0;
      let totalIdleTimeThisWeek = 0;

      const today = new Date();
      const thisWeekStart = new Date();

      let i = 0,
        j = 0;

      if (reports.status) {
        for (const report of reports.data) {
          const { date, timeTracked, idleTime, efficiency } = report;

          // Check if the report date is today and add to totalActiveTimeToday
          if (isToday(new Date(date))) {
            totalActiveTimeToday += timeTracked;
            totalEfficiencyToday += parseFloat(efficiency ? efficiency : 0);
            totalTimeTrackedToday += timeTracked;
            totalIdleTimeToday += idleTime;
            i = i + 1;
          }

          // Check if the report date is within this week and add to totalActiveTimeThisWeek
          if (isThisWeek(new Date(date), { weekStartsOn: 1 })) {
            totalActiveTimeThisWeek += timeTracked;
            totalEfficiencyThisWeek += parseFloat(efficiency ? efficiency : 0);
            totalTimeTrackedThisWeek += timeTracked;
            totalIdleTimeThisWeek += idleTime;
            j = j + 1;
          }
        }
      }

      const totalWorkHoursToday = formatTime(totalActiveTimeToday);
      const totalWorkHoursThisWeek = formatTime(totalActiveTimeThisWeek);

      return {
        ...userData,
        totalTimeToday: totalWorkHoursToday,
        totalTimeThisWeek: totalWorkHoursThisWeek,
        totalEfficiencyToday: Math.floor(
          totalTimeTrackedToday !== 0
            ? ((totalTimeTrackedToday - totalIdleTimeToday * 1000) /
                totalTimeTrackedToday) *
                100
            : 0
        ),
        totalEfficiencyThisWeek: Math.floor(
          totalTimeTrackedThisWeek !== 0
            ? ((totalTimeTrackedThisWeek - totalIdleTimeThisWeek * 1000) /
                totalTimeTrackedThisWeek) *
                100
            : 0
        ),
        totalTimeTrackedToday,
        totalIdleTimeToday,
        totalTimeTrackedThisWeek,
        totalIdleTimeThisWeek,
      };
    })
  );

  res.json({ ...usersWithTotalTime });
});

router.get(
  "/viewProjectbyUserId/:userId/:managerId",
  async (req, res, next) => {
    const { userId, managerId } = req.params;

    if (!userId) return res.status(400).json({ err: "Missing Details" });

    const project = await dbHandler("viewProjectByUserId", {
      userId,
      managerId,
    });

    if (!project?.status)
      return res.status(404).json({ err: "Project does not exist" });

    res.json({ ...project.data });
  }
);

taskRouter.post("/create", async (req, res, next) => {
  const { userId } = req.cookies;

  const { projectId, taskName, taskDescription, dueDate, taskStatus, members } =
    req.body;
  console.log(
    projectId,
    taskName,
    taskDescription,
    dueDate,
    taskStatus,
    members
  );
  if (!userId || !projectId || !taskName || !taskStatus || !members) {
    return res.status(400).json({ err: "Missing Details" });
  }
  const user = await dbHandler("readUserByUserId", { userId });

  if (!user?.status)
    return res.status(404).json({ err: "User does not exist" });

  if (user?.data?.approvalStatus === 0)
    return res
      .status(401)
      .json({ err: "Please verify your account to perform this action." });

  if (!user?.data?.workspaceId?.length)
    return res
      .status(400)
      .json({ err: "Please create or join a workspace first." });

  const result = await dbHandler("createTask", {
    createdBy: userId,
    projectId,
    taskName,
    taskDescription,
    dueDate,
    taskStatus,
    members,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

taskRouter.post("/changeName", async (req, res, next) => {
  const { userId } = req.cookies;
  const { taskId, taskName } = req.body;

  if (!userId || !taskName || !taskId)
    return res.status(400).json({ err: "Missing Details" });

  const task = await dbHandler("readTask", { taskId });

  if (!task?.status)
    return res.status(404).json({ err: "Task does not exist" });

  const result = await dbHandler("updateTask", {
    taskId,
    updatedData: { taskName },
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

taskRouter.post("/updateTask", async (req, res, next) => {
  const { userId } = req.cookies;
  console.log("body-->", req.body);
  const { taskId, taskName, taskDescription, dueDate, members, taskStatus } =
    req.body;

  if (!userId || !taskId || !taskName || !taskDescription || !members)
    return res.status(400).json({ err: "Missing Details" });

  const task = await dbHandler("readTask", { taskId });

  if (!task?.status)
    return res.status(404).json({ err: "Task does not exist" });

  const updatedData = {
    taskName,
    taskDescription,
    dueDate,
    members,
    taskStatus,
  };
  const result = await dbHandler("updateTask", {
    taskId,
    updatedData,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

taskRouter.post("/viewall", async (req, res, next) => {
  const { userId } = req.cookies;
  const { projectId } = req.body;

  if (!userId || !projectId)
    return res.status(400).json({ err: "Missing Details" });

  const result = await dbHandler("viewallTask", { projectId });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

taskRouter.get("/delete/:taskId", async (req, res, next) => {
  const { userId } = req.cookies;
  const { taskId } = req.params;

  if (!userId || !taskId)
    return res.status(400).json({ err: "Missing Details" });

  const task = await dbHandler("readTask", { taskId });

  if (!task?.status)
    return res.status(404).json({ err: "Task does not exist" });

  const deleteResult = await dbHandler("deleteTask", { taskId, userId });

  if (!deleteResult?.status)
    return res.status(404).json({ err: "Failed to delete" });

  res.json({ ...task.data });
});

taskRouter.get("/view/:taskId", async (req, res, next) => {
  const { userId } = req.cookies;
  const { taskId } = req.params;

  if (!userId || !taskId)
    return res.status(400).json({ err: "Missing Details" });

  const task = await dbHandler("readTask", { taskId });

  if (!task?.status)
    return res.status(404).json({ err: "Task does not exist" });

  res.json({ ...task.data });
});

taskRouter.post("/addUsers", async (req, res, next) => {
  const { userId } = req.cookies;
  const { taskId, members } = req.body;

  if (!userId || !Array.isArray(members) || !members.length || !taskId)
    return res.status(400).json({ err: "Missing Details" });

  const task = await dbHandler("readTask", { taskId });

  console.log(task);

  if (!task?.status)
    return res.status(404).json({ err: "Task does not exist" });

  const mandatoryFields = ["userId", "fullName"];

  const filteredMembers = members.filter((member) =>
    mandatoryFields.every((field) => member.hasOwnProperty(field))
  );

  if (filteredMembers.length !== members.length)
    return res.status(400).json({ err: "Details missing from members array" });

  const uniqueMembersList = filteredMembers.filter((member) => {
    return !task.data.members.some(
      (oldMember) => oldMember.userId === member.userId
    );
  });

  if (!uniqueMembersList.length)
    return res.status(400).json({ err: "These members already exist in task" });

  const result = await dbHandler("addMembersToTask", {
    taskId,
    members: uniqueMembersList,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

taskRouter.post("/changeStatus", async (req, res, next) => {
  const { userId } = req.cookies;
  const { taskId, taskStatus } = req.body;
  if (!userId || !taskId || !taskStatus)
    return res.status(400).json({ err: "Missing Details" });
  const task = await dbHandler("readTask", { taskId });
  if (!task?.status)
    return res.status(404).json({ err: "Task does not exist" });
  const result = await dbHandler("updateTaskForStatus", {
    taskId,
    updatedData: { taskStatus },
    userId,
  });
  if (!result?.status) return res.status(400).json({ err: result?.err });
  res.json({ ...result.data });
});

taskRouter.post("/removeStatus", async (req, res, next) => {
  const { userId } = req.cookies;
  const { taskStatus } = req.body;
  if (!userId || !taskStatus)
    return res.status(400).json({ err: "Missing Details" });
  const result = await dbHandler("removeStatus", {
    taskStatus,
    userId,
  });
  if (!result?.status) return res.status(400).json({ err: result?.err });
  res.json({ ...result.data });
});

taskRouter.post("/removeUsers", async (req, res, next) => {
  const { userId } = req.cookies;
  const { taskId, members } = req.body;
  if (!userId || !Array.isArray(members) || !members.length || !taskId) {
    return res.status(400).json({ err: "Missing Details" });
  }
  const task = await dbHandler("readTask", { taskId });
  if (!task?.status) {
    return res.status(404).json({ err: "Task does not exist" });
  }
  const mandatoryFields = ["userId", "fullName"];
  const filteredMembers = members.filter((member) =>
    mandatoryFields.every((field) => member.hasOwnProperty(field))
  );
  if (filteredMembers.length !== members.length) {
    return res.status(400).json({ err: "Details missing from members array" });
  }
  const uniqueMembersList = filteredMembers.filter((member) => {
    return !task.data.members.some(
      (oldMember) => oldMember.userId === member.userId
    );
  });
  if (!uniqueMembersList.length) {
    return res.status(400).json({ err: "These members already exist in task" });
  }
  const result = await dbHandler("removeMembersFromTask", {
    taskId,
    members: uniqueMembersList,
  });
  if (!result?.status) {
    return res.status(400).json({ err: result?.err });
  }
  res.json({ ...result.data });
});

taskRouter.get("/viewProjectTasks/:userId", async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ err: "Missing Details" });

  const projects = await dbHandler("viewProjectByUserId", { userId });

  if (!projects || projects?.status == false)
    return res.status(404).json({ err: "No projects found" });

  for (const project of projects?.data) {
    const tasks = await dbHandler("viewUserTask", {
      projectId: project.projectId,
      userId,
    });

    for (const task of tasks?.data) {
      const reports = await dbHandler("readReportByTaskId", {
        taskId: task.taskId,
      });

      let totalTimeTaken = 0;
      if (reports && reports?.data) {
        for (const report of reports?.data) {
          const { timeTracked, idleTime } = report;
          totalTimeTaken += timeTracked - idleTime * 1000;
        }
      }

      task.totalTimeTaken = formatTime(totalTimeTaken);
    }

    project.tasks = tasks.data;
  }

  res.json(projects.data);
});

taskRouter.get("/fetchLocation/:ipaddress", async (req, res, next) => {
  const { ipaddress } = req.params;

  if (!ipaddress) return res.status(400).json({ err: "Missing Details" });

  try {
    const response = await fetch(`http://ip-api.com/json/${ipaddress}`);

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const result = await response.json();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
