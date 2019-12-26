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

exports.getOptionalFilters = function(args) {
  const { teamFilter, countryFilter, playerType, playerPositionCode } = args;
  const team = teamFilter === 'all' ? '' : `franchiseId=${teamFilter}`;
  const country =
    countryFilter === 'all' ? '' : `nationalityCode="${countryFilter}"`;
  const position =
    playerType === 'goalie' || playerPositionCode === 'all'
      ? ''
      : `(${playerPositionCode
          .split('')
          .map(char => `positionCode="${char}"`)
          .join(' or ')})`;
  let optionalFilters = [team, country, position].filter(x => x).join(' and ');
  return optionalFilters ? optionalFilters + ' and' : '';
};
