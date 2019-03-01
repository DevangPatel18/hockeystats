const express = require('express');
const router = express.Router();
const axios = require('axios');

// Retrieve dataset
router.get(
  '/:isAggregate/:reportName/:yearStart/:yearEnd',
  async (req, res, next) => {
    try {
      console.log('Requesting data from api...');
      const { isAggregate, reportName, yearStart, yearEnd } = req.params;

      let reportType = reportName.includes('goalie') ? 'goalie_basic' : 'basic';

      let data = await axios
        .get(
          `http://www.nhl.com/stats/rest/skaters?isAggregate=${isAggregate}&reportType=${reportType}&isGame=false&reportName=${reportName}&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22goals%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22assists%22,%22direction%22:%22DESC%22%7D%5D&cayenneExp=gameTypeId=2%20and%20seasonId%3E=${yearStart}%20and%20seasonId%3C=${yearEnd}`
        )
        .then(res => {
          return res.data.data;
        });

      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  }
);

// Retrieve columns for dataset
router.get('/:reportName', async (req, res, next) => {
  try {
    const { reportName } = req.params;

    let columns = await axios
      .get(
        `https://assets.nhle.com/projects/ice3-stats/utility/locales/en_US/reports/players/${reportName}.json`
      )
      .then(res => {
        return res.data.data;
      });

    return res.status(200).json(columns);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
