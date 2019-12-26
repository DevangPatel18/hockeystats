const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const { loginRequired } = require('./middleware/auth');

dotenv.config();

const users = require('./routes/api/users');
const sendResetEmail = require('./routes/api/sendResetEmail');
const resetUrlStatus = require('./routes/api/resetUrlStatus');
const passwordReset = require('./routes/api/passwordReset');
const statistics = require('./routes/api/statistics');
const playerList = require('./routes/api/playerList');
const userActions = require('./routes/api/userActions');
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
};

app.use(cors(corsOptions));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

const db = require('./config/keys').MONGODB_URI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB successully'))
  .catch(err => console.log(err));

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/users', users);

app.use('/api/sendResetEmail', sendResetEmail);

app.use('/api/resetUrlStatus', resetUrlStatus);

app.use('/api/passwordReset', passwordReset);

app.use('/api/statistics', statistics);

app.use('/api/playerList', loginRequired, playerList);

app.use('/api/userActions', loginRequired, userActions);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port}`));
