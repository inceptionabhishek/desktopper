const express = require("express");
const { dbHandler } = require("../database/db");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const router = express.Router();
const reportRouter = express.Router();
router.use("/report", reportRouter);

function formatTime(totalTimeInMilliseconds) {
  const totalSeconds = totalTimeInMilliseconds / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

router.post("/createReport", async (req, res) => {
  const data = req.body;
  const { userId } = req.cookies;
  const {
    memberName,
    date,
    taskName,
    timeTracked,
    startTime,
    endTime,
    screenshot,
    idleTime,
    workspaceId,
    projectId,
    taskId,
  } = req.body;

  if (!data.userId) {
    data.userId = userId;
  }
  if (
    memberName === null ||
    date === null ||
    taskName === null ||
    timeTracked === null ||
    startTime === null ||
    endTime === null ||
    idleTime === null ||
    workspaceId === null ||
    projectId === null ||
    taskId === null
  ) {
    return res.status(400).json({ err: "Missing details" });
  }
  const workspaceResult = await dbHandler("readWorkSpace", data);
  if (!workspaceResult.status) {
    return res.status(400).json({
      err: `No workspace found with workspaceId: ${data.workspaceId}`,
    });
  }
  const projectResult = await dbHandler("readProject", data);
  if (!projectResult.status) {
    return res
      .status(400)
      .json({ err: `No project found with projectId: ${data.projectId}` });
  }
  const taskResult = await dbHandler("readTask", data);
  if (!taskResult.status) {
    return res
      .status(400)
      .json({ err: `No task found with taskId: ${data.taskId}` });
  }
  const result = await dbHandler("createReport", data);

  await dbHandler("updateUser", {
    userId,
    updatedData: {
      lastActive: endTime,
    },
  });
  if (!result.status) return res.status(400).json(result);
  return res.status(200).json(result);
});

router.get("/user/:userId", async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ err: "Missing Details" });

  const reports = await dbHandler("readReportByUserId", { userId });

  if (!reports?.status)
    return res.status(404).json({ err: "Report does not exist" });

  const reportsWithProjectName = await Promise.all(
    reports.data.map(async (report) => {
      const project = await dbHandler("readProject", {
        projectId: report.projectId,
      });
      const projectName = project?.data?.projectName || "Project Not Found";
      return { ...report, projectName };
    })
  );

  res.json(reportsWithProjectName);
});

router.get("/workspace/:workspaceId", async (req, res, next) => {
  const { workspaceId } = req.params;

  if (!workspaceId) return res.status(400).json({ err: "Missing Details" });

  const report = await dbHandler("readReportByWorkspaceId", { workspaceId });

  // console.log(report);

  if (!report?.status)
    return res.status(404).json({ err: "Report does not exist" });

  res.json({ ...report.data });
});

router.get("/project/:projectId", async (req, res, next) => {
  const { projectId } = req.params;

  if (!projectId) return res.status(400).json({ err: "Missing Details" });

  const report = await dbHandler("readReportByProjectId", { projectId });

  if (!report?.status)
    return res.status(404).json({ err: "Report does not exist" });

  const project = await dbHandler("readProject", { projectId });

  const reportsWithProjectName = report.data.map((reportData) => ({
    ...reportData,
    projectName: project.data.projectName,
  }));

  res.json({ ...reportsWithProjectName });
});

router.get("/getAllReports/:workspaceId", async (req, res, next) => {
  const { workspaceId } = req.params;

  if (!workspaceId) return res.status(400).json({ err: "Missing Details" });

  try {
    // Fetch all users from the database
    const allUsers = await dbHandler("getAllUser", { workspaceId });

    // If no users found, return an empty array
    if (!allUsers?.status) {
      return res.status(200).json([]);
    }

    // Collect all user IDs
    const userIds = allUsers.data.map((user) => user.userId);

    // Fetch reports for each user
    const allReports = [];

    for (const userId of userIds) {
      const reports = await dbHandler("readReportByUserId", { userId });
      if (reports?.status) {
        allReports.push(...reports.data);
      }
    }

    // Add project names to the reports
    const reportsWithProjectName = await Promise.all(
      allReports.map(async (report) => {
        const project = await dbHandler("readProject", {
          projectId: report.projectId,
        });
        const projectName = project?.data?.projectName || "Project Not Found";
        return { ...report, projectName };
      })
    );

    // Return the reports with project names for all users
    res.json(reportsWithProjectName);
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch reports." });
  }
});

router.get("/getMembersReports/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Fetch all users from the database
    const members = await dbHandler("getUserMembers", { userId });

    // If no users found, return an empty array
    if (!members?.status) {
      return res.status(200).json([]);
    }

    // Collect all user IDs
    const userIds = members.data.map((user) => user.userId);

    // Fetch reports for each user
    const membersReports = [];

    for (const userId of userIds) {
      const reports = await dbHandler("readReportByUserId", { userId });
      if (reports?.status) {
        membersReports.push(...reports.data);
      }
    }

    // Add project names to the reports
    const reportsWithProjectName = await Promise.all(
      membersReports.map(async (report) => {
        const project = await dbHandler("readProject", {
          projectId: report.projectId,
        });
        const projectName = project?.data?.projectName || "Project Not Found";
        return { ...report, projectName };
      })
    );

    // Return the reports with project names for all users
    res.json(reportsWithProjectName);
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch reports." });
  }
});

