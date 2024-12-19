const express = require("express");
const { dbHandler } = require("../database/db");
const formData = require("form-data");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const { SendMailClient } = require("zeptomail");
const url = process.env.ZEPTOMAIL_URL;
const token = process.env.ZEPTOMAIL_TOKEN;

let client = new SendMailClient({ url, token });
const verifyAccessToken = async (userId, accessToken, refreshToken) => {
  try {
    const isAccessTokenValid = jwt.verify(
      accessToken,
      process.env.ACCESS_SECRET
    );
    // if access token not valid or userid is other the user who's logged in return 403
    if (!isAccessTokenValid || isAccessTokenValid?.data?.userId !== userId)
      return 403;
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return createAccessToken(userId, refreshToken);
    else return 403;
  }

  // else move to next part to handle refresh tokens
  try {
    const isRefreshTokenValid = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET
    );

    // if refresh token not valid or userid is other the user who's logged in
    if (!isRefreshTokenValid || isRefreshTokenValid?.data?.userId !== userId)
      return 401;
  } catch (error) {
    return 403;
  }

  // check database whether the refresh token exist and match it with access token

  const auth = await dbHandler("readAuth", {
    userId,
    refreshToken,
    accessToken,
  });
  // if access token matches in db and return 200
  if (auth === 200) return 200;
  return 403;
};

const createAccessToken = async (userId, refreshToken) => {
  // if refresh token exist i.e user asking for new access token
  if (refreshToken) {
    try {
      const isRefreshTokenValid = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
      );

      // if refresh token is invalid or userid is not same as the user who's logged in
      if (!isRefreshTokenValid || isRefreshTokenValid?.data?.userId !== userId)
        return 403;

      // check whether refresh token exist or not in db
      const auth = await dbHandler("readAuth", { userId, refreshToken });

      // if it does not exist send err
      if (auth !== 200) return 403;

      const accessToken = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          data: { userId, timestamp: Date.now() },
        },
        process.env.ACCESS_SECRET
      );
      // update jwt access token in db
      const authResult = await dbHandler("updateAuth", {
        userId,
        refreshToken,
        accessToken,
      });

      if (authResult === 200) return { accessToken };
    } catch (error) {
      return 403;
    }
  }
  // if refresh token does not exist means generate new refresh token i.e login/sign up
  else {
    const timestamp = Date.now();
    // new access token
    const accessToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        data: { userId, timestamp: timestamp },
      },
      process.env.ACCESS_SECRET
    );
    // new refresh token
    const newRefreshToken = jwt.sign(
      {
        exp: Math.floor(timestamp / 1000) + 60 * 60 * 24 * 7,
        data: { userId, accessToken, timestamp },
      },
      process.env.REFRESH_SECRET
    );
    // store them in db
    const authResult = await dbHandler("createAuth", {
      userId,
      refreshToken: newRefreshToken,
      accessToken,
      createdOn: timestamp,
    });

    if (authResult === 200)
      return { accessToken, refreshToken: newRefreshToken };
  }
  return 401;
};

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ err: "Missing details" });
  }

  const user = await dbHandler("readUserByEmail", { email });

  if (!user.status) return res.status(404).json({ err: "User is not Present" });

  const updatedUser = await dbHandler("updateLoginCountByEmail", { email });

  if (!updatedUser.status)
    return res.status(404).json({ err: "Login Count is not increased" });

  const result = await dbHandler("readUser", { email, password });
  if (!result?.status) {
    return res.status(401).json({ err: result.err });
  }
  // if (result.data.accountStatus === 0)
  //   return res.status(401).json({ err: "Please verify your email address" });

  const tokens = await createAccessToken(result.data.userId);

  const payload = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    userId: result.data.userId,
  };

  const token = jwt.sign(payload, process.env.ACCESS_SECRET);

  res.json({ data: result.data, token });
});

