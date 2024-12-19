const express = require("express");
const { dbHandler } = require("../database/db");

const router = express.Router();
const sessionRouter = express.Router();
router.use("/session", sessionRouter);

// session for user for time tracking

router.post("/createSession", async (req, res) => {
  const data = req.body;
  console.log(data);
  const result = await dbHandler("createSession", data);
  if (!result.status) return res.status(400).json(result);
  return res.status(200).json(result);
});

module.exports = router;
