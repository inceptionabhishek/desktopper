const express = require("express");
const { dbHandler } = require("../database/db");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const router = express.Router();
const supportRouter = express.Router();
router.use("/", supportRouter);

supportRouter.post("/createSupport", async (req, res, next) => {
  // const { userId } = req.body.userId;
  console.log(req.body);
  const { ticketDescription, ticketStatus, ticketReply, userId, date } =
    req.body;
  // if (!userId || !ticketDescription)
  //   return res.status(400).json({ err: "Missing Details" });
  console.log(userId);
  const user = await dbHandler("readUserByUserId", { userId });

  if (!userId) return res.status(404).json({ err: "User does not exist" });

  const result = await dbHandler("createSupport", {
    userId: userId,
    ticketDescription,
    ticketStatus,
    ticketReply,
    date,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

supportRouter.post("/updateSupport", async (req, res) => {
  // const { userId } = req.cookies;
  const { userId, supportId, ...otherInfo } = req.body;

  if (!userId || !supportId)
    return res.status(400).json({ err: "Missing Details" });
  const support = await dbHandler("readSupport", { supportId });
  if (support?.supportId) {
    return res.status(404).json({ err: "Support does not exist" });
  }
  const result = await dbHandler("updateSupport", {
    userId,
    supportId,
    updatedData: otherInfo,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

supportRouter.get("/getSupportByUserId/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!userId) return res.status(400).json({ err: "Missing user ID" });

  const supportTickets = await dbHandler("getSupportByUserId", { userId });

  res.json({ supportTickets });
});

module.exports = router;
