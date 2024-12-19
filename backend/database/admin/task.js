function generateTaskId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "TID";

  for (let i = 0; i < 48; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  return id;
}

const createTask = async (db, data) => {
  console.log("db", data.members);
  data = {
    ...data,
    createdBy: data.createdBy,
    taskName: data.taskName,
    completed: false,
    projectId: data.projectId,
    taskDescription: data.taskDescription,
    members: data.members || [],
    createdAt: new Date(),
    updatedAt:new Date(),
    dueDate: data.dueDate || null,
    taskStatus: data.taskStatus,
  };

  data.taskId = generateTaskId();

  const result = await db.collection("Tasks").insertOne(data);

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  data.members.forEach(async (member) => {
    await db.collection("Users").findOneAndUpdate(
      { userId: member.userId },
      {
        $push: {
          tasks: {
            taskName: data.taskName,
            completed: false,
            projectId: data.projectId,
            taskDescription: data.taskDescription,
            createdAt: new Date(),
            dueDate: data.dueDate || null,
            taskStatus: data.taskStatus,
            taskId: data.taskId,
          },
        },
      }
    );
  });

  // If taskStatus is in ToDo then In projects collection increase the task field by 1
  if (data.taskStatus === "ToDo") {
    await db
      .collection("Projects")
      .updateOne({ projectId: data.projectId }, { $inc: { task: 1 } });
  }
  return { status: true, data };
};

const readTask = async (db, data) => {
  const result = await db.collection("Tasks").findOne({ taskId: data.taskId });
  if (!result) return { status: false, err: "No task found" };
  return { status: true, data: result };
};

const addMembersToTask = async (db, data) => {
  const result = await db
    .collection("Tasks")
    .findOneAndUpdate(
      { taskId: data.taskId },
      { $push: { members: { $each: data.members } } },
      { projection: { _id: 0 }, returnDocument: "after" }
    );

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  const task = { taskId: data.taskId, taskName: data.taskName };

  const users = data.members.map((member) => member.userId);

  await db
    .collection("Users")
    .updateMany({ userId: { $in: users } }, { $push: { tasks: task } });

  return { status: true, data: result.value };
};

const removeMembersFromTask = async (db, data) => {
  const users = data.members.map((member) => member.userId);
  const result = await db
    .collection("Tasks")
    .findOneAndUpdate(
      { taskId: data.taskId },
      { $pull: { members: { userId: { $in: users } } } },
      { projection: { _id: 0 }, returnDocument: "after" }
    );
  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  await db
    .collection("Users")
    .updateMany(
      { userId: { $in: users } },
      { $pull: { tasks: { taskId: data.taskId } } }
    );
  return { status: true, data: result.value };
};

const updateTask = async (db, data) => {
  const findTask = await db
    .collection("Tasks")
    .findOne({ taskId: data.taskId });
  if (!findTask) return { status: false, err: "Task does not exist" };
  if (findTask.taskStatus !== data.updatedData.taskStatus) {
    if (
      findTask.taskStatus === "ToDo" &&
      data.updatedData.taskStatus !== "ToDo"
    ) {
      await db
        .collection("Projects")
        .updateOne({ projectId: findTask.projectId }, { $inc: { task: -1 } });
    } else if (
      findTask.taskStatus !== "ToDo" &&
      data.updatedData.taskStatus === "ToDo"
    ) {
      await db
        .collection("Projects")
        .updateOne({ projectId: findTask.projectId }, { $inc: { task: 1 } });
    }
  }
  const result = await db
    .collection("Tasks")
    .findOneAndUpdate(
      { taskId: data.taskId },
      { $set: data.updatedData },
      { projection: { _id: 0 }, returnDocument: "after" }
    );
  // Users Table Update QUERY:

  // 1: update the users collection find all user which contains this taskId in their tasks array, then check if
  // the user is present in the members array, if not then pull the task from the user
  const users = await db
    .collection("Users")
    .find({ "tasks.taskId": data.taskId })
    .toArray();
  console.log("data:in tasks", data);
  console.log("users", users);
  for (let i = 0; i < users?.length; i++) {
    const user = users[i];
    const task = user?.tasks?.find((task) => task.taskId === data.taskId);
    if (!data.updatedData.members.includes(user.userId)) {
      await db
        .collection("Users")
        .updateOne(
          { userId: user.userId },
          { $pull: { tasks: { taskId: data.taskId } } }
        );
    }
  }

  // Find this task in Tasks Collection
  const taskFind = await db
    .collection("Tasks")
    .findOne({ taskId: data.taskId });
  console.log("taskFind", taskFind);

  // now traverse the member array and check if this taskId is present in the user's tasks array
  // then do nothing, else push the task in the user's tasks array
  for (let i = 0; i < data.updatedData.members.length; i++) {
    const member = data.updatedData.members[i];
    console.log("member : ", member);
    const user = await db
      .collection("Users")
      .findOne({ userId: member.userId });
    console.log("user : ", user);
    const task = user?.tasks?.find((task) => task?.taskId === data?.taskId);
    if (!task) {
      await db.collection("Users").updateOne(
        { userId: member.userId },
        {
          $push: {
            tasks: {
              taskName: data.updatedData.taskName,
              completed: taskFind.completed,
              projectId: taskFind.projectId,
              taskDescription: data.updatedData.taskDescription,
              createdAt: taskFind.createdAt,
              dueDate: data.updatedData.dueDate,
              taskStatus: data.updatedData.taskStatus,
              taskId: data.taskId,
            },
          },
        }
      );
    }
  }
  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  return { status: true, data: result.value };
};

