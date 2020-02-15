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

exports.getOptionalFilters = function(queryParams) {
  const {
    teamFilter,
    countryFilter,
    playerType,
    playerPositionCode,
    opponentFilter,
    gameResult,
    location,
  } = queryParams;
  const team = teamFilter === 'all' ? '' : `franchiseId=${teamFilter}`;
  const country =
    countryFilter === 'all' ? '' : `nationalityCode="${countryFilter}"`;
  const position =
    playerType === 'goalie' || playerPositionCode === 'LRCD'
      ? ''
      : `(${playerPositionCode
          .split('')
          .map(char => `positionCode="${char}"`)
          .join(' or ')})`;
  const opponent =
    opponentFilter === 'all' ? '' : `opponentFranchiseId=${opponentFilter}`;
  const decision = gameResult === 'all' ? '' : `decision="${gameResult}"`;
  const homeRoad = location === 'all' ? '' : `homeRoad="${location}"`;
  let optionalFilters = [team, country, position, opponent, decision, homeRoad]
    .filter(x => x)
    .join(' and ');
  return optionalFilters ? optionalFilters + ' and' : '';
};
