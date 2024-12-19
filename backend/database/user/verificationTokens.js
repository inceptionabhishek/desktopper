const readVerificationToken = async (db, data) => {
  const result = await db.collection("VerificationTokens").findOne(
    {
      userId: data.userId,
      verificationToken: data.verificationToken,
      used: false,
    },
    { projection: { _id: 0 } }
  );
  if (!result) return { code: 404, err: "Invalid verification link" };
  if (Date.now() > result.expiry) {
    return { code: 403, err: "Verification link expired" };
  }
  await updateVerificationToken(db, {
    userId: data.userId,
    verificationToken: data.verificationToken,
  });
  return { code: 200 };
};
const createVerificationToken = async (db, data) => {
  const result = await db.collection("VerificationTokens").insertOne(data);
  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true };
};
const updateVerificationToken = async (db, data) => {
  const result = await db.collection("VerificationTokens").deleteOne({
    userId: data.userId,
    verificationToken: data.verificationToken,
  });
  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true };
};
const readToken = async (db, data) => {
  const token = await db.collection("VerificationTokens").findOne(
    {
      verificationToken: data.verificationToken,
      used: false,
    },
    { projection: { _id: 0 } }
  );
  if (!token) return { code: 404, err: "Invalid verification link" };
  if (Date.now() > token.expiry) {
    return { code: 403, err: "Verification link expired" };
  }
  return { code: 200, token };
};

module.exports = {
  readVerificationToken,
  createVerificationToken,
  updateVerificationToken,
  readToken,
};
