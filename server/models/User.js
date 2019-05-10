const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerListSchema = new Schema({
  playerId: {
    type: String,
    required: true,
  },
  seasonId: {
    type: String,
    required: true,
  },
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  playerList: [PlayerListSchema],
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

module.exports = User = mongoose.model('users', UserSchema);
