const express = require("express");
const { dbHandler } = require("../database/db");
const router = express.Router();
const projectRouter = express.Router();
const workspaceRouter = express.Router();
const { SendMailClient } = require("zeptomail");
const url = process.env.ZEPTOMAIL_URL;
const token = process.env.ZEPTOMAIL_TOKEN;
let client = new SendMailClient({ url, token });

router.use("/project", projectRouter);

router.use("/workspace", workspaceRouter);

workspaceRouter.post("/create", async (req, res, next) => {
  const { userId } = req.cookies;

  const { screenshotStatus, workspaceName } = req.body;

  if (
    !userId ||
    screenshotStatus === undefined ||
    !workspaceName ||
    typeof screenshotStatus != "boolean"
  )
    return res.status(400).json({ err: "Missing Details" });

  const user = await dbHandler("readUserByUserId", { userId });

  console.log(user);

  if (!user?.status) return res.status(40).json({ err: "User does not exist" });

  if (user?.data?.approvalStatus === 0)
    return res
      .status(401)
      .json({ err: "Please verify your account to perform this action." });

  if (user?.data?.userRole != "admin")
    return res.status(401).json({ err: "Not authorized for this action" });

  const member = {
    userId,
    approvalStatus: true,
    userRole: "admin",
    fullName: user?.data?.fullName,
    email: user?.data?.email,
    accountStatus: true,
    dateAdded: new Date(),
  };

  const result = await dbHandler("createWorkSpace", {
    screenshotStatus,
    admin: userId,
    workspaceName,
    members: [member],
    approvalMembers: [],
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  console.log(result);

  const updatedUser = await dbHandler("updateUser", {
    userId,
    updatedData: {
      workspaceId: result?.data?.workspaceId,
      workspaceName: result?.data?.workspaceName,
      userRole: "admin",
      approvalStatus: true,
      accountStatus: result?.data?.accountStatus,
      dateAdded: new Date(),
    },
  });

  if (!updatedUser?.status)
    return res.status(500).json({ err: updatedUser.err });

  res.json({ ...result.data });
});

workspaceRouter.get("/read/:workspaceId", async (req, res, next) => {
  const { userId } = req.cookies;
  const { workspaceId } = req.params;

  if (!userId || !workspaceId)
    return res.status(400).json({ err: "Missing Details" });

  const workspace = await dbHandler("readWorkSpace", { workspaceId });

  if (!workspace?.status)
    return res.status(404).json({ err: "Workspace does not exist" });

  res.json({ ...workspace.data });
});

workspaceRouter.get("/join/:workspaceId", async (req, res, next) => {
  const { userId } = req.cookies;
  const { workspaceId } = req.params;

  const user = await dbHandler("readUserByUserId", { userId });

  if (!user.status) {
    return res.status(401).json({ err: user.err });
  }

  // if (!user.data.accountStatus) {
  //   return res
  //     .status(401)
  //     .json({ err: "Please verify your account before proceeding" });
  // }

  if (user.data.workspaceId === workspaceId) {
    return res.status(409).send("Already joined the workspace");
  }

  if (user.data.workspaceId?.length > 0) {
    return res.status(409).send("Already a member of a workspace");
  }

  console.log("user.data.workspaceId", user.data.workspaceId);

  const workspace = await dbHandler("readWorkSpace", {
    workspaceId,
  });

  console.log("workspace", workspace);
  // send email to all admins of workspace
  workspace.data.members.forEach((member) => {
    if (member.userRole === "admin") {
      console.log("member", member);
      client
        .sendMail({
          from: {
            address: "noreply@Desktopper.com",
            name: "Desktopper",
          },
          to: [
            {
              email_address: {
                address: member.email,
                name: "Desktopper",
              },
            },
          ],
          subject: "New member request",
          htmlbody: `<p>
          Hi ${member.fullName},</p>
          <p>${user.data.fullName} has requested to join your workspace. Please login to your account to approve or decline the request.</p>
          <p>Regards,</p>
          <p>Team Desktopper</p>`,
        })
        .then((response) => {
          console.log(response);
        })
        .catch(
          (err) => console.log(err) // handle error
        );
    }
  });
  if (!workspace.status || !workspace.data) {
    return res.status(401).send("Workspace does not exist");
  }
  const updatedUser = await dbHandler("updateUser", {
    userId,
    updatedData: {
      workspaceId,
      userRole: "pending",
      approvalStatus: false,
    },
  });

  console.log("updatedUser", updatedUser);

  if (!updatedUser.status) {
    return res.status(500).json({ err: updatedUser.err });
  }

  const NewWorkspace = await dbHandler("addMembersToWorkSpace", {
    userId,
    workspaceId,
    fullName: user.data.fullName,
    email: user.data.email,
  });

  console.log("NewWorkspace", NewWorkspace);

  res.send("Joined workspace");
});

workspaceRouter.post("/remove/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const updatedUser = await dbHandler("updateUser", {
    userId,
    updatedData: {
      workspaceId: "",
      userRole: "pending",
      approvalStatus: false,
    },
  });
  if (!updatedUser.status) {
    return res.status(500).json({ err: updatedUser.err });
  }
  return res.status(200).json({ updatedUser });
});

