const bcrypt = require("bcrypt");
const verifyExistingEmail = require("./verifyExisting");
function generateUserId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  return id;
}
const createUser = async (db, data) => {
  const alreadyExist = await verifyExistingEmail(db, data.email);
  if (alreadyExist) return { status: false, err: "Email already exist" };
  data.password = await bcrypt.hash(data.password, 10);
  data.userId = generateUserId();

  //By Default email is not verified
  data.accountStatus = 0;
  
    // Add timestamps
  const now = new Date();
  data.createdAt = now;
  data.updatedAt = now;

  data.projects = [];
  const result = await db.collection("Users").insertOne(data);
  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  delete result.password;
  delete result._id;
  return { status: true, data };
};
module.exports = createUser;
