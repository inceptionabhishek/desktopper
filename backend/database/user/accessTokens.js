const readAuth = async (db, data) => {
    const result = await db.collection('Authentication').findOne({ userId: data.userId, refreshToken: data.refreshToken }, { projection: { _id: 0 } })
    if (!result)
        return 404
    if (Date.now() > result.expiry)
        return 403
    if (!data.accessToken)
        return 200
    const accessMatch = data.accessToken === result.accessToken
    if (!accessMatch)
        return 401
    return 200
}
const createAuth = async (db, data) => {
    const result = await db.collection('Authentication').insertOne(data)
    if (!result)
        return { status: false, err: 'An error occurred. Please try again' }
    return 200
}
const updateAuth = async (db, data) => {
    const result = await db.collection('Authentication').updateOne({ userId: data.userId, refreshToken: data.refreshToken }, { $set: { accessToken: data.accessToken } })
    if (!result)
        return { status: false, err: 'An error occurred. Please try again' }
    return 200
}
const deleteAuth = async (db, data) => {
    const result = await db.collection('Authentication').deleteOne({ userId: data.userId, refreshToken: data.refreshToken })
    if (!result)
        return { status: false, err: 'An error occurred. Please try again' }
    return 200
}
module.exports = { readAuth, createAuth, updateAuth, deleteAuth };