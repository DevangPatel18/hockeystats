const express = require('express');
const router = express.Router();
const axios = require('axios');
const {
  statsSortObj,
  addPlayerName,
} = require('../../helper/statisticsHelpers');

// Retrieve dataset
router.get(
  '/:isAggregate/:reportName/:yearStart/:yearEnd/:playoffs/:page/:rowsPerPage/:order/:orderBy/:teamFilter',
  async (req, res, next) => {
    try {
      console.log('Requesting data from api...');
      const {
        isAggregate,
        reportName,
        yearStart,
        yearEnd,
        playoffs,
        page,
        rowsPerPage,
        order,
        orderBy,
        teamFilter,
      } = req.params;

      const [playerType, reportType] = reportName.split('-');
      let gameTypeId = playoffs === 'true' ? 3 : 2;
      sort =
        orderBy === 'default'
          ? statsSortObj[playerType + reportType]
          : `[{"property": "${orderBy}", "direction":"${order.toUpperCase()}"}]`;
      const team = teamFilter === 'all' ? '': `franchiseId=${teamFilter} and`

      let data = await axios
        .get(`https://api.nhle.com/stats/rest/en/${playerType}/${reportType}`, {
          params: {
            isAggregate,
            isGame: false,
            reportName,
            sort,
            start: page * rowsPerPage,
            limit: rowsPerPage,
            factCayenneExp: 'gamesPlayed>=1',
            cayenneExp: `${team} gameTypeId=${gameTypeId} and seasonId>=${yearStart} and seasonId<=${yearEnd}`,
          },
        })
        .then(res => {
          addPlayerName(playerType, res.data.data);
          return res.data;
        });

      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  }
);

// Retrieve individual player stats
router.get('/players/:playerId', async (req, res, next) => {
  try {
    const { playerId } = req.params;

    const playerData = await axios
      .get(
        `https://statsapi.web.nhl.com/api/v1/people/${playerId}?expand=person.stats&stats=yearByYear`
      )
      .then(res => res.data.people[0]);

    return res.status(200).json(playerData);
  } catch (err) {
    return next(err);
  }
});

// Retrieve player stats from individual games
router.get(
  '/players/gameLog/playerId/:playerId/seasonId/:seasonId/dataType/:dataType',
  async (req, res, next) => {
    try {
      const { playerId, seasonId, dataType } = req.params;
      const statType = dataType === 'regular' ? 'gameLog' : 'playoffGameLog';

      const playerData = await axios
        .get(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats`, {
          params: {
            stats: statType,
            season: seasonId,
          },
        })
        .then(res => res.data.stats[0].splits);

      return res.status(200).json(playerData);
    } catch (err) {
      return next(err);
    }
  }
);

// Retrieve team schedule for given timeframe
router.get(
  '/team/:teamId/startDate/:startDate/endDate/:endDate',
  async (req, res, next) => {
    try {
      const { teamId, startDate, endDate } = req.params;

      const teamSchedule = await axios
        .get(`https://statsapi.web.nhl.com/api/v1/schedule`, {
          params: {
            teamId,
            startDate,
            endDate,
          },
        })
        .then(res => res.data);

      return res.status(200).json(teamSchedule);
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
