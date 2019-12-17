exports.statsSortObj = {
  skatersummary:
    '[{"property":"points","direction":"DESC"},{"property":"goals","direction":"DESC"},{"property":"assists","direction":"DESC"}]',
  goaliesummary: '[{"property":"wins","direction":"DESC"}]',
};

exports.addPlayerName = function(playerType, playerList) {
  const playerNameKey = playerType + 'FullName';
  for (let player of playerList) {
    player.playerName = player[playerNameKey];
  }
};
