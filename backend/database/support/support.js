function generateSupportId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "PID";

  for (let i = 0; i < 48; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  return id;
}

const createSupport = async (db, data) => {
  console.log("data", data);
  data.supportId = generateSupportId();
  const result = await db.collection("Supports").insertOne(data);
  if (!result) {
    return { status: false, err: "An error occurred. Please try again" };
  }
  const support = {
    supportId: data.supportId,
    ticketDescription: data.ticketDescription,
    ticketStatus: data.ticketStatus,
    date: data.date,
    ticketReply: data.ticketReply || "",
  };

  await db
    .collection("Users")
    .findOneAndUpdate(
      { userId: data.userId },
      { $push: { supports: support } }
    );

  return { status: true, data };
};

const viewSupport = async (db, data) => {
  const result = await db
    .collection("Supports")
    .find({ userId: data.userId })
    .toArray();

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  return { status: true, data: result };
};

const readSupports = async (db, data) => {
  const result = await db
    .collection("Support")
    .findOne({ supportId: data.supportId });
  if (!result) return { status: false, err: "No project found" };
  return { status: true, data: result };
};

const updateSupport = async (db, data) => {
  const result = await db.collection("Supports").findOneAndUpdate(
    {
      supportId: data.supportId,
    },
    { $set: data.updatedData }
  );

  if (data.updatedData.ticketReply || data.updatedData.ticketStatus) {
    await db.collection("Users").updateMany(
      { userId: { $in: [data?.userId] } },
      {
        $set: {
          "supports.$[elem].ticketReply": data.updatedData.ticketReply,
          "supports.$[elem].ticketStatus": data.updatedData.ticketStatus,
        },
      },
      { arrayFilters: [{ "elem.supportId": data.supportId }] }
    );
  }

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true, data: result.value };
};

const getSupportByUserId = async (db, data) => {
  const result = await db
    .collection("Supports")
    .find({ userId: data.userId })
    .toArray();

  if (!result)
    return { status: false, err: "An error occurred. Please try again" };

  return { status: true, data: result };
};

module.exports = {
  createSupport,
  readSupports,
  updateSupport,
  viewSupport,
  getSupportByUserId,
};
