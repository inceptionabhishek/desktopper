const deleteUser = async (db, data) => {
  const result = await db.collection("Users").deleteOne({
    userId: data.userId,
  });

  await db
    .collection("Projects")
    .updateMany(
      { "members.userId": data.userId },
      { $pull: { members: data.userId } }
    );

  await db.collection("Reports").deleteMany({ userId: data.userId });
  await db.collection("VerificationTokens").deleteMany({ userId: data.userId });

  await db
    .collection("Tasks")
    .updateMany(
      { "members.userId": data.userId },
      { $pull: { members: data.userId } }
    );
  await db
    .collection("Workspace")
    .updateMany(
      { "members.userId": data.userId },
      { $pull: { members: data.userId } }
    );

  if (!result.deletedCount) {
    return { status: false, err: "User not found" };
  }

  return { status: true, msg: "User deleted" };
};
module.exports = deleteUser;
