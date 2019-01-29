const express = require('express');
const router = express.Router();
const Users = require('../../models/User');
const bcrypt = require('bcryptjs');
const validatePasswordReset = require('../../validation/passwordReset');

router.put('/:tokenUrl', async (req, res, next) => {
  try {
    const token = req.params.tokenUrl;
    const { password, password2 } = req.body;

    const { errors, isValid } = validatePasswordReset({
      password,
      password2,
    });

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const UserReset = await Users.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!UserReset) {
      return res.status(400).json({
        message: 'This password reset URL has expired, please try again.',
      });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password2, salt, (err, hash) => {
        if (err) throw err;

        UserReset.updateOne({
          password: hash,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        });

        return res.status(200).json({ message: 'Password reset successful!' });
      });
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
