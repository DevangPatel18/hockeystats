const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res, next) => {
  try {
    console.log('Requesting data from api...');

    let data = await axios
      .get(
        'http://www.nhl.com/stats/rest/skaters?isAggregate=false&reportType=basic&isGame=false&reportName=skatersummary&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22goals%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22assists%22,%22direction%22:%22DESC%22%7D%5D&cayenneExp=gameTypeId=2%20and%20seasonId%3E=20182019%20and%20seasonId%3C=20182019'
      )
      .then(res => {
        return res.data.data;
      });

    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { yearStart, yearEnd } = req.body.data;

    console.log(`Requesting data from ${yearStart} to ${yearEnd} season...`);

    let data = await axios
      .get(
        `http://www.nhl.com/stats/rest/skaters?isAggregate=false&reportType=basic&isGame=false&reportName=skatersummary&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22goals%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22assists%22,%22direction%22:%22DESC%22%7D%5D&cayenneExp=gameTypeId=2%20and%20seasonId%3E=${yearStart}%20and%20seasonId%3C=${yearEnd}`
      )
      .then(res => {
        return res.data.data;
      });

    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
