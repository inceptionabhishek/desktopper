const readReportByUserId = async (db, data) => {
  if (data?.managerId) {
    const managerResult = await db
      .collection("Users")
      .findOne({ userId: data.managerId });

    if (managerResult?.userRole === "manager") {
      const userResult = await db
        .collection("Users")
        .findOne({ userId: data?.userId });

      if (!userResult?.projects) {
        return { status: false, err: "An error occurred. Please try again" };
      } else {
        // Find common objects based on 'projectId'
        const commonObjects = managerResult?.projects.filter((managerProject) =>
          userResult?.projects.some(
            (resultProject) =>
              managerProject.projectId === resultProject.projectId
          )
        );

        // Extract all projectId values into an array
        const projectIds = Object.values(commonObjects).map(
          (item) => item.projectId
        );

        // Use the extracted projectIds in your MongoDB query
        const result = await db
          .collection("Reports")
          .find({ projectId: { $in: projectIds } })
          .toArray();

        if (!result || !result.length) return { status: true, data: [] };
        return { status: true, data: result };
      }
    } else {
      const result = await db
        .collection("Reports")
        .find({ userId: data.userId })
        .toArray();
      if (!result || !result.length)
        return { status: false, err: "No Report found" };
      return { status: true, data: result };
    }
  } else {
    const result = await db
      .collection("Reports")
      .find({ userId: data.userId })
      .toArray();
    if (!result || !result.length)
      return { status: false, err: "No Report found" };
    return { status: true, data: result };
  }
};

const readReportByWorkspaceId = async (db, data) => {
  const result = await db
    .collection("Reports")
    .find({ workspaceId: data.workspaceId })
    .toArray();

  if (!result || !result.length)
    return { status: false, err: "No Report found" };
  return { status: true, data: result };
};

const readReportByProjectId = async (db, data) => {
  const result = await db
    .collection("Reports")
    .find({ projectId: data.projectId })
    .toArray();
  if (!result || !result.length)
    return { status: false, err: "No Report found" };
  return { status: true, data: result };
};

const readReportByTaskId = async (db, data) => {
  const result = await db
    .collection("Reports")
    .find({ taskId: data.taskId })
    .toArray();
  if (!result || !result.length) return { status: false, err: "No Task found" };
  return { status: true, data: result };
};

const readReportByProjectIdAndDate = async (db, data) => {
  const result = await db
    .collection("Reports")
    .find({ projectId: data.projectId, date: data.date })
    .toArray();
  if (!result || !result.length)
    return { status: false, err: "No Report found" };
  const sumOfTimetracked = result.reduce(
    (acc, report) => acc + report.timeTracked,
    0
  );
  return { status: true, data: sumOfTimetracked };
};
const readReportByDateProjectIdUserId = async (db, data) => {
  const result = await db
    .collection("Reports")
    .find({ projectId: data.projectId, date: data.date, userId: data.userId })
    .toArray();
  if (!result || !result.length)
    return { status: false, err: "No Report found" };
  return { status: true, data: result };
};

const readReportByUserIdAndDate = async (db, data) => {
  if (data?.managerId) {
    const managerResult = await db
      .collection("Users")
      .findOne({ userId: data.managerId });

    if (managerResult?.userRole === "manager") {
      const userResult = await db
        .collection("Users")
        .findOne({ userId: data?.userId });

      if (!userResult?.projects) {
        return { status: false, err: "An error occurred. Please try again" };
      } else {
        // Find common objects based on 'projectId'
        const commonObjects = managerResult?.projects.filter((managerProject) =>
          userResult?.projects.some(
            (resultProject) =>
              managerProject.projectId === resultProject.projectId
          )
        );

        // Extract all projectId values into an array
        const projectIds = Object.values(commonObjects).map(
          (item) => item.projectId
        );

        // Use the extracted projectIds in your MongoDB query
        const result = await db
          .collection("Reports")
          .find({ projectId: { $in: projectIds }, date: data.date })
          .toArray();

        if (!result || !result.length) return { status: true, data: [] };
        return { status: true, data: result };
      }
    } else {
      const result = await db
        .collection("Reports")
        .find({ userId: data.userId, date: data.date })
        .toArray();
      if (!result || !result.length) return { status: true, data: [] };
      return { status: true, data: result };
    }
  } else {
    const result = await db
      .collection("Reports")
      .find({ userId: data.userId, date: data.date })
      .toArray();
    if (!result || !result.length) return { status: true, data: [] };
    return { status: true, data: result };
  }
};

module.exports = {
  readReportByUserId,
  readReportByWorkspaceId,
  readReportByProjectId,
  readReportByProjectIdAndDate,
  readReportByTaskId,
  readReportByDateProjectIdUserId,
  readReportByUserIdAndDate,
};
