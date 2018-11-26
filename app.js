const express = require('express');
const path = require('path'); 
const chalk = require('chalk'); // To color highlight the log
const flash = require('express-flash'); // for displaying error messages
const session = require('express-session'); //session management

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('port', 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(flash());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'adfvsvsdv',//process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 } // two weeks in milliseconds
    // store: new MongoStore({
    //   url: process.env.MONGODB_URI,
    //   autoReconnect: true,
    // })
  }));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);


/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });