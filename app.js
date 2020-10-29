require('dotenv').config();

const express = require('express');
const app = express();
const nunjucks  = require('nunjucks');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dateFilter = require('nunjucks-date-filter');

const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const i18nextBackend = require('i18next-node-fs-backend');

const projectRoutes = require('./src/controllers/projects/routes');

const utils = require('./lib/utils');

//Env variables
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const env = process.env.NODE_ENV || 'development';
const cookieKey = process.env.COOKIE_KEY;
const mongoUri = process.env.MONGODB_URI;
const port = process.env.PORT;

// Force HTTPS on production. Do this before using basicAuth to avoid
// asking for username/password twice (for `http`, then `https`).
const isSecure = (env === 'production');
if (isSecure) {
  app.use(utils.forceHttps);
  app.set('trust proxy', 1) // needed for secure cookies on heroku
};

// Ask for username and password on production
if (env === 'production') {
    app.use(utils.basicAuth(username, password));
};

//i18n setup
i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
      addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json'
    },
    fallbackLng: 'en',
    preload: ['en'],
    saveMissing: true,
    useCookie: false,
    ns: [
        'app',
        'projects',
        'project',
        'createProject',
        'createDocument',
        'addContact',
        'deleteDocument',
        'deleteContact',
        'editProject'
    ]
  });

app.use(i18nextMiddleware.handle(i18next));


const initiateNunjucks = () => {
    let env = nunjucks.configure([
        "src/views",
        "src/views/helpers",
        "node_modules/govuk-frontend/"
    ], {
        autoescape: true,
        express: app
    })

    env.addFilter('date', dateFilter);
};

initiateNunjucks();

// Add post middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

// Middleware to serve static assets
app.set('view engine', 'html');
app.use('/assets', express.static('public'));
app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk')));
app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets'), { maxage: 86400000 }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk')));
// app.use(express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets'), { maxage: 86400000 }));

//Database setup
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to database'));

app.use(express.json());

app.use((req, res, next) => {
    if(req.url == '/') {
        res.redirect('/projects');
        return;
    }
    next();
});

app.use('/projects', projectRoutes);

//Start Server
app.listen(port || 3000, () => {
    console.log(`Server running on port ${port || 3000}`);
});

module.exports = app;