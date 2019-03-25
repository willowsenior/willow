const express = require('express');
const path = require('path');
const chalk = require('chalk'); // To color highlight the log
const flash = require('express-flash'); // for displaying error messages
const session = require('express-session'); //session management
const sass = require('node-sass-middleware');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const logger = require('morgan');
const dotenv = require('dotenv');


const MONGODB = process.env.MONGODB_URI || 'mongodb://avneesh:willow_1234@ds223685.mlab.com:23685/willowtest1';

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const facilityController = require('./controllers/facility');

// Passport Config
const passportConfig = require('./config/passport');


/**
 * Create Express server.
 */
const app = express();

const PORT = process.env.PORT || 8080;


/** Connect to database */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlparser', true);
mongoose.connect(MONGODB, (err) => {
    console.log('Database is connected')
});
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('Connection Error Please check database connection', );
    process.exit();
})

/**
 * Express configuration.
 */
app.set('port', PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'adfvsvsdv', //process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 } // two weeks in milliseconds
    // store: new MongoStore({
    //   url: process.env.MONGODB_URI,
    //   autoReconnect: true,
    // })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/////
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== '/login' &&
        req.path !== '/signup' &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.originalUrl;
    } else if (req.user &&
        (req.path === '/account' || req.path.match(/^\/api/))) {
        req.session.returnTo = req.originalUrl;
    }
    next();
});
/////
app.use(sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public')
}));
app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/home', homeController.index);
app.get('/', userController.getLogin);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/customersignup', userController.getCustomerSignup);
app.get('/contact', homeController.getContact);
// app.get('/forgot', userController.getForgot);
// app.post('/forgot', userController.postForgot);
// app.get('/reset/:token', userController.getReset);
// app.post('/reset/:token', userController.postReset);



//Admin
app.get('/willowadminsignup', userController.getWillowAdminSignup);
app.post('/willowadminsignup', userController.postWillowAdminSignup);
app.get('/willowadminsignin', userController.getWillowAdminSignin);
app.post('/willowadminsignin', userController.postWillowAdminSignin);
app.get('/admincustomersignup', userController.getAdminCustomerSignup);
app.post('/admincustomersignup', userController.postAdminCustomerSignup);

//app.get('/facility', facilityController.getFacility);
app.get('/facility/:facility_id', facilityController.getFacility);
app.get('/facilitysignup', facilityController.getFacilitySignup);
app.post('/facilitysignup', facilityController.postFacilitySignup);
app.get('/room', facilityController.getRoom);
app.get('/roomsignup/:facility_id', facilityController.getRoomSignup);
app.post('/roomsignup/:facility_id', facilityController.postRoomSignup);
app.put('/updateroom/:facility_id/:room_id', facilityController.putRoomUpdate);
app.get('/updateroom/:facility_id/:room_id', facilityController.getRoomUpdate);


////AUthentication routes
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});