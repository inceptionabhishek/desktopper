const bcrypt = require("bcrypt");
const readUser = async (db, data) => {
  const result = await db
    .collection("Users")
    .findOne(
      { email: data.email },
      { projection: { _id: 0, tasks: 0, projects: 0 } }
    );
  if (!result) return { status: false, err: "Email does not exist" };
  const passwordMatch = await bcrypt.compare(data.password, result.password);
  if (!passwordMatch) return { status: false, err: "Wrong credentials" };
  delete result.password;

  console.log(result);

  return { status: true, data: result };
};
const readUserByUserId = async (db, data) => {
  const result = await db.collection("Users").findOne({ userId: data.userId });

  if (!result) return { status: false, err: "User does not exist" };
  return { status: true, data: result };
};

const readUserByEmail = async (db, data) => {
  const result = await db.collection("Users").findOne({ email: data.email });

  if (!result) return { status: false, err: "User does not exist" };
  return { status: true, data: result };
};

const readUserByUserIdforArray = async (db, data) => {
  const result = await db
    .collection("Users")
    .find({ userId: data.userId })
    .toArray();

  if (!result) return { status: false, err: "User does not exist" };
  return { status: true, data: result };
};

const getAllUser = async (db, data) => {
  const result = await db
    .collection("Users")
    .find({ workspaceId: data.workspaceId, approvalStatus: true })
    .toArray();

  if (!result) return { status: false, err: "Users is empty" };
  return { status: true, data: result };
};

const getUserMembers = async (db, data) => {
  const user = await db.collection("Users").findOne({ userId: data.userId });

  if (!user) {
    return { status: false, err: "User not found." };
  }

  // if (!user.projects || user.projects.length === 0) {
  //   return { status: false, err: "User does not have any project." };
  // }

  const resultData = {};
  resultData[user?.userId] = user?.fullName;

  for (const project of user.projects) {
    const projectId = project.projectId;
    const foundProject = await db.collection("Projects").findOne({ projectId });

    if (foundProject) {
      for (const member of foundProject.members) {
        const memberId = member.userId;
        const memberFullName = member.fullName;

        if (!resultData[memberId]) {
          resultData[memberId] = memberFullName;
        }
      }
    } else {
      console.log(`Project with projectId ${projectId} not found.`);
    }
  }

  if (Object.keys(resultData).length === 0) {
    return { status: false, err: "Something went wrong or no members found." };
  }

  const resultArray = [];

  for (const memberId in resultData) {
    resultArray.push({ userId: memberId, fullName: resultData[memberId] });
  }

  return { status: true, data: resultArray };
};

const viewProjectByUserId = async (db, data) => {
  if (data?.managerId) {
    const managerResult = await db
      .collection("Users")
      .findOne({ userId: data.managerId });

    if (managerResult?.userRole === "manager") {
      const result = await db
        .collection("Users")
        .findOne({ userId: data?.userId });

      if (!result?.projects) {
        return { status: false, err: "An error occurred. Please try again" };
      } else {
        // Find common objects based on 'projectId'
        const commonObjects = managerResult?.projects.filter((managerProject) =>
          result?.projects.some(
            (resultProject) =>
              managerProject.projectId === resultProject.projectId
          )
        );

        return { status: true, data: commonObjects };
      }
    } else {
      const result = await db
        .collection("Users")
        .findOne({ userId: data?.userId });

      if (!result?.projects)
        return { status: false, err: "An error occurred. Please try again" };

      return { status: true, data: result.projects };
    }
  } else {
    const result = await db
      .collection("Users")
      .find({ userId: data.userId })
      .toArray();

    if (!result[0]?.projects)
      return { status: false, err: "An error occurred. Please try again" };

    return { status: true, data: result[0].projects };
  }
};

module.exports = {
  readUser,
  readUserByUserId,
  readUserByEmail,
  readUserByUserIdforArray,
  getAllUser,
  getUserMembers,
  viewProjectByUserId,
};