router.post("/verifyemail", async (req, res, next) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ err: "Please provide email address" });
  const user = await dbHandler("readUserByEmail", { email });
  if (!user.status) return res.status(200).json({ err: "User not found" });
  if (user.data.accountStatus === 1)
    return res.status(200).json({ err: "Email already verified" });
  // create a jwt token which has expiry of 1 hour
  const timestamp = Date.now();
  const verificationToken = jwt.sign(
    { email: email, exp: Math.floor(timestamp / 1000) + 60 * 60 },
    process.env.TOKEN_SECRET
  );
  await dbHandler("createVerificationToken", {
    verificationToken,
    email: email,
    expiry: timestamp + 60 * 60 * 1000,
    used: false,
  });
  await client
    .sendMail({
      from: {
        address: "noreply@Desktopper.com",
        name: "Desktopper",
      },
      to: [
        {
          email_address: {
            address: email,
            name: "Desktopper",
          },
        },
      ],
      subject: "Desktopper | Verify Your Email Address",
      htmlbody: `
      <p>Hello there,</p>
      <p>Welcome to Desktopper, your go-to productivity partner for efficient time management and remote team collaboration. We're thrilled to have you on board! 🚀</p>
      <p>To get started, we need to confirm your email address. It's a quick and easy step that ensures you have full access to all of Desktopper's powerful features.</p>
      <p>Please click the link below to verify your email address:</p>
      <br />
      <p><a href="${process.env.APP_BASE_URL}/verify/${verificationToken}" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email Address</a></p>
      <br />
      <p>Your Desktopper journey begins now, and we can't wait to help you supercharge your productivity and enhance your remote team's efficiency. With Desktopper, you'll be able to track your time effortlessly and gain actionable insights that will elevate your work experience.</p>
      <p>If you have any questions or need assistance, don't hesitate to reach out to our support team at <a href="mailto:support@Desktopper.com">support@Desktopper.com</a>.</p>
      <p>Thank you for choosing Desktopper to be a part of your productivity journey. Let's make every moment count!</p>
      <br />
      <p>Best regards,</p>
      </br>
      <p>Team Desktopper</p>
      `,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => console.log(err));
  res.status(200).json({ msg: "Email sent successfully" });
});

router.get("/verify/:token", async (req, res, next) => {
  const { token } = req.params;
  if (!token) return res.status(200).json({ err: "Missing token" });
  try {
    const isTokenValid = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!isTokenValid) return res.status(200).json({ err: "Invalid token" });
    const result = await dbHandler("readToken", {
      verificationToken: token,
    });
    console.log("readVerificationToken", result);
    if (result.token.used)
      return res.status(200).json({ err: "Token already used" });
    console.log(
      "result.token.expiry",
      result.token.expiry,
      result.token.expiry < Date.now()
    );
    if (result.token.expiry < Date.now())
      return res.status(200).json({ err: "Token expired" });
    const user = await dbHandler("readUserByEmail", {
      email: result.token.email,
    });
    console.log("readUserByEmail", user);
    if (!user.status) return res.status(200).json({ err: user.err });
    if (user.data.accountStatus === 1)
      return res.status(200).json({ err: "Email already verified" });
    const updateAccountStatus = await dbHandler("updateAccountStatusByEmail", {
      email: result.token.email,
      accountStatus: 1,
    });
    console.log("updateAccountStatus", updateAccountStatus);
    if (!updateAccountStatus.status)
      return res.status(200).json({ err: updateAccountStatus.err });

    await client
      .sendMail({
        from: {
          address: "noreply@Desktopper.com",
          name: "Desktopper",
        },
        to: [
          {
            email_address: {
              address: "abhishekkumar@desktopper.com",
              name: "Abhishek Kumar",
            },
          },
        ],
        subject: "Desktopper New User Sign Up",
        htmlbody: `
        <p>Hello there,</p>
        A new User with Email: ${result.token.email} has signed up for Desktopper.
        <p>Best regards,</p>
    
        <p>Team Desktopper</p>
      `,
      })
      .then((response) => {
        console.log("new user");
        console.log(response);
      })
      .catch((err) => console.log(err));

    res.json({ msg: "Email verified successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return res.status(200).json({ err: "Token expired" });
    return res.status(200).json({ err: "Invalid token" });
  }
});

router.post("/forgotpassword", async (req, res, next) => {
  const { email } = req.body;
  const { otp } = req.body;
  if (!email)
    return res.status(400).json({ err: "Please provide email address" });
  const user = await dbHandler("readUserByEmail", { email });
  if (!user.status) return res.status(200).json({ err: "User not found" });
  await client.sendMail({
    from: {
      address: "noreply@Desktopper.com",
      name: "Desktopper",
    },
    to: [
      {
        email_address: {
          address: email,
          name: "Desktopper",
        },
      },
    ],
    subject: "Reset Your Desktopper Password",
    htmlbody: `
        <p>Hello there,</p>
    
        <p>You're one step away from regaining access to your Desktopper account. Let's get you back on track!</p>
    
        <p>Here is Your OTP(Valid for 10 minutes):</p>
    
        <p>${otp}</p>
  
        <p>If you didn't request this password reset or believe this to be a mistake, please ignore this email. Your account security is our priority.</p>
    
        <p>If you need further assistance, feel free to reach out to us at <a href="mailto:support@Desktopper.com">support@Desktopper.com</a>. We're here to help!</p>
      `,
  });
  res.status(200).json({ msg: "Email sent successfully" });
});

router.post("/updatepassword", async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword)
    return res.status(400).json({ err: "Missing details" });
  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ err: "Password and confirm password does not match" });
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/.test(
      password
    )
  )
    return res.status(400).json({ err: "Invalid password" });
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email))
    return res.status(400).json({ err: "Invalid email" });
  const user = await dbHandler("readUserByEmail", { email });
  if (!user.status) return res.status(404).json({ err: "User not found" });
  const result = await dbHandler("updatePassword", { email, password });
  if (!result?.status) return res.status(400).json({ err: result?.err });
  res.json({ msg: "Password changed successfully" });
});

