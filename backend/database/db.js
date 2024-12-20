const { MongoClient, ServerApiVersion } = require("mongodb");
const createUser = require("./user/createUser");
const {
  readUser,
  readUserByUserId,
  readUserByEmail,
  readUserByUserIdforArray,
  viewProjectByUserId,
  getAllUser,
  getUserMembers,
} = require("./user/readUser");
const {
  createAuth,
  readAuth,
  updateAuth,
  deleteAuth,
} = require("./user/accessTokens");
const deleteUser = require("./user/deleteUser");
const {
  updateUser,
  updateUserRole,
  updatePassword,
  updateAccountStatus,
  updateAccountStatusByEmail,
  updateLoginCountByEmail,
  updateIsPopupShowed,
} = require("./user/updateUser");

const {
  readVerificationToken,
  createVerificationToken,
  readToken,
} = require("./user/verificationTokens");
const {
  createWorkSpace,
  updateWorkSpace,
  updateSuperAdmin,
  addMembersToWorkSpace,
  readWorkSpace,
  removeMembersFromWorkspace,
} = require("./admin/workspace");
const allowUsers = require("./admin/allowUsers");
const {
  createProject,
  updateProject,
  addMembersToProject,
  readProject,
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
} = require("./admin/project");
const { createSession } = require("./session/createSession");
const { createReport } = require("./report/createReport");
const {
  readReportByUserId,
  readReportByWorkspaceId,
  readReportByProjectId,
  readReportByTaskId,
  readReportByDateProjectIdUserId,
  readReportByUserIdAndDate,
} = require("./report/readReport");
const { createScreenshot, readScreenshots } = require("./report/screenshots");
const {
  createTask,
  readTask,
  updateTask,
  addMembersToTask,
  removeMembersFromTask,
  deleteTask,
  viewallTask,
  viewUserTask,
  updateTaskForStatus,
} = require("./admin/task");

const {
  createSupport,
  readSupports,
  updateSupport,
  viewSupport,
  getSupportByUserId,
} = require("./support/support");

require("dotenv").config();
const uri = process.env.MONGO_URI;
const modes = {
  createUser,
  readUser,
  readUserByUserId,
  readUserByEmail,
  readUserByUserIdforArray,
  viewProjectByUserId,
  getAllUser,
  getUserMembers,
  updateUser,
  updateUserRole,
  createAuth,
  readAuth,
  updateAuth,
  deleteUser,
  readToken,
  readVerificationToken,
  createVerificationToken,
  createWorkSpace,
  updateAccountStatusByEmail,
  updateLoginCountByEmail,
  updateIsPopupShowed,
  updateWorkSpace,
  updateSuperAdmin,
  addMembersToWorkSpace,
  readWorkSpace,
  createProject,
  updateProject,
  addMembersToProject,
  updateAccountStatus,
  readProject,
  viewProject,
  removeMembersFromProject,
  deleteProject,
  allowUsers,
  updatePassword,
  deleteAuth,
  updateMembersInProject,
  readMembersInProject,
  removeMembersFromWorkspace,
  createTask,
  readTask,
  updateTask,
  addMembersToTask,
  removeMembersFromTask,
  deleteTask,
  viewallTask,
  viewUserTask,
  addStatus,
  removeStatus,
  IncrementTodo,
  DecrementTodo,
  populateProject,
  createSession,
  createReport,
  readReportByUserId,
  readReportByWorkspaceId,
  readReportByProjectId,
  readReportByTaskId,
  readReportByDateProjectIdUserId,
  createScreenshot,
  readScreenshots,
  readStatus,
  createSupport,
  readSupports,
  updateSupport,
  viewSupport,
  getSupportByUserId,
  updateTaskForStatus,
  readReportByUserIdAndDate,
};

const client = new MongoClient(process.env.MONGO_DB, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectDb = async () => {
  await client.connect();
};
const dbHandler = async (mode, data) => {
  const db = client.db(process.env.MONGO_DB);
  if (typeof modes[mode] !== "function") return false;
  const result = await modes[mode](db, data);
  return result;
};

module.exports = { connectDb, dbHandler };
