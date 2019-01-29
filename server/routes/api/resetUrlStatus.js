const express = require('express');
const router = express.Router();
const Users = require('../../models/User');

router.get('/:tokenUrl', async (req, res, next) => {
  try {
    let token = req.params.tokenUrl;

    let UserReset = await Users.findOne({ resetPasswordToken: token });

    if (!UserReset) {
      return res.status(400).json({
        message: 'Invalid password reset URL, please try again.',
      });
    }

    if (UserReset.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        message: 'This password reset URL has expired, please try again.',
      });
    }

    return res.status(200).json({ message: 'Password reset URL is valid' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