router.post("/register", async (req, res, next) => {
  const { email, password, confirmPassword, fullName, phoneNumber } = req.body;

  if (!email || !password || !confirmPassword || !fullName || !phoneNumber)
    return res.status(400).json({ err: "Missing details" });
  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ err: "Password and confirm password does not match" });
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/.test(
      password
    )
  )
    return res.status(400).json({ err: "Invalid password" });
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email))
    return res.status(400).json({ err: "Invalid email" });

  const user = await dbHandler("readUserByEmail", { email });

  if (user.status) return res.status(409).json({ err: "User already Present" });

  const result = await dbHandler("createUser", {
    email,
    password,
    fullName,
    phoneNumber,
    userRole: "admin",
    loginCount: 1,
    isPopupShowed: false,
    accountStatus: 0,
  });
  if (!result?.status) return res.status(400).json({ err: result?.err });
  const timestamp = Date.now();
  const verificationToken = jwt.sign(
    { userId: result.data.userId, exp: Math.floor(timestamp / 1000) + 60 * 60 },
    process.env.TOKEN_SECRET
  );
  await dbHandler("createVerificationToken", {
    verificationToken,
    userId: result.data.userId,
    expiry: timestamp + 60 * 60 * 1000,
    used: false,
  });
  const tokens = await createAccessToken(result.data.userId);
  res.cookie("accessToken", tokens.accessToken, {
    expires: new Date(timestamp + 24 * 60 * 60 * 1000),
  });
  res.cookie("refreshToken", tokens.refreshToken, {
    expires: new Date(timestamp + 60 * 60 * 24 * 7 * 1000),
  });
  res.cookie("userId", result.data.userId, {
    expires: new Date(timestamp + 60 * 60 * 24 * 7 * 1000),
  });
  const newtimestamp = Date.now();
  const newverificationToken = jwt.sign(
    { email: email, exp: Math.floor(timestamp / 1000) + 60 * 60 },
    process.env.TOKEN_SECRET
  );
  await dbHandler("createVerificationToken", {
    verificationToken: newverificationToken,
    email: email,
    expiry: newtimestamp + 60 * 60 * 1000,
    used: false,
  });

  await client
    .sendMail({
      from: {
        address: "noreply@Desktopper.com",
        name: "Desktopper",
      },
      to: [
        {
          email_address: {
            address: email,
            name: "Desktopper",
          },
        },
      ],
      subject: "Welcome to Desktopper - Let's Get Started! 🎉",
      htmlbody: `
          <p>Hello there,</p>
    
          <p>Congratulations! You've successfully signed up for Desktopper, your ultimate tool for efficient time management and remote team collaboration. We're excited to have you join our community of productivity enthusiasts!</p>
    
          <p>Here are some steps you can take to kickstart your Desktopper experience:</p>
    
        <ol>
          <li>Create Your Workspace and Invite Your Team: You can create your workspace and invite your team to join this workspace. Alternatively, if your team member has already created the workspace, ask them to share the workspace id, and join them.</li>
          <li>Create Projects and Add Team Members: Start by creating projects that you want to work on. Add team members to projects, ensuring everyone can see the allocated tasks and work on them.</li>
          <li>Download the Desktopper Desktop App: To track your time effortlessly, make sure to download our desktop app from the dashboard.</li>
          <li>Start Tracking Time: Once you've set up your workspace, projects, and team members, it's time to hit the ground running! Use the Desktopper app to track your time accurately.</li>
        </ol>
    
        <p>Desktopper is here to simplify your work life and boost your team's productivity. If you have any questions or need assistance, our support team is just an email away at <a href="mailto:support@Desktopper.com">support@Desktopper.com</a>.</p>
    
        <p>Thank you for choosing Desktopper to be a part of your journey towards better time management and collaborative success. Let's make every moment count together!</p>
    
        <p>Best regards,</p>
    
        <p>Team Desktopper</p>
      `,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => console.log(err));
  const payload = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    userId: result.data.userId,
  };

  const token = jwt.sign(payload, process.env.ACCESS_SECRET);

  res.json({ data: result.data, token, verificationToken });
});

