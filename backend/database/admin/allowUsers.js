const allowUsers = async (db, data) => {
  const existingUserInWorkspace = await db.collection("Workspace").findOne({
    workspaceId: data.workspaceId,
    members: { $elemMatch: { userId: data.userId } },
  });

  if (existingUserInWorkspace) {
    return { status: false, err: "User already exists in the workspace" };
  }
  
  const user = await db.collection("Users").findOneAndUpdate(
    { userId: data.userId },
    {
      $set: {
        userRole: data.userRole,
        approvalStatus: true,
        dateAdded: new Date(),
      },
    },
    { returnDocument: "after", projection: { _id: 0, projects: 0, tasks: 0 } }
  );

  if (!user)
    return { status: false, err: "An error occurred. Please try again" };

  const workspaceResult = await db
    .collection("Workspace")
    .findOneAndUpdate(
      { workspaceId: data.workspaceId },
      { $push: { members: user.value } }
    );

  await db
    .collection("Workspace")
    .findOneAndUpdate(
      { workspaceId: data.workspaceId },
      { $pull: { approvalMembers: { userId: user.value.userId } } }
    );

  if (!workspaceResult)
    return { status: false, err: "An error occurred. Please try again" };

  console.log("Response User", user.value);

  return { status: true, data: user.value };
};

module.exports = allowUsers;
