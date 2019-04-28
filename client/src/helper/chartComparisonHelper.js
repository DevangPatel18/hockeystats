const strToMin = timeStr => {
  let [min, sec] = timeStr.split(':')
  return parseInt(sec) + parseInt(min * 60)
}

const decisionToPoints = decision => {
  switch (decision) {
    case 'W':
      return 2
    case 'O':
      return 1
    default:
      return 0
  }
}

export const skaterLogStats = [
  { key: 'points', label: 'Points' },
  { key: 'assists', label: 'Assists' },
  { key: 'goals', label: 'Goals' },
  { key: 'pim', label: 'PIM' },
  { key: 'shots', label: 'Shots' },
  { key: 'blocked', label: 'Blocks' },
  { key: 'hits', label: 'Hits' },
  { key: 'shifts', label: 'Shifts' },
  { key: 'plusMinus', label: 'Plus/Minus' },
  { key: 'timeOnIce', label: 'Total TOI', format: strToMin },
  { key: 'evenTimeOnIce', label: 'Evenstrength TOI', format: strToMin },
  { key: 'powerPlayTimeOnIce', label: 'Powerplay TOI', format: strToMin },
  { key: 'shortHandedTimeOnIce', label: 'Shorthanded TOI', format: strToMin },
  { key: 'gameWinningGoals', label: 'Gamewinning Goals' },
  { key: 'overTimeGoals', label: 'Overtime Goals' },
  { key: 'powerPlayGoals', label: 'Powerplay Goals' },
  { key: 'powerPlayPoints', label: 'Powerplay Points' },
  { key: 'shortHandedGoals', label: 'Shorthanded Goals' },
  { key: 'shortHandedPoints', label: 'Shorthanded Points' },
  { key: 'faceOffPct', label: 'Faceoff ' },
  { key: 'shotPct', label: 'Shooting ' },
]

export const goalieLogStats = [
  { key: 'decision', label: 'Points', format: decisionToPoints },
  { key: 'timeOnIce', label: 'TOI', format: strToMin },
  { key: 'ot', label: 'OT' },
  { key: 'shutouts', label: 'Shutouts' },
  { key: 'saves', label: 'Saves' },
  { key: 'evenSaves', label: 'ES Saves' },
  { key: 'powerPlaySaves', label: 'PP Saves' },
  { key: 'shortHandedSaves', label: 'SH Saves' },
  { key: 'shotsAgainst', label: 'Shots against' },
  { key: 'evenShots', label: 'ES Shots' },
  { key: 'powerPlayShots', label: 'PP Shots' },
  { key: 'shortHandedShots', label: 'SH Shots' },
  { key: 'savePercentage', label: 'Save %' },
  { key: 'goalsAgainst', label: 'Goals against' },
  { key: 'powerPlaySavePercentage', label: 'PP Save %' },
  { key: 'shortHandedSavePercentage', label: 'SH Save %' },
  { key: 'evenStrengthSavePercentage', label: 'ES Save %' },
]