projectRouter.post("/addStatus", async (req, res, next) => {
  const { userId } = req.cookies;
  const { statusName, projectId } = req.body;

  if (!userId || !statusName || !projectId)
    return res.status(400).json({ err: "Missing Details" });
  const user = await dbHandler("readUserByUserId", { userId });
  if (!user?.status)
    return res.status(404).json({ err: "User does not exist" });

  if (user?.data?.approvalStatus === 0)
    return res
      .status(401)
      .json({ err: "Please verify your account to perform this action." });

  if (!user?.data?.workspaceId?.length)
    return res
      .status(400)
      .json({ err: "Please create or join a workspace first." });

  if (user?.data?.userRole != "admin" && user?.data?.userRole != "manager")
    return res.status(401).json({ err: "Not authorized for this action" });

  const project = await dbHandler("readProject", { projectId });

  if (!project?.status)
    return res.status(404).json({ err: "Project does not exist" });
  // check if status already exists
  const statusResult = await dbHandler("readStatus", {
    statusName,
    projectId,
  });
  if (statusResult?.status)
    return res.status(400).json({ err: "Status already exists" });

  const result = await dbHandler("addStatus", {
    statusName,
    projectId,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

projectRouter.post("/removeStatus", async (req, res, next) => {
  const { userId } = req.cookies;
  const { statusName, projectId } = req.body;

  if (!userId || !statusName || !projectId)
    return res.status(400).json({ err: "Missing Details" });

  if (!user?.status)
    return res.status(404).json({ err: "User does not exist" });

  if (user?.data?.approvalStatus === 0)
    return res
      .status(401)
      .json({ err: "Please verify your account to perform this action." });

  if (!user?.data?.workspaceId?.length)
    return res
      .status(400)
      .json({ err: "Please create or join a workspace first." });

  if (user?.data?.userRole != "admin" && user?.data?.userRole != "manager")
    return res.status(401).json({ err: "Not authorized for this action" });

  const project = await dbHandler("readProject", { projectId });

  if (!project?.status)
    return res.status(404).json({ err: "Project does not exist" });

  const result = await dbHandler("removeStatus", {
    statusName,
    projectId,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

workspaceRouter.post("/allowUsers", async (req, res, next) => {
  const { userId } = req.cookies;
  const { workspaceId, userRole, memberId } = req.body;

  if (!userId || !workspaceId || !userRole)
    return res.status(400).json({ err: "Missing Details" });

  const user = await dbHandler("readUserByUserId", { userId });

  const workspace = await dbHandler("readWorkSpace", { workspaceId });

  if (!workspace?.status)
    return res.status(404).json({ err: "Workspace does not exist" });

  if (user?.data?.userRole != "admin")
    return res.status(401).json({ err: "Not authorized for this action" });
  const findUser = await dbHandler("readUserByUserId", { userId: memberId });
  if (!findUser?.status)
    return res.status(404).json({ err: "User does not exist" });
  //send email to user
  await client
    .sendMail({
      from: {
        address: "noreply@Desktopper.com",
        name: "Desktopper",
      },
      to: [
        {
          email_address: {
            address: findUser.data.email,
            name: "Desktopper",
          },
        },
      ],
      subject: `Welcome to ${workspace.data.workspaceName} on Desktopper - Let's Get Productive! 🚀`,
      htmlbody: `
      <p>Hi ${findUser.data.fullName},
    
    
      <p>You've been accepted into the <strong> ${workspace.data.workspaceName} </strong> on Desktopper. We're thrilled to have you as part of our collaborative community.</p>
    
      <p>Here's how you can get started and make the most of your time on Desktopper:</p>
    
      <ol>
        <li>Add Your First Project: Dive right in by creating your first project. Whether it's a client's campaign, an internal initiative, or a personal endeavor, set up a project and add team members.</li>
        <li>Break It Down with Tasks: With projects in place, start breaking down the work into tasks. These tasks will be visible in your desktop app. You can log your time against these tasks to know how much time you spent on each task.</li>
        <li>Download the Desktopper Desktop App: To track your time effortlessly, make sure to download our desktop app from the dashboard.</li>
        <li>Track Your Time: Once you've set up your workspace, projects, and team members, it's time to hit the ground running! Use the Desktopper app to track your time accurately.</li>
      </ol>
    
      <p>We're here to support you every step of the way. If you have any questions, need assistance, or want to share your feedback, don't hesitate to reach out to us at <a href="mailto:support@Desktopper.com">support@Desktopper.com</a>.</p>
    
      <p>Thank you for choosing Desktopper as your productivity partner. Let's make work more efficient, enjoyable, and rewarding together!</p>
    
      <p>Best regards,</p>
    
      <p>Team Desktopper</p>
      `,
    })
    .then((response) => {
      console.log(response);
    })
    .catch(
      (err) => console.log(err) // handle error
    );
  const result = await dbHandler("allowUsers", {
    userId: memberId,
    workspaceId,
    userRole,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

workspaceRouter.post("/declineUsers", async (req, res, next) => {
  const { userId } = req.cookies;
  const { workspaceId, memberId } = req.body;

  if (!userId || !workspaceId)
    return res.status(400).json({ err: "Missing Details" });

  console.log(userId, workspaceId);

  const user = await dbHandler("readUserByUserId", { userId });

  const workspace = await dbHandler("readWorkSpace", { workspaceId });

  if (!workspace?.status)
    return res.status(404).json({ err: "Workspace does not exist" });

  if (user?.data?.userRole != "admin")
    return res.status(401).json({ err: "Not authorized for this action" });

  const result = await dbHandler("removeMembersFromWorkspace", {
    userId: memberId,
    workspaceId,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

workspaceRouter.post("/change-user-workspace", async (req, res, next) => {
  // const { userId } = req.cookies;
  const { workspaceId, memberId } = req.body;
  console.log("user changed workspace---->", memberId, workspaceId);
  if (!memberId || !workspaceId)
    return res.status(400).json({ err: "Missing Details" });

  const workspace = await dbHandler("readWorkSpace", { workspaceId });

  const result = await dbHandler("removeMembersFromWorkspace", {
    userId: memberId,
    workspaceId,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

workspaceRouter.post(
  "/changeUserRole/:userId/:workspaceId/:userRole",
  async (req, res, next) => {
    const { workspaceId, userRole } = req.params;

    const { userId } = req.cookies;

    const user = await dbHandler("readUserByUserId", { userId });

    if (user?.data?.userRole === "user" || user?.data?.userRole === "manager") {
      const role = user?.data?.userRole;
      return res.status(401).json({
        err: `${
          role === "user" ? "User" : "Manager"
        } can't change role, please contact the Admin of this workspace!`,
      });
    }

    if (!req.params.userId || !userRole)
      return res.status(400).json({ err: "Missing Details" });

    const member = await dbHandler("readUserByUserId", {
      userId: req.params.userId,
    });

    if (!member?.status)
      return res.status(404).json({ err: "User does not exist" });

    const result = await dbHandler("updateUserRole", {
      userId: req.params.userId,
      userRole,
      workspaceId,
    });

    if (!result?.status)
      return res.status(404).json({ err: "Something went wrong!" });

    res.json(result);
  }
);

projectRouter.get("/viewProfile/:memberId", async (req, res, next) => {
  const { userId } = req.cookies;
  const { memberId } = req.params;

  if (!userId || !memberId)
    return res.status(400).json({ err: "Missing Details" });

  const user = await dbHandler("readUserByUserId", { userId });

  if (!user?.status)
    return res.status(404).json({ err: "User does not exist" });

  if (user?.data?.approvalStatus === 0)
    return res
      .status(401)
      .json({ err: "Please verify your account to perform this action." });

  if (!user?.data?.workspaceId?.length)
    return res
      .status(400)
      .json({ err: "Please create or join a workspace first." });

  if (
    user?.data?.userRole != "admin" &&
    user?.data?.userRole != "manager" &&
    user.data.userId !== memberId
  )
    return res.status(401).json({ err: "Not authorized for this action" });

  const result = await dbHandler("readUserByUserId", { userId: memberId });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

projectRouter.get("/EditProfile", async (req, res, next) => {
  const { userId } = req.cookies;
  const { memberId } = req.body;

  if (!userId || !memberId)
    return res.status(400).json({ err: "Missing Details" });

  const user = await dbHandler("readUserByUserId", { userId });

  if (!user?.status)
    return res.status(404).json({ err: "User does not exist" });

  if (user?.data?.approvalStatus === 0)
    return res
      .status(401)
      .json({ err: "Please verify your account to perform this action." });

  if (!user?.data?.workspaceId?.length)
    return res
      .status(400)
      .json({ err: "Please create or join a workspace first." });

  if (user?.data?.userRole != "admin" && user?.data?.userRole != "manager")
    return res.status(401).json({ err: "Not authorized for this action" });

  const result = await dbHandler("readUserByUserId", { userId: memberId });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

projectRouter.post("/create", async (req, res, next) => {
  const { userId } = req.cookies;
  const { projectDescription, projectName, workspaceId } = req.body;

  if (!userId || !projectName || !workspaceId)
    return res.status(400).json({ err: "Missing Details" });

  const user = await dbHandler("readUserByUserId", { userId });

  if (!user?.status)
    return res.status(404).json({ err: "User does not exist" });

  if (user?.data?.approvalStatus === 0)
    return res
      .status(401)
      .json({ err: "Please verify your account to perform this action." });

  if (!user?.data?.workspaceId?.length)
    return res
      .status(400)
      .json({ err: "Please create or join a workspace first." });

  // if (user?.data?.userRole != "admin" && user?.data?.userRole != "manager")
  //   return res.status(401).json({ err: "Not authorized for this action" });

  const member = {
    email: user.data.email,
    password: user.data.password,
    fullName: user.data.fullName,
    userRole: user.data.userRole,
    userId,
    accountStatus: user.data.accountStatus,
    approvalStatus: user.data.approvalStatus,
    workspaceId: user.data.workspaceId,
    dateAdded: user.data.dateAdded,
  };

  const result = await dbHandler("createProject", {
    createdBy: userId,
    workspaceId,
    projectDescription,
    projectName,
    members: [member],
    archive: false,
    task: 0,
    status: [
      {
        statusName: "ToDo",
      },
      {
        statusName: "InProgress",
      },
      {
        statusName: "completed",
      },
    ],
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

projectRouter.post("/viewall", async (req, res, next) => {
  const { userId } = req.cookies;
  const workspaceId = req.body.workspaceId;
  console.log("workspaceId", workspaceId);
  if (!userId) return res.status(400).json({ err: "Missing Details" });

  const user = await dbHandler("readUserByUserId", { userId });
  console.log("user", user);
  if (!user?.status)
    return res.status(404).json({ err: "User does not exist" });

  if (user?.data?.approvalStatus === 0)
    return res
      .status(401)
      .json({ err: "Please verify your account to perform this action." });

  if (!user?.data?.workspaceId?.length)
    return res
      .status(400)
      .json({ err: "Please create or join a workspace first." });

  let result = null;

  if (user.data.userRole === "admin") {
    result = await dbHandler("viewProject", { workspaceId });
  } else {
    const projectIds = user.data.projects.map((data) => data.projectId);

    result = await dbHandler("populateProject", { projectIds });
  }

  console.log(result.data);

  if (!result?.status) return res.status(400).json({ err: result?.err });
  console.log("res", result);
  res.json({ ...result.data });
});

projectRouter.post("/addUsers", async (req, res, next) => {
  const { userId } = req.cookies;
  const { projectId, members } = req.body;

  if (!userId || !members.length || !Array.isArray(members) || !projectId)
    return res.status(400).json({ err: "Missing Details" });

  const project = await dbHandler("readProject", { projectId });

  if (!project?.status)
    return res.status(404).json({ err: "Project does not exist" });

  // if (
  //   !project?.data?.members.filter(
  //     (member) =>
  //       member.userId === userId &&
  //       (member.userRole != "admin" || member.userRole != "manager")
  //   ).length &&
  //   project.data.createdBy != userId
  // )
  //   return res.status(401).json({ err: "Not authorized for this action" });

  const mandatoryFields = ["userId", "userRole", "fullName"];

  const filteredMembers = members.filter((member) =>
    mandatoryFields.every((field) => member.hasOwnProperty(field))
  );

  if (filteredMembers.length !== members.length)
    return res.status(400).json({ err: "Details missing from members array" });

  const uniqueMembersList = filteredMembers.filter((member) => {
    return !project.data.members.some(
      (oldMember) => oldMember.userId === member.userId
    );
  });

  // if (!uniqueMembersList.length)
  //     return res.status(400).json({ err: "These members already exist in project" })

  const result = await dbHandler("addMembersToProject", {
    projectId,
    members: uniqueMembersList,
    projectName: project.data.projectName,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

projectRouter.post("/updateUsers", async (req, res, next) => {
  const { userId } = req.cookies;
  const { projectId, members, projectName } = req.body;
  console.log("members", members);
  console.log("projectId", projectId);
  if (!userId || !members.length || !Array.isArray(members) || !projectId)
    return res.status(400).json({ err: "Missing Details" });

  const project = await dbHandler("readProject", { projectId });

  if (!project?.status)
    return res.status(404).json({ err: "Project does not exist" });

  // if (
  //   !project?.data?.members.filter(
  //     (member) =>
  //       member.userId === userId &&
  //       (member.userRole != "admin" || member.userRole != "manager")
  //   ).length &&
  //   project.data.createdBy != userId
  // )
  //   return res.status(401).json({ err: "Not authorized for this action" });

  const mandatoryFields = [
    "userId",
    "userRole",
    "fullName",
    "email",
    "dateAdded",
    "accountStatus",
    "approvalStatus",
    "workspaceId",
  ];
  const filteredMembers = members?.map((member) => {
    const filteredValue = mandatoryFields?.reduce((obj, field) => {
      if (member?.value?.hasOwnProperty(field)) {
        obj[field] = member?.value[field];
      }
      return obj;
    }, {});

    return filteredValue;
  });

  if (!filteredMembers.length)
    return res.status(400).json({ err: "Details missing from members array" });

  // const uniqueMembersList = filteredMembers.filter((member) => {
  //   return project.data.members.some(
  //     (oldMember) => oldMember.userId === member.userId
  //   );
  // });

  // if (!uniqueMembersList.length)
  //   return res
  //     .status(400)
  //     .json({ err: "None of these members exist in project" });

  const result = await dbHandler("updateMembersInProject", {
    projectId,
    members: filteredMembers,
    projectName,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

projectRouter.post("/updateProject", async (req, res, next) => {
  const { userId } = req.cookies;
  const { projectId, ...otherInfo } = req.body;

  if (!userId || !projectId)
    return res.status(400).json({ err: "Missing Details" });

  const project = await dbHandler("readProject", { projectId });

  if (!project?.status)
    return res.status(404).json({ err: "Project does not exist" });

  if (
    project?.data?.members.filter(
      (member) =>
        member.userId === userId &&
        member.userRole != "admin" &&
        member.userRole != "manager"
    ).length &&
    project.data.createdBy != userId
  )
    return res.status(401).json({ err: "Not authorized for this action" });

  const result = await dbHandler("updateProject", {
    projectId,
    updatedData: otherInfo,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

projectRouter.post("/changeDescription", async (req, res, next) => {
  const { userId } = req.cookies;
  const { projectId, projectDescription } = req.body;

  if (!userId || !projectDescription || !projectId)
    return res.status(400).json({ err: "Missing Details" });

  const project = await dbHandler("readProject", { projectId });

  if (!project?.status)
    return res.status(404).json({ err: "Project does not exist" });

  if (
    !project?.data?.members.filter(
      (member) =>
        member.userId === userId &&
        (member.userRole != "admin" || member.userRole != "manager")
    ).length &&
    project.data.createdBy != userId
  )
    return res.status(401).json({ err: "Not authorized for this action" });

  const result = await dbHandler("updateProject", {
    projectId,
    updatedData: { projectDescription },
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

projectRouter.post("/removeUsers", async (req, res, next) => {
  const { userId } = req.cookies;
  const { projectId, members } = req.body;

  if (!userId || !members.length || !projectId)
    return res.status(400).json({ err: "Missing Details" });

  const project = await dbHandler("readProject", { projectId });

  if (!project?.status)
    return res.status(404).json({ err: "Project does not exist" });

  if (
    !project?.data?.members.filter(
      (member) =>
        member.userId === userId &&
        (member.userRole != "admin" || member.userRole != "manager")
    ).length &&
    project.data.createdBy != userId
  )
    return res.status(401).json({ err: "Not authorized for this action" });

  const mandatoryFields = ["userId"];

  const filteredMembers = members.filter((member) =>
    mandatoryFields.every((field) => member.hasOwnProperty(field))
  );

  if (filteredMembers.length !== members.length)
    return res.status(400).json({ err: "Details missing from members array" });

  const uniqueMembersList = filteredMembers.filter((member) => {
    return project.data.members.some(
      (oldMember) => oldMember.userId === member.userId
    );
  });

  if (!uniqueMembersList.length)
    return res
      .status(400)
      .json({ err: "None of these members exist in project" });

  const result = await dbHandler("removeMembersFromProject", {
    projectId,
    members: uniqueMembersList,
  });

  if (!result?.status) return res.status(400).json({ err: result?.err });

  res.json({ ...result.data });
});

projectRouter.get("/view/:projectId", async (req, res, next) => {
  const { userId } = req.cookies;
  const { projectId } = req.params;

  if (!userId || !projectId)
    return res.status(400).json({ err: "Missing Details" });

  const user = await dbHandler("readUserByUserId", { userId });

  if (!user?.status)
    return res.status(404).json({ err: "User does not exist" });

  const project = await dbHandler("readProject", { projectId });

  if (!project?.status)
    return res.status(404).json({ err: "Project does not exist" });

  if (
    !project?.data?.members.filter(
      (member) =>
        member.userId === userId &&
        (member.userRole != "admin" || member.userRole != "manager")
    ).length &&
    project.data.createdBy != userId
  )
    if (user?.data?.userRole != "admin" && user?.data?.userRole != "manager")
      return res.status(401).json({ err: "Not authorized for this action" });

  res.json({ ...project.data });
});

projectRouter.get("/delete/:projectId", async (req, res, next) => {
  const { userId } = req.cookies;
  const { projectId } = req.params;

  if (!userId || !projectId)
    return res.status(400).json({ err: "Missing Details" });

  const project = await dbHandler("readProject", { projectId });

  if (!project?.status)
    return res.status(404).json({ err: "Project does not exist" });

  if (
    project?.data?.members.filter(
      (member) =>
        member.userId === userId &&
        member.userRole != "admin" &&
        member.userRole != "manager"
    ).length &&
    project.data.createdBy != userId
  )
    return res.status(401).json({ err: "Not authorized for this action" });

  const deleteResult = await dbHandler("deleteProject", {
    projectId,
    members: project.data.members,
  });

  if (!deleteResult?.status)
    return res.status(404).json({ err: "Failed to delete" });

  res.json({ ...project.data });
});

module.exports = router;
