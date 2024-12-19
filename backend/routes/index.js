const express = require('express');
const { dbHandler } = require('../database/db');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const router = express.Router();

router.get('/verify/:verificationToken/:userId', async (req, res, next) => {
  const { verificationToken, userId } = req.params;
  if (!verificationToken || !userId)
    return res.status(400).json({ err: 'Missing details' })
  try {
    const isVerificationTokenValid = jwt.verify(verificationToken, process.env.TOKEN_SECRET)

    if (!isVerificationTokenValid || isVerificationTokenValid?.userId !== userId)
      return res.status(403).json({ err: 'Invalid verification link' })

  } catch (error) {
    if (error.name === 'TokenExpiredError')
      return res.status(403).json({ err: 'Verification link expired' })
  }

  const verificationResult = await dbHandler('readVerificationToken', { userId, verificationToken });
  if (verificationResult.code !== 200)
    return res.status(verificationResult.code).json({ err: verificationResult.err })

  const updateResult = await dbHandler('updateUser', { userId, updatedData: { accountStatus: 1 } });
  if (!updateResult.status)
    return res.status(500).json({ err: updateResult.err })

  res.send('Verified')
})

router.get('/sendVerificationCode', async (req, res, next) => {
  const { userId } = req.cookies;
  if (!userId)
    return res.status(400).json({ err: 'Missing details' })
  const user = await dbHandler('readUserByUserId', { userId })
  if (!user?.status)
    return res.status(401).json({ err: 'User does not exist' })
  if (user?.data?.accountStatus)
    return res.status(409).json({ err: 'User already verified' })

  const timestamp = Date.now()
  const verificationToken = jwt.sign({ userId, exp: Math.floor(timestamp / 1000) + (60 * 60) }, process.env.TOKEN_SECRET)

  const verificationResult = await dbHandler('createVerificationToken', { verificationToken, userId, expiry: timestamp + (60 * 60 * 1000), used: false })
  if (!verificationResult.status)
    return res.status(500).json({ err: verificationResult.err })

  res.json(verificationToken)
})


module.exports = router;