// fetch project Total Timetracked for given projectid and date
router.get("/project/:projectId/:date", async (req, res, next) => {
  const { projectId, date } = req.params;
  if (!projectId || !date)
    return res.status(400).json({ err: "Missing Details" });
  const totalTimeTracked = await dbHandler("readReportByProjectIdAndDate", {
    projectId,
    date,
  });
  if (!totalTimeTracked?.status)
    return res.status(404).json({ err: "Report does not exist" });
  res.json({ ...totalTimeTracked.data });
});

// All Reports According to Date, ProjectId, UserId
router.get("/allReports/:date/:projectId/:userId", async (req, res, next) => {
  const { date, projectId, userId } = req.params;
  if (!date || !projectId || !userId)
    return res.status(400).json({ err: "Missing Details" });
  const allReports = await dbHandler("readReportByDateProjectIdUserId", {
    date,
    projectId,
    userId,
  });
  res.json({ ...allReports.data });
});

router.get(
  "/allReportsTimer/:date/:projectId/:userId",
  async (req, res, next) => {
    const { date, projectId, userId } = req.params;
    if (!date || !projectId || !userId)
      return res.status(400).json({ err: "Missing Details" });
    const allReports = await dbHandler("readReportByDateProjectIdUserId", {
      date,
      projectId,
      userId,
    });
    let totalTimeTracked = 0;
    if (allReports?.status) {
      totalTimeTracked = allReports.data.reduce(
        (sum, reportEntry) => sum + reportEntry.timeTracked,
        0
      );
    }
    res.json({ totalTimeTracked: totalTimeTracked });
  }
);

router.get("/project/:userId/:projectId/:date", async (req, res) => {
  const { userId, projectId, date } = req.params;

  // Ensure all required parameters are present
  if (!userId || !projectId || !date) {
    return res.status(400).json({ err: "Missing Details" });
  }

  try {
    const user = await dbHandler("readUserByUserId", { userId });
    if (!user?.status) return res.status(401).json({ err: user.err });

    const project = await dbHandler("readProject", { projectId });

    if (!project?.status) return res.status(404).json({ err: project.err });

    const report = await dbHandler("readReportByUserIdAndProjectIdAndDate", {
      userId,
      projectId,
      date,
    });

    if (!report?.status)
      return res.status(404).json({ err: "Report does not exist" });
    res.json({ ...todayReport.data });
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch total Time." });
  }
});
router.get("/projectalltime/:userId/:projectId/:date", async (req, res) => {
  const { userId, projectId, date } = req.params;

  // Ensure all required parameters are present
  if (!userId || !projectId || !date) {
    return res.status(400).json({ err: "Missing Details" });
  }

  try {
    const user = await dbHandler("readUserByUserId", { userId });
    if (!user?.status) return res.status(401).json({ err: user.err });

    const project = await dbHandler("readProject", { projectId });

    if (!project?.status) return res.status(404).json({ err: project.err });

    const report = await dbHandler("readReportByUserIdAndProjectIdAndDate", {
      userId,
      projectId,
      date,
    });
    let totalTimeTracked = 0;
    if (todayReport?.status) {
      totalTimeTracked = todayReport.data.reduce(
        (sum, reportEntry) => sum + reportEntry.timeTracked,
        0
      );
    }
    res.json({ totalTimeTracked: totalTimeTracked });
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch total Time." });
  }
});

// get Todays Report
router.get("/today/:userId", async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ err: "Missing Details" });
  // Get todays data in yyyy-mm-dd format
  const date = new Date().toISOString().split("T")[0];
  const todayReport = await dbHandler("readReportByUserIdAndDate", {
    userId,
    managerId: 12,
    date,
  });

  let totalTimeTracked = 0;
  if (todayReport?.status) {
    totalTimeTracked = todayReport.data.reduce(
      (sum, reportEntry) => sum + reportEntry.timeTracked,
      0
    );
  }
  console.log("TimeTrack--->", totalTimeTracked, todayReport);
  res.json({ totalTimeTracked: totalTimeTracked, todayReport: todayReport });
});

// get  Report by userId and date
router.get("/userId/:userId/:managerId/:date", async (req, res, next) => {
  const { userId, managerId, date } = req.params;
  if (!userId) return res.status(400).json({ err: "Missing Details" });
  // Get todays data in yyyy-mm-dd format
  const todayReport = await dbHandler("readReportByUserIdAndDate", {
    userId,
    managerId,
    date,
  });

  let totalTimeTracked = 0;
  if (todayReport?.status) {
    totalTimeTracked = todayReport.data.reduce(
      (sum, reportEntry) => sum + reportEntry.timeTracked,
      0
    );
  }
  console.log("TimeTrack--->", totalTimeTracked, todayReport);
  res.json({ totalTimeTracked: totalTimeTracked, todayReport: todayReport });
});

router.get(
  "/user/:userId/:managerId/:startDate/:endDate",
  async (req, res, next) => {
    const { userId, managerId, startDate, endDate } = req.params;

    if (!userId) return res.status(400).json({ err: "Missing Details" });

    const reports = await dbHandler("readReportByUserId", {
      userId,
      managerId,
    });

    if (!reports?.status)
      return res.status(404).json({ err: "Report does not exist" });

    const filteredReports = reports?.data?.filter((report) => {
      const reportStartTime = new Date(report.startTime);
      const reportEndTime = new Date(report.endTime);
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);

      return reportStartTime >= startDateTime && reportEndTime <= endDateTime;
    });

    const reportsWithProjectName = await Promise.all(
      filteredReports?.map(async (report) => {
        const project = await dbHandler("readProject", {
          projectId: report.projectId,
        });
        const projectName = project?.data?.projectName || "Project Not Found";
        return { ...report, projectName };
      })
    );

    res.json(reportsWithProjectName);
  }
);

module.exports = router;
