const express = require("express");
const { dbHandler } = require("../database/db");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const router = express.Router();
const screenshotRouter = express.Router();
router.use("/screenshot", screenshotRouter);
const uploadS3 = async (base64) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  const s3BucketName = "Desktopperscreenshots";
  const imageBuffer = Buffer.from(base64.split(",")[1], "base64");
  const params = {
    Bucket: s3BucketName,
    Key: `${uuidv4()}.png`,
    Body: imageBuffer,
    ContentType: "image/png",
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        // console.log(`Image uploaded successfully. URL: ${data.Location}`);
        resolve(data.Location);
      }
    });
  });
};
router.post("/create", async (req, res) => {
  const base64 = req.body.screenshot;
  if (!base64)
    return res.status(400).json({ message: "No screenshot provided" });
  const screenshotUrl = await uploadS3(base64);
  console.log("ssurl", screenshotUrl);
  res.json({ screenshotUrl });
});

module.exports = router;
