// session for user for time tracking

const createSession = async (db, data) => {
  const result = await db.collection('Sessions').insertOne(data)
  if (!result)
    return { status: false, err: 'An error occurred. Please try again' }
  return { status: true, data }
}

module.exports = { createSession }
