function generateProjectId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "PID";

  for (let i = 0; i < 48; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  return id;
}

const createProject = async (db, data) => {
  data.projectId = generateProjectId();
  // Add timestamps
  const now = new Date();
  data.createdAt = now;
  data.updatedAt = now;

  const result = await db.collection("Projects").insertOne(data);
  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  const project = {
    projectId: data.projectId,
    userRole: data.members[0].userRole,
    projectName: data.projectName,
  };

  await db
    .collection("Users")
    .findOneAndUpdate(
      { userId: data.createdBy },
      { $push: { projects: project } }
    );

  return { status: true, data };
};

const viewProject = async (db, data) => {
  const result = await db
    .collection("Projects")
    .find({ workspaceId: data.workspaceId })
    .toArray();

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  return { status: true, data: result };
};

const readProject = async (db, data) => {
  const result = await db
    .collection("Projects")
    .findOne({ projectId: data.projectId });
  if (!result) return { status: false, err: "No project found" };
  return { status: true, data: result };
};

const readStatus = async (db, data) => {
  const result = await db
    .collection("Projects")
    .findOne({ projectId: data.projectId });
  if (!result) return { status: false, err: "No project found" };
  // check if in result.status contains data.status
  const status = result.status.find(
    (status) => status.statusName === data.statusName
  );
  if (!status) return { status: false, err: "No status found" };
  return { status: true, data: status };
};

const addStatus = async (db, data) => {
  const result = await db
    .collection("Projects")
    .updateOne(
      { projectId: data.projectId },
      { $push: { status: { statusName: data.statusName } } }
    );

  // if data.statusName is ToDo then increment the task field in projects collection
  if (data.statusName === "ToDo") {
    await db
      .collection("Projects")
      .updateOne({ projectId: data.projectId }, { $inc: { task: 1 } });
  }

  if (!result) return { status: false, err: "No project found" };

  return { status: true, data: result };
};

const removeStatus = async (db, data) => {
  const result = await db
    .collection("Projects")
    .updateOne(
      { createdBy: data.userId },
      { $pull: { status: { statusName: data.statusName } } }
    );
  if (!result) return { status: false, err: "No project found" };
  // delete all tasks which has projectId and statusName
  const resultTaskDelete = await db
    .collection("Tasks")
    .deleteMany({ userId: data.createdBy, statusName: data.statusName });
  if (!resultTaskDelete)
    return { status: false, err: "No task found with this status" };
  // Also pull all task which is present in Users collection in tasks array with projectId and statusName
  const resultUserTaskDelete = await db.collection("Users").updateMany(
    {
      userId: data.userId,
    },
    {
      $pull: {
        tasks: { statusName: data.statusName },
      },
    }
  );
  if (!resultUserTaskDelete)
    return { status: false, err: "No task found with this status" };

  if (data.statusName === "ToDo") {
    await db
      .collection("Projects")
      .updateOne({ projectId: data.projectId }, { $inc: { task: -1 } });
  }
  return { status: true, data: result };
};

const addMembersToProject = async (db, data) => {
  const result = await db
    .collection("Projects")
    .findOneAndUpdate(
      { projectId: data.projectId },
      { $push: { members: { $each: data.members } } },
      { projection: { _id: 0 }, returnDocument: "after" }
    );
  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  const project = { projectId: data.projectId, projectName: data.projectName };
  const users = data.members.map((member) => member.userId);
  await db
    .collection("Users")
    .updateMany({ userId: { $in: users } }, { $push: { projects: project } });
  return { status: true, data: result.value };
};

