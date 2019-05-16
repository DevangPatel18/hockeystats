const express = require('express');
const router = express.Router();
const axios = require('axios');

// Retrieve dataset
router.get(
  '/:isAggregate/:reportName/:yearStart/:yearEnd/:playoffs',
  async (req, res, next) => {
    try {
      console.log('Requesting data from api...');
      const {
        isAggregate,
        reportName,
        yearStart,
        yearEnd,
        playoffs,
      } = req.params;

      let reportType = reportName.includes('goalie') ? 'goalie_basic' : 'basic';
      let gameTypeId = playoffs === 'true' ? 3 : 2;

      let data = await axios
        .get(`http://www.nhl.com/stats/rest/skaters`, {
          params: {
            isAggregate,
            reportType,
            isGame: false,
            reportName,
            sort:
              '[{"property":"points","direction":"DESC"},{"property":"goals","direction":"DESC"},{"property":"assists","direction":"DESC"}]',
            cayenneExp: `gameTypeId=${gameTypeId} and seasonId>=${yearStart} and seasonId<=${yearEnd}`,
          },
        })
        .then(res => {
          return res.data.data;
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
