const express = require('express');
const router = express.Router();

const Users = require('../../models/User');

// Getting user playerList
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Users.findById(userId);
    const playerList = user.playerList.map(obj => {
      const { playerId, seasonId } = obj;
      return { playerId, seasonId };
    });

    return res.status(200).json({ playerList });
  } catch (err) {
    return res.status(400).json({ message: 'Problem retrieving player list.' });
  }
});

// Adding player ids to playerList
router.put('/:userId/:playerId/:seasonId', async (req, res) => {
  try {
    const { userId, playerId, seasonId } = req.params;

    await Users.findByIdAndUpdate(userId, {
      $addToSet: {
        playerList: {
          playerId: parseInt(playerId),
          seasonId: parseInt(seasonId),
        },
      },
    });
    return res.status(200).json({ message: 'Player added to list!' });
  } catch (err) {
    return res.status(400).json({ message: 'Problem adding player to list.' });
  }
});

// Removing player ids from playerList
router.delete('/:userId/:playerId/:seasonId', async (req, res) => {
  try {
    const { userId, playerId, seasonId } = req.params;

    await Users.findByIdAndUpdate(userId, {
      $pull: {
        playerList: {
          playerId: parseInt(playerId),
          seasonId: parseInt(seasonId),
        },
      },
    });
    return res.status(200).json({ message: 'Player removed from list!' });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Problem removing player from list.' });
  }
});

module.exports = router;
