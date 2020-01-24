const formatPercent = val => (val ? (val * 100).toFixed(1) : '')
const formatThreeDec = val => (val ? val.toFixed(3) : '')
const formatTwoDec = val => (val ? val.toFixed(2) : '')
const formatOneDec = val => (val ? val.toFixed(1) : '')
const secToString = val => {
  var sec_num = Math.round(val)
  var minutes = Math.floor(sec_num / 60)
  var seconds = (sec_num - minutes * 60).toString().padStart(2, '0')

  minutes = minutes.toString().padStart(2, '0')

  return `${minutes}:${seconds}`
}

export default {
  // SKATERS
  // summary
  shootsCatches: { title: 'S/C' },
  positionCode: { title: 'Pos' },
  gamesPlayed: { title: 'GP' },
  goals: { title: 'G' },
  assists: { title: 'A' },
  points: { title: 'P' },
  plusMinus: { title: '+/-' },
  penaltyMinutes: { title: 'PIM' },
  pointsPerGame: { title: 'P/GP', format: formatTwoDec },
  evGoals: { title: 'EVG' },
  evPoints: { title: 'EVP' },
  ppGoals: { title: 'PPG' },
  ppPoints: { title: 'PPP' },
  shGoals: { title: 'SHG' },
  shPoints: { title: 'SHP' },
  gameWinningGoals: { title: 'GWG' },
  shots: { title: 'S' },
  shootingPct: { title: 'S%', format: formatPercent },
  timeOnIcePerGame: { title: 'TOI/GP', format: secToString },
  faceoffWinPct: { title: 'FOW%', format: formatPercent },
  // bio info
  currentTeamAbbrev: { title: 'Team' },
  birthDate: { title: 'DOB' },
  birthCity: { title: 'Birth City' },
  birthStateProvinceCode: { title: 'S/P' },
  birthCountryCode: { title: 'Ctry' },
  nationalityCode: { title: 'Ntnlty' },
  height: { title: 'Ht' },
  weight: { title: 'Wt' },
  draftYear: { title: 'Draft Yr' },
  draftRound: { title: 'Round' },
  draftOverall: { title: 'Overall' },
  firstSeasonForGameType: { title: '1st Season' },
  isInHallOfFameYn: { title: 'HOF' },
  // faceoffpercentages
  totalFaceoffs: { title: 'FO' },
  evFaceoffs: { title: 'EV FO' },
  ppFaceoffs: { title: 'PP FO' },
  shFaceoffs: { title: 'SH FO' },
  offensiveZoneFaceoffs: { title: 'OZ FO' },
  neutralZoneFaceoffs: { title: 'NZ FO' },
  defensiveZoneFaceoffs: { title: 'DZ FO' },
  evFaceoffPct: { title: 'EV FOW%', format: formatPercent },
  ppFaceoffPct: { title: 'PP FOW%', format: formatPercent },
  shFaceoffPct: { title: 'SH FOW%', format: formatPercent },
  offensiveZoneFaceoffPct: { title: 'OZ FOW%', format: formatPercent },
  neutralZoneFaceoffPct: { title: 'NZ FOW%', format: formatPercent },
  defensiveZoneFaceoffPct: { title: 'DZ FOW%', format: formatPercent },
  // faceoffwins
  totalFaceoffWins: { title: 'FOW' },
  totalFaceoffLosses: { title: 'FOL' },
  evFaceoffsWon: { title: 'EV FOW' },
  evFaceoffsLost: { title: 'EV FOL' },
  ppFaceoffsWon: { title: 'PP FOW' },
  ppFaceoffsLost: { title: 'PP FOL' },
  shFaceoffsWon: { title: 'SH FOW' },
  shFaceoffsLost: { title: 'SH FOL' },
  offensiveZoneFaceoffWins: { title: 'OZ FOW' },
  offensiveZoneFaceoffLosses: { title: 'OZ FOL' },
  neutralZoneFaceoffWins: { title: 'NZ FOW' },
  neutralZoneFaceoffLosses: { title: 'NZ FOL' },
  defensiveZoneFaceoffWins: { title: 'DZ FOW' },
  defensiveZoneFaceoffLosses: { title: 'DZ FOL' },
  // goalsForAgainst
  powerPlayTimeOnIcePerGame: { title: 'PP TOI/GP', format: secToString },
  powerPlayGoalFor: { title: 'On-Ice PP GF' },
  shortHandedGoalsAgainst: { title: 'On-Ice SH GA' },
  shortHandedTimeOnIcePerGame: { title: 'SH TOI/GP', format: secToString },
  shortHandedGoalsFor: { title: 'On-Ice SH GF' },
  powerPlayGoalsAgainst: { title: 'On-Ice PP GA' },
  evenStrengthTimeOnIcePerGame: { title: 'EV TOI/GP', format: secToString },
  evenStrengthGoalsFor: { title: 'On-Ice EV GF' },
  evenStrengthGoalsAgainst: { title: 'On-Ice EV GA' },
  evenStrengthGoalDifference: { title: 'On-Ice EV GD' },
  evenStrengthGoalsForPct: { title: 'On-Ice EV GF%', format: formatPercent },
  // realtime
  hits: { title: 'Hits' },
  hitsPer60: { title: 'Hits/60' },
  blockedShots: { title: 'BkS' },
  blockedShotsPer60: { title: 'BkS/60' },
  giveaways: { title: 'GvA' },
  giveawaysPer60: { title: 'GvA/60' },
  takeaways: { title: 'TkA' },
  takeawaysPer60: { title: 'TkA/60' },
  firstGoals: { title: '1g' },
  otGoals: { title: 'OTG' },
  emptyNetGoals: { title: 'ENG' },
  emptyNetAssists: { title: 'ENA' },
  emptyNetPoints: { title: 'ENP' },
  missedShots: { title: 'MsS' },
  missedShotWideOfNet: { title: 'MsS Wide' },
  missedShotOverNet: { title: 'MsS Over' },
  missedShotGoalpost: { title: 'MsS Post' },
  missedShotCrossbar: { title: 'MsS Cross' },
  // penalties
  penaltySecondsPerGame: { title: 'PIM/GP' },
  penaltyMinutesPerTimeOnIce: { title: 'PIM/TOI%', format: formatPercent },
  penaltiesDrawn: { title: 'Pen Drawn' },
  penalties: { title: 'Pen Taken' },
  netPenalties: { title: 'Net Pen' },
  penaltiesDrawnPer60: { title: 'Pen Drawn/60', format: formatTwoDec },
  penaltiesTakenPer60: { title: 'Pen Taken/60', format: formatTwoDec },
  netPenaltiesPer60: { title: 'Net Pen/60', format: formatTwoDec },
  minorPenalties: { title: 'Minor' },
  majorPenalties: { title: 'Major' },
  matchPenalties: { title: 'Match' },
  misconductPenalties: { title: 'Msct' },
  gameMisconductPenalties: { title: 'G Msct' },
  // penaltykill
  shAssists: { title: 'SHA' },
  shPrimaryAssists: { title: 'SHA1' },
  shSecondaryAssists: { title: 'SHA2' },
  shIndividualSatFor: { title: 'SH iSAT' },
  shShots: { title: 'SH Shots' },
  shShootingPct: { title: 'SH S%', format: formatPercent },
  shGoalsPer60: { title: 'SHG/60', format: formatTwoDec },
  shPrimaryAssistsPer60: { title: 'SHA1/60', format: formatTwoDec },
  shSecondaryAssistsPer60: { title: 'SHA2/60', format: formatTwoDec },
  shPointsPer60: { title: 'SHP/60', format: formatTwoDec },
  shIndividualSatForPer60: { title: 'SH iSAT/60', format: formatOneDec },
  shShotsPer60: { title: 'SH S/60', format: formatTwoDec },
  ppGoalsAgainstPer60: { title: 'PP GA/60', format: formatTwoDec },
  shTimeOnIce: { title: 'SH TOI', format: secToString },
  shTimeOnIcePerGame: { title: 'SH TOI/GP', format: secToString },
  shTimeOnIcePctPerGame: { title: 'SH TOI%', format: formatPercent },
  // penaltyShots
  penaltyShotAttempts: { title: 'PS Att' },
  penaltyShotsGoals: { title: 'PS G' },
  penaltyShotsFailed: { title: 'PS F' },
  penaltyShotShootingPct: { title: 'PS S%', format: formatPercent },
  // powerplay
  ppAssists: { title: 'PPA' },
  ppPrimaryAssists: { title: 'PPA1' },
  ppSecondaryAssists: { title: 'PPA2' },
  ppIndividualSatFor: { title: 'PP iSAT' },
  ppShots: { title: 'PP Shots' },
  ppShootingPct: { title: 'PP S%', format: formatPercent },
  ppGoalsPer60: { title: 'PPG/60', format: formatTwoDec },
  ppPrimaryAssistsPer60: { title: 'PPA1/60', format: formatTwoDec },
  ppSecondaryAssistsPer60: { title: 'PPA2/60', format: formatTwoDec },
  ppPointsPer60: { title: 'PPP/60', format: formatTwoDec },
  ppIndividualSatForPer60: { title: 'PP iSAT/60', format: formatOneDec },
  ppShotsPer60: { title: 'PP S/60', format: formatOneDec },
  ppGoalsForPer60: { title: 'PP GF/60', format: formatTwoDec },
  ppTimeOnIce: { title: 'PP TOI', format: secToString },
  ppTimeOnIcePerGame: { title: 'PP TOI/GP', format: secToString },
  ppTimeOnIcePctPerGame: { title: 'PP TOI%', format: formatPercent },
  // puckPossessions
  timeOnIcePerGame5v5: { title: 'TOI/GP', format: secToString },
  satPct: { title: 'SAT%', format: formatPercent },
  usatPct: { title: 'USAT %', format: formatPercent },
  goalsPct: { title: 'On-Ice GF %', format: formatPercent },
  individualSatForPer60: { title: 'iSAT/60', format: formatTwoDec },
  individualShotsForPer60: { title: '5v5 S/60', format: formatTwoDec },
  onIceShootingPct: { title: 'On-Ice S%', format: formatPercent },
  zoneStartPct: { title: 'OZ%', format: formatPercent },
  faceoffPct5v5: { title: '5v5 FOW%', format: formatPercent },
  // summaryshooting
  satFor: { title: 'SAT For' },
  satAgainst: { title: 'SAT Agst' },
  satTotal: { title: 'SAT' },
  satAhead: { title: 'SAT Ahead' },
  satTied: { title: 'SAT Tied' },
  satBehind: { title: 'SAT Behind' },
  satClose: { title: 'SAT Close' },
  satRelative: { title: 'SAT% Relative', format: formatPercent },
  usatFor: { title: 'USAT For' },
  usatAgainst: { title: 'USAT Agst' },
  usatTotal: { title: 'USAT' },
  usatAhead: { title: 'USAT Ahead' },
  usatTied: { title: 'USAT Tied' },
  usatBehind: { title: 'USAT Behind' },
  usatClose: { title: 'USAT Close' },
  usatRelative: { title: 'USAT% Relative', format: formatPercent },
  // percentages
  satPercentage: { title: 'SAT%', format: formatPercent },
  satPercentageAhead: { title: 'SAT% Ahead', format: formatPercent },
  satPercentageTied: { title: 'SAT% Tied', format: formatPercent },
  satPercentageBehind: { title: 'SAT% Behind', format: formatPercent },
  satPercentageClose: { title: 'SAT% Close', format: formatPercent },
  usatPercentage: { title: 'USAT%', format: formatPercent },
  usatPercentageAhead: { title: 'USAT% Ahead', format: formatPercent },
  usatPercentageTied: { title: 'USAT% Tied', format: formatPercent },
  usatPercentageBehind: { title: 'USAT% Behind', format: formatPercent },
  usatPrecentageClose: { title: 'USAT% Close', format: formatPercent },
  zoneStartPct5v5: { title: 'OZ%', format: formatPercent },
  shootingPct5v5: { title: 'On-Ice S%', format: formatPercent },
  skaterSavePct5v5: { title: 'On-Ice Sv%', format: formatPercent },
  skaterShootingPlusSavePct5v5: {
    title: 'On-Ice S%+Sv%',
    format: formatPercent,
  },
  // scoringRates
  goals5v5: { title: 'G' },
  assists5v5: { title: 'A' },
  primaryAssists5v5: { title: 'A1' },
  secondaryAssists5v5: { title: 'A2' },
  points5v5: { title: 'P' },
  goalsPer605v5: { title: 'G/60', format: formatTwoDec },
  assistsPer605v5: { title: 'A/60', format: formatTwoDec },
  primaryAssistsPer605v5: { title: 'A1/60', format: formatTwoDec },
  secondaryAssistsPer605v5: { title: 'A2/60', format: formatTwoDec },
  pointsPer605v5: { title: 'P/60', format: formatTwoDec },
  onIceShootingPct5v5: { title: 'On-Ice S%', format: formatPercent },
  offensiveZoneStartPct5v5: { title: 'OZ%', format: formatPercent },
  satRelative5v5: { title: 'SAT Rel%', format: formatPercent },
  netMinorPenaltiesPer60: { title: 'Net Minors/60', format: formatTwoDec },
  // scoringPerGame
  totalPrimaryAssists: { title: 'A1' },
  totalSecondaryAssists: { title: 'A2' },
  timeOnIce: { title: 'TOI', format: secToString },
  goalsPerGame: { title: 'G/GP', format: formatTwoDec },
  assistsPerGame: { title: 'A/GP', format: formatTwoDec },
  primaryAssistsPerGame: { title: 'A1/GP', format: formatTwoDec },
  secondaryAssistsPerGame: { title: 'A2/GP', format: formatTwoDec },
  shotsPerGame: { title: 'S/GP', format: formatTwoDec },
  penaltyMinutesPerGame: { title: 'PIM/GP', format: formatTwoDec },
  hitsPerGame: { title: 'Hits/GP', format: formatTwoDec },
  blocksPerGame: { title: 'BkS/GP', format: formatTwoDec },
  // shootout
  shootoutGamesPlayed: { title: 'S/O GP' },
  shootoutGoals: { title: 'S/O Goals' },
  shootoutShots: { title: 'S/O Shots' },
  shootoutShootingPct: { title: 'S/O S%', format: formatPercent },
  shootoutGameDecidingGoals: { title: 'GDG' },
  careerShootoutGamesPlayed: { title: 'Career S/O GP' },
  careerShootoutGoals: { title: 'Career S/O G' },
  careerShootoutShots: { title: 'Career S/O S' },
  careerShootoutShootingPct: { title: 'Career S/O S%', format: formatPercent },
  careerShootoutGameDecidingGoals: { title: 'Career GDG' },
  // shottype
  goalsWrist: { title: 'G Wrist' },
  goalsSnap: { title: 'G Snap' },
  goalsSlap: { title: 'G Slap' },
  goalsBackhand: { title: 'G Back' },
  goalsTipIn: { title: 'G Tip' },
  goalsDeflected: { title: 'G Def' },
  goalsWrapAround: { title: 'G Wrap' },
  shotsOnNetWrist: { title: 'S Wrist' },
  shotsOnNetSnap: { title: 'S Snap' },
  shotsOnNetSlap: { title: 'S Slap' },
  shotsOnNetBackhand: { title: 'S Back' },
  shotsOnNetTipIn: { title: 'S Tip' },
  shotsOnNetDeflected: { title: 'S Def' },
  shotsOnNetWrapAround: { title: 'S Wrap' },
  shootingPctWrist: { title: 'S% Wrist', format: formatPercent },
  shootingPctSnap: { title: 'S% Snap', format: formatPercent },
  shootingPctSlap: { title: 'S% Slap', format: formatPercent },
  shootingPctBackhand: { title: 'S% Back', format: formatPercent },
  shootingPctTipIn: { title: 'S% Tip', format: formatPercent },
  shootingPctDeflected: { title: 'S% Def', format: formatPercent },
  shootingPctWrapAround: { title: 'S% Wrap', format: formatPercent },
  // timeonice
  evTimeOnIce: { title: 'EV TOI', format: secToString },
  evTimeOnIcePerGame: { title: 'EV TOI/GP', format: secToString },
  otTimeOnIce: { title: 'OT TOI', format: secToString },
  otTimeOnIcePerOtGame: { title: 'OT TOI/OT GP', format: secToString },
  shifts: { title: 'Shifts' },
  timeOnIcePerShift: { title: 'TOI/Shift', format: secToString },
  shiftsPerGame: { title: 'Shifts/GP', format: formatOneDec },
  // GOALIES
  // summary
  gamesStarted: { title: 'GS' },
  wins: { title: 'W' },
  losses: { title: 'L' },
  ties: { title: 'T' },
  otLosses: { title: 'OT' },
  shotsAgainst: { title: 'SA' },
  saves: { title: 'Svs' },
  goalsAgainst: { title: 'GA' },
  savePct: { title: 'Sv%', format: formatThreeDec },
  goalsAgainstAverage: { title: 'GAA', format: formatTwoDec },
  shutouts: { title: 'SO' },
  // advanced
  completeGames: { title: 'CG' },
  incompleteGames: { title: 'IG' },
  completeGamePct: { title: 'CG%', format: formatPercent },
  qualityStart: { title: 'GS > .900' },
  qualityStartsPct: { title: 'GS > .900 %', format: formatPercent },
  goalsFor: { title: 'GF' },
  goalsForAverage: { title: 'GFA', format: formatTwoDec },
  regulationWins: { title: 'ROW' },
  regulationLosses: { title: 'ROL' },
  shotsAgainstPer60: { title: 'SA/60', format: formatOneDec },
  // daysrest
  gamesPlayedDaysRest0: { title: '0 Days Rest' },
  gamesPlayedDaysRest1: { title: '1 Days Rest' },
  gamesPlayedDaysRest2: { title: '2 Days Rest' },
  gamesPlayedDaysRest3: { title: '3 Days Rest' },
  gamesPlayedDaysRest4Plus: { title: '4+ Days Rest' },
  savePctDaysRest0: { title: '0 Days Sv%', format: formatThreeDec },
  savePctDaysRest1: { title: '1 Days Sv%', format: formatThreeDec },
  savePctDaysRest2: { title: '2 Days Sv%', format: formatThreeDec },
  savePctDaysRest3: { title: '3 Days Sv%', format: formatThreeDec },
  savePctDaysRest4Plus: { title: '4+ Days Sv%', format: formatThreeDec },
  // penaltyShots
  penaltyShotsAgainst: { title: 'PS SA' },
  penaltyShotsSaves: { title: 'PS Svs' },
  penaltyShotsGoalsAgainst: { title: 'PS GA' },
  penaltyShotSavePct: { title: 'PS Sv%', format: formatThreeDec },
  // savesByStrength
  evShotsAgainst: { title: 'EV SA' },
  evSaves: { title: 'EV Svs' },
  evGoalsAgainst: { title: 'EV GA' },
  evSavePct: { title: 'EV Sv%', format: formatThreeDec },
  ppShotsAgainst: { title: 'PP SA' },
  ppSaves: { title: 'PP Svs' },
  ppGoalsAgainst: { title: 'PP GA' },
  ppSavePct: { title: 'PP Sv%', format: formatThreeDec },
  shShotsAgainst: { title: 'SH SA' },
  shSaves: { title: 'SH Svs' },
  shGoalsAgainst: { title: 'SH GA' },
  shSavePct: { title: 'SH Sv%', format: formatThreeDec },
  // shootout
  shootoutWins: { title: 'S/O Win' },
  shootoutLosses: { title: 'S/O Loss' },
  shootoutShotsAgainst: { title: 'S/O SA' },
  shootoutGoalsAgainst: { title: 'S/O GA' },
  shootoutSaves: { title: 'S/O Saves' },
  shootoutSavePct: { title: 'S/O Sv%', format: formatThreeDec },
  careerShootoutWins: { title: 'Career S/O W' },
  careerShootoutLosses: { title: 'Career S/O L' },
  careerShootoutShotsAgainst: { title: 'Career S/O SA' },
  careerShootoutGoalsAllowed: { title: 'Career S/O GA' },
  careerShootoutSaves: { title: 'Career S/O Sv' },
  careerShootoutSavePct: { title: 'Career S/O Sv %', format: formatThreeDec },
  // startedVsRelieved
  gamesStartedWins: { title: 'GS W' },
  gamesStartedLosses: { title: 'GS L' },
  gamesStartedTies: { title: 'GS T' },
  gamesStartedOtLosses: { title: 'GS OT' },
  gamesStartedShotsAgainst: { title: 'GS SA' },
  gamesStartedSaves: { title: 'GS Svs' },
  gamesStartedGoalsAgainst: { title: 'GS GA' },
  gamesStartedSavePct: { title: 'GS Sv %', format: formatThreeDec },
  gamesRelieved: { title: 'GR' },
  gamesRelievedWins: { title: 'GR W' },
  gamesRelievedLosses: { title: 'GR L' },
  gamesRelievedTies: { title: 'GR T' },
  gamesRelievedOtLosses: { title: 'GR OT' },
  gamesRelievedShotsAgainst: { title: 'GR SA' },
  gamesRelievedSaves: { title: 'GR Svs' },
  gamesRelievedGoalsAgainst: { title: 'GR GA' },
  gamesRelievedSavePct: { title: 'GR Sv %', format: formatThreeDec },
}
