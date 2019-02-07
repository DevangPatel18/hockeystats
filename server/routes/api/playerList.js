const express = require('express');
const router = express.Router();

const Users = require('../../models/User');

// Adding player ids to playerList
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Users.findById(userId);
    return res.status(200).json({ playerList: user.playerList });
  } catch (err) {
    return res.status(400).json({ message: 'Problem retrieving player list.' });
  }
});

// Adding player ids to playerList
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { playerId } = req.body;

    await Users.findByIdAndUpdate(userId, {
      $addToSet: { playerList: playerId },
    });
    return res.status(200).json({ message: 'Player added to list!' });
  } catch (err) {
    return res.status(400).json({ message: 'Problem adding player to list.' });
  }
});

// Removing player ids from playerList
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { playerId } = req.body;

    await Users.findByIdAndUpdate(userId, {
      $pull: { playerList: playerId },
    });
    return res.status(200).json({ message: 'Player removed from list!' });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Problem removing player from list.' });
  }
});

module.exports = router;