const authenticator = async (req, res, next) => {
  if (req.path.startsWith("/verify")) return next();
  const { userId, accessToken, refreshToken } = req.cookies;
  if (!userId || !refreshToken) return res.status(401).send("Unauthorized...");
  if (accessToken) {
    const result = await verifyAccessToken(userId, accessToken, refreshToken);
    if (typeof result === "object") {
      res.cookie("accessToken", result.accessToken, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      result.refreshToken &&
        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
        });
    } else if (result !== 200) return res.sendStatus(result);
  } else {
    const result = await createAccessToken(userId, refreshToken);
    if (typeof result === "object") {
      res.cookie("accessToken", result.accessToken, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      result.refreshToken &&
        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
        });
      return res.sendStatus(200);
    } else if (result !== 200) return res.sendStatus(result);
  }
  next();
};
router.post("/delete/:userId/:workspaceId", async (req, res, next) => {
  const { userId, workspaceId } = req.params;
  const result = await dbHandler("deleteUser", { userId });
  await dbHandler("removeMembersFromWorkspace", {
    userId: userId,
    workspaceId,
  });
  if (!result?.status) return res.status(400).json({ err: result?.err });
  res.cookie("accessToken", "", { expires: new Date(Date.now()) });
  res.cookie("refreshToken", "", { expires: new Date(Date.now()) });
  res.cookie("userId", "", { httpOnly: true, expires: new Date(Date.now()) });
  res.send(result.msg);
});

router.get("/logout", async (req, res, next) => {
  const { userId, refreshToken, accessToken } = req.cookies;
  if (!userId && !refreshToken && !accessToken)
    return res.status(401).json({ err: "No session found" });
  if (userId && refreshToken)
    await dbHandler("deleteAuth", { userId, refreshToken });
  res.cookie("accessToken", "", { expires: new Date(Date.now()) });
  res.cookie("refreshToken", "", { expires: new Date(Date.now()) });
  res.cookie("userId", "", { httpOnly: true, expires: new Date(Date.now()) });
  res.send("Logged out");
});

router.post("/verifyCaptchaToken", async (req, res, next) => {
  console.log("req.body", req.body);
  const { token } = req.body;
  console.log("token", token);
  try {
    // Sending secret key and response token to Google Recaptcha API for authentication.
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
    );

    // Check response status and send back to the client-side
    if (response.data.success) {
      res.send("Human");
    } else {
      res.send("Robot");
    }
  } catch (error) {
    // Handle any errors that occur during the reCAPTCHA verification process
    console.error(error);
    res.status(500).send("Error verifying reCAPTCHA");
  }
});
// test

module.exports = { router, authenticator };
