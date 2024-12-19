const bcrypt = require("bcrypt");
const updateUser = async (db, data) => {
  delete data.updatedData._id;

  const result = await db
    .collection("Users")
    .findOneAndUpdate(
      { userId: data.userId },
      { $set: data.updatedData },
      { returnDocument: "after", projection: { _id: 0, password: 0 } }
    );
  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true, data };
};

const updatePassword = async (db, data) => {
  data.password = await bcrypt.hash(data.password, 10);
  const result = await db
    .collection("Users")
    .findOneAndUpdate(
      { email: data.email },
      { $set: { password: data.password } },
      { returnDocument: "after", projection: { _id: 0, password: 0 } }
    );
  console.log(result);

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true, data };
};

const updateUserRole = async (db, data) => {
  const result = await db
    .collection("Users")
    .findOneAndUpdate(
      { userId: data.userId },
      { $set: { userRole: data.userRole } },
      { returnDocument: "after", projection: { _id: 0, password: 0 } }
    );

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  const workspace = await db
    .collection("Workspace")
    .find({ workspaceId: data.workspaceId })
    .toArray();

  if (!workspace || workspace.length === 0) {
    return { status: false, err: "No workspace found" };
  }

  const member = await db
    .collection("Workspace")
    .findOneAndUpdate(
      { "members.userId": data.userId },
      { $set: { "members.$.userRole": data.userRole } },
      { returnDocument: "after", projection: { _id: 0, password: 0 } }
    );

  if (member.modifiedCount === 0) {
    return { status: false, err: "User not found or role unchanged." };
  }

  // Update user role in the Projects table
  const updateProjectsResult = await db
    .collection("Projects")
    .updateMany(
      { "members.userId": data.userId },
      { $set: { "members.$.userRole": data.userRole } }
    );

  // Update user role in the Tasks table
  const updateTasksResult = await db
    .collection("Tasks")
    .updateMany(
      { "members.userId": data.userId },
      { $set: { "members.$.userRole": data.userRole } }
    );

  // Check if any projects or tasks were updated
  // if (
  //   updateProjectsResult.modifiedCount === 0 &&
  //   updateTasksResult.modifiedCount === 0
  // ) {
  //   return {
  //     status: false,
  //     err: "User not found in projects or tasks, or role unchanged in both.",
  //   };
  // }

  return {
    status: true,
    message: "User role updated successfully.",
  };
};

const updateAccountStatus = async (db, data) => {
  const result = await db
    .collection("Users")
    .findOneAndUpdate(
      { userId: data.userId },
      { $set: { accountStatus: data.accountStatus } },
      { returnDocument: "after", projection: { _id: 0, password: 0 } }
    );

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true, data };
};
const updateAccountStatusByEmail = async (db, data) => {
  const result = await db
    .collection("Users")
    .findOneAndUpdate(
      { email: data.email },
      { $set: { accountStatus: data.accountStatus } },
      { returnDocument: "after", projection: { _id: 0, password: 0 } }
    );

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true, data };
};

const updateLoginCountByEmail = async (db, data) => {
  const result = await db
    .collection("Users")
    .findOneAndUpdate(
      { email: data.email },
      { $inc: { loginCount: 1 } },
      { returnDocument: "after", projection: { _id: 0, password: 0 } }
    );

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true, data: result.value };
};

const updateIsPopupShowed = async (db, data) => {
  const result = await db
    .collection("Users")
    .findOneAndUpdate(
      { email: data.email },
      { $set: { isPopupShowed: true } },
      { returnDocument: "after", projection: { _id: 0, password: 0 } }
    );

  console.log("result123", result);

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true, data: result.value };
};

module.exports = {
  updateUser,
  updateUserRole,
  updatePassword,
  updateAccountStatus,
  updateAccountStatusByEmail,
  updateLoginCountByEmail,
  updateIsPopupShowed,
};
