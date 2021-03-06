const express = require('express');
const router = express.Router();
const Users = require('../../models/User');

const crypto = require('crypto');
const nodemail = require('nodemailer');

const resetEmailTemplate = require('../../helper/resetEmailTemplate');

router.post('/', async (req, res, next) => {
  try {
    let { email } = req.body;

    let UserReset = await Users.findOne({ email });

    if (!UserReset) {
      return res.status(400).json({ message: 'Email not found.' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    await UserReset.updateOne({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000,
    });

    const transporter = await nodemail.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: `Password Reset Request`,
      html: resetEmailTemplate(process.env.FRONTEND_URL, token).html,
    };

    transporter.sendMail(mailOptions, function(err, response) {
      if (err) {
        return res.status(400).json({ message: `Error in sending message.` });
      } else {
        return res.status(200).json({ message: 'Recovery email sent!' });
      }
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
