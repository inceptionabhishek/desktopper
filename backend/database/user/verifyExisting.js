const verifyExistingEmail = async (db, email) => {
    const result = await db.collection('Users').findOne({ email })
    return result;
}
module.exports = verifyExistingEmail;