const { v4: uuidv4 } = require("uuid");

function generateWorkspaceId() {
  const uuid = uuidv4();
  const shortId = uuid.replace(/-/g, "").substr(0, 14);
  return "WID_" + shortId;
}

const createWorkSpace = async (db, data) => {
  data.workspaceId = generateWorkspaceId();
  
  const now = new Date();
  data.createdAt = now;
  data.updatedAt = now;

  const result = await db.collection("Workspace").insertOne(data);

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true, data };
};

const readWorkSpace = async (db, data) => {
  // const result = await db.collection('Workspace').findOne({ workspaceId: data.workspaceId })
  // if (!result)
  //     return { status: false, err: 'No workspace found' }
  // return { status: true, data: result }

  const result = await db
    .collection("Workspace")
    .find({ workspaceId: data.workspaceId })
    .toArray();

  if (!result || result.length === 0) {
    return { status: false, err: "No workspace found" };
  }

  return { status: true, data: result[0] };
};

const updateWorkSpace = async (db, data) => {
  const result = await db
    .collection("Workspace")
    .findOneAndUpdate({ workspaceId: data.workspaceId }, {});
  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true, data };
};

const updateSuperAdmin = async (db, data) => {
  const result = await db
    .collection("Workspace")
    .findOneAndUpdate(
      { workspaceId: data.workspaceId },
      { $set: { admin: data.userId } }
    );

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  const updatedUser = await db
    .collection("Users")
    .findOneAndUpdate(
      { userId: data.userId },
      { $set: { workspaceName: data.workspaceName } }
    );

  // Todo: Worspace Name is updated in db but not updated here in updatedUser
  if (!updatedUser)
    return { status: false, err: "An error occurred. Please try again" };

  return { status: true, updatedUser };
};

const addMembersToWorkSpace = async (db, data) => {
  const member = {
    userId: data.userId,
    approvalStatus: false,
    userRole: "pending",
    fullName: data.fullName,
    email: data.email,
    status: true,
  };

  const result = await db
    .collection("Workspace")
    .findOneAndUpdate(
      { workspaceId: data.workspaceId },
      { $push: { approvalMembers: member } },
      { returnNewDocument: true, projection: { _id: 0 } }
    );

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  return { status: true, data: result.value };
};

const removeMembersFromWorkspace = async (db, data) => {
  const result = await db.collection("Workspace").findOneAndUpdate(
    { workspaceId: data.workspaceId },
    {
      $pull: {
        approvalMembers: { userId: data.userId },
        members: { userId: data.userId },
      },
    },
    { projection: { _id: 0 }, returnDocument: "after" }
  );
  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  // Remove the member from associated Projects
  const updateProjectsResult = await db
    .collection("Projects")
    .updateMany(
      { "members.userId": data.userId },
      { $pull: { members: { userId: data.userId } } }
    );

  // Remove the member from associated Tasks
  const updateTasksResult = await db
    .collection("Tasks")
    .updateMany(
      { "members.userId": data.userId },
      { $pull: { members: { userId: data.userId } } }
    );

  await db.collection("Users").findOneAndUpdate(
    { userId: data.userId },
    {
      $set: {
        workspaceId: "",
        workspaceName: "",
        userRole: "admin",
        approvalStatus: false,
        projects: [],
        tasks: [],
      },
    }
  );
  return { status: true, data: result.value };
};

module.exports = {
  createWorkSpace,
  readWorkSpace,
  updateWorkSpace,
  updateSuperAdmin,
  addMembersToWorkSpace,
  removeMembersFromWorkspace,
};
