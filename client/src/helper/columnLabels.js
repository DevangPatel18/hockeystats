export const columns = [
  { title: 'Name', id: 'playerName' },
  { title: 'Season', id: 'seasonId' },
  { title: 'Track', id: 'track' },
  { title: 'Team', id: 'playerTeamsPlayedFor' },
  { title: 'G', id: 'goals' },
  { title: 'A', id: 'assists' },
  { title: 'P', id: 'points' },
  { title: 'Height', id: 'playerHeight' },
  { title: 'GP', id: 'gamesPlayed' },
  { title: 'Country', id: 'playerBirthCountry' },
  { title: 'DOB', id: 'playerBirthDate' },
  { title: 'Draft #', id: 'playerDraftOverallPickNo' },
  { title: 'Draft Year', id: 'playerDraftYear' },
  { title: 'Pos', id: 'playerPositionCode' },
  { title: 'Weight', id: 'playerWeight' },
  { title: '+/-', id: 'plusMinus' },
  { title: 'P/G', id: 'pointsPerGame' },
  { title: 'PPG', id: 'ppGoals' },
  { title: 'PPP', id: 'ppPoints' },
  { title: 'SHG', id: 'shGoals' },
  { title: 'SHP', id: 'shPoints' },
  { title: 'Shifts/G', id: 'shiftsPerGame' },
  { title: 'S%', id: 'shootingPctg' },
  { title: 'TOI/G', id: 'timeOnIcePerGame' },
]

export const yearFormatter = cell => {
  let yearsFormat = cell
    .toString()
    .slice()
    .split('')
  yearsFormat.splice(4, 2, '-')
  yearsFormat = yearsFormat.join('')

  return yearsFormat
}
