const strToMin = timeStr => {
  let [min, sec] = timeStr.split(':')
  return parseInt(sec) + parseInt(min * 60)
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
