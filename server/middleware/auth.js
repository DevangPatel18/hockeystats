const jwt = require('jsonwebtoken');

exports.loginRequired = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded) {
        next();
      } else {
        return next({
          status: 401,
          message: 'Please log in first',
        });
      }
    });
  } catch (e) {
    return next({
      status: 401,
      message: 'Please log in first',
    });
  }
};
