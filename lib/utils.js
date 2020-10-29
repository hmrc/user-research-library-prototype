const basicAuth = require('basic-auth');

// Redirect HTTP requests to HTTPS
exports.forceHttps = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        console.log('Redirecting request to https')
        // 302 temporary - this is a feature that can be disabled
        return res.redirect(302, 'https://' + req.get('Host') + req.url);
    }
    next();
};

exports.basicAuth = function (username, password) {
    return function (req, res, next) {
      if (!username || !password) {
        console.log('Username or password is not set.')
        return res.send('<h1>Error:</h1><p>Username or password not set. <a href="https://govuk-prototype-kit.herokuapp.com/docs/publishing-on-heroku#6-set-a-username-and-password">See guidance for setting these</a>.</p>')
      }
  
      var user = basicAuth(req);
  
      if (!user || user.name !== username || user.pass !== password) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
      }
  
      next();
    };
  };
