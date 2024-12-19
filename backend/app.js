const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const jwt = require("jsonwebtoken");
const adminRouter = require("./routes/admin");
const sessionRouter = require("./routes/session");
const reportRouter = require("./routes/report");
const chargebeeRouter = require("./routes/chargebee");

const screenshotRouter = require("./routes/screenshots");
const supportRouter = require("./routes/support");
const { connectDb } = require("./database/db");
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
const decryptTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) {
      next();
    } else {
      req.cookies = decoded;
      next();
    }
  });
};
app.use(decryptTokenMiddleware);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/v1/auth", authRouter.router);
app.use(authRouter.authenticator);
app.use("/api/v1/", indexRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/report", reportRouter);
app.use("/api/v1/chargebee", chargebeeRouter);

app.use("/api/v1/screenshot", screenshotRouter);
app.use("/api/v1/support", supportRouter);
// send error for rest of the endpoints
app.use(function (req, res, next) {
  res.status(404).send("Invalid endpoint");
});
connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => console.log("server started"));
    app.on("error", (err) => console.log(err));
  })
  .catch((err) => console.log(err));
