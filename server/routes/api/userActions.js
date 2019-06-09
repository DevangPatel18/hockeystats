const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const validatePasswordReset = require('../../validation/passwordReset');

const Users = require('../../models/User');

// Delete user account
router.post('/delete/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { password, password2 } = req.body;
    const { errors, isValid } = validatePasswordReset({ password, password2 });

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const user = await Users.findById(userId);

    bcrypt.compare(password, user.password).then(async isMatch => {
      if (isMatch) {
        await Users.deleteOne({ _id: userId });

        return res
          .status(200)
          .json({ message: 'User account successfully deleted.' });
      } else {
        return res.status(400).json({ password: 'Password incorrect' });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: 'Problem deleting user account.' });
  }
});

module.exports = router;