const updateMembersInProject = async (db, data) => {
  const projectId = data.projectId;
  const members = data.members;
  const projectName = data.projectName;
  console.log(members);

  // update the project collection
  const result = await db
    .collection("Projects")
    .findOneAndUpdate(
      { projectId: projectId },
      { $set: { members: members } },
      { projection: { _id: 0 }, returnDocument: "after" }
    );
  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  // update the users collection
  // find all user which contains this projectId in their projects array, then check if
  // the user is present in the members array, if not then pull the project from the user
  const users = await db
    .collection("Users")
    .find({ "projects.projectId": projectId })
    .toArray();
  console.log(users);
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const userId = user.userId;
    const projects = user?.projects;
    const projectIndex = projects.findIndex(
      (project) => project.projectId === projectId
    );
    if (projectIndex === -1) continue;
    const project = projects[projectIndex];
    const memberIndex = members.findIndex((member) => member.userId === userId);
    if (memberIndex === -1) {
      await db
        .collection("Users")
        .updateOne({ userId: userId }, { $pull: { projects: project } });
    }
  }
  // now traverse the member array and check if this projectId is present in the user's projects array
  // then do nothing, else push the project in the user's projects array
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    const userId = member.userId;
    const user = await db
      .collection("Users")
      .findOne({ userId: userId }, { projects: 1 });
    const projects = user?.projects;
    const projectIndex = projects.findIndex(
      (project) => project.projectId === projectId
    );
    if (projectIndex === -1) {
      // push the { projectId, projectName } in the user's projects array
      await db
        .collection("Users")
        .updateOne(
          { userId: userId },
          { $push: { projects: { projectId, projectName, userRole: "admin" } } }
        );
    }
  }
  return { status: true, data: result.value };
};

const removeMembersFromProject = async (db, data) => {
  const users = data.members.map((member) => member.userId);

  const result = await db
    .collection("Projects")
    .findOneAndUpdate(
      { projectId: data.projectId },
      { $pull: { members: { userId: { $in: users } } } },
      { projection: { _id: 0 }, returnDocument: "after" }
    );

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  await db
    .collection("Users")
    .updateMany(
      { userId: { $in: users } },
      { $pull: { projects: { projectId: data.projectId } } }
    );

  return { status: true, data: result.value };
};

const IncrementTodo = async (db, data) => {
  const result = await db
    .collection("Projects")
    .findOneAndUpdate(
      { projectId: data.projectId },
      { $inc: { task: 1 } },
      { projection: { _id: 0 }, returnDocument: "after" }
    );

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  return { status: true, data: result.value };
};

const DecrementTodo = async (db, data) => {
  const result = await db
    .collection("Projects")
    .findOneAndUpdate(
      { projectId: data.projectId },
      { $de: { task: -1 } },
      { projection: { _id: 0 }, returnDocument: "after" }
    );

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  return { status: true, data: result.value };
};

const updateProject = async (db, data) => {
  const result = await db
    .collection("Projects")
    .findOneAndUpdate(
      { projectId: data.projectId },
      { $set: data.updatedData },
      { projection: { _id: 0 }, returnDocument: "after" }
    );

  if (data.updatedData.projectName) {
    const users = result.value.members.map((member) => member.userId);

    await db.collection("Users").updateMany(
      { userId: { $in: users } },
      {
        $set: {
          "projects.$[elem].projectName": data.updatedData.projectName,
        },
      },
      { arrayFilters: [{ "elem.projectId": data.projectId }] }
    );
  }

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true, data: result.value };
};

const deleteProject = async (db, data) => {
  const result = await db
    .collection("Projects")
    .deleteOne({ projectId: data.projectId });

  if (!result) return { status: false, err: "Project does not exist" };

  const users = data.members.map((member) => member.userId);

  await db
    .collection("Users")
    .updateMany(
      { userId: { $in: users } },
      { $pull: { projects: { projectId: data.projectId } } }
    );

  // Also remove all tasks related to deleted project from Users collection in tasks array
  await db
    .collection("Users")
    .updateMany(
      { userId: { $in: users } },
      { $pull: { tasks: { projectId: data.projectId } } }
    );

  // Also remove all tasks related to deleted project from Tasks collection
  await db.collection("Tasks").deleteMany({ projectId: data.projectId });

  return { status: true, msg: "Project deleted" };
};

const readMembersInProject = async (db, data) => {
  const result = await db
    .collection("Projects")
    .findOne({ projectId: data.projectId }, { members: 1 });
  if (!result) return { status: false, err: "No project found" };
  return { status: true, data: result };
};

const populateProject = async (db, data) => {
  const result = await db
    .collection("Projects")
    .find({ projectId: { $in: data.projectIds } })
    .toArray();

  if (result.length === 0) {
    return { status: false, err: "No projects found" };
  }

  return { status: true, data: result };
};

module.exports = {
  createProject,
  readProject,
  updateProject,
  addMembersToProject,
  removeMembersFromProject,
  deleteProject,
  updateMembersInProject,
  readMembersInProject,
  viewProject,
  addStatus,
  removeStatus,
  IncrementTodo,
  DecrementTodo,
  populateProject,
  readStatus,
};