const updateTaskForStatus = async (db, data) => {
  const findTask = await db
    .collection("Tasks")
    .findOne({ taskId: data.taskId });
  if (!findTask) return { status: false, err: "Task does not exist" };
  if (findTask.taskStatus !== data.updatedData.taskStatus) {
    if (
      findTask.taskStatus === "ToDo" &&
      data.updatedData.taskStatus !== "ToDo"
    ) {
      await db
        .collection("Projects")
        .updateOne({ projectId: findTask.projectId }, { $inc: { task: -1 } });
    } else if (
      findTask.taskStatus !== "ToDo" &&
      data.updatedData.taskStatus === "ToDo"
    ) {
      await db
        .collection("Projects")
        .updateOne({ projectId: findTask.projectId }, { $inc: { task: 1 } });
    }
  }
  const result = await db
    .collection("Tasks")
    .findOneAndUpdate(
      { taskId: data.taskId },
      { $set: data.updatedData },
      { projection: { _id: 0 }, returnDocument: "after" }
    );
  // In users collection, find all users which contains this taskId in their tasks array, then update the taskStatus
  // of this task in the user's tasks array
  const users = await db
    .collection("Users")
    .find({ "tasks.taskId": data.taskId })
    .toArray();
  console.log("data:in tasks", data);
  console.log("users", users);
  for (let i = 0; i < users?.length; i++) {
    const user = users[i];
    const task = user?.tasks?.find((task) => task.taskId === data.taskId);
    if (task) {
      await db
        .collection("Users")
        .updateOne(
          { userId: user.userId, "tasks.taskId": data.taskId },
          { $set: { "tasks.$.taskStatus": data.updatedData.taskStatus } }
        );
    }
  }

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  return { status: true, data: result.value };
};

const deleteTask = async (db, data) => {
  const result = await db
    .collection("Tasks")
    .deleteOne({ taskId: data.taskId });
  const user = await db
    .collection("Users")
    .updateOne(
      { userId: data.userId },
      { $pull: { tasks: { taskId: data.taskId } } }
    );
  if (!result) return { status: false, err: "Task does not exist" };
  return { status: true, msg: "Task deleted" };
};

const viewallTask = async (db, data) => {
  const result = await db
    .collection("Tasks")
    .find({ projectId: data.projectId })
    .toArray();

  if (!result) return { status: false, err: "Project does not exist" };

  return { status: true, data: result };
};

const viewUserTask = async (db, data) => {
  const result = await db
    .collection("Tasks")
    .find({ projectId: data.projectId, createdBy: data.userId })
    .toArray();

  if (!result) return { status: false, err: "Project does not exist" };

  return { status: true, data: result };
};

module.exports = {
  createTask,
  readTask,
  updateTask,
  addMembersToTask,
  removeMembersFromTask,
  deleteTask,
  viewallTask,
  viewUserTask,
  updateTaskForStatus,
};
