const express = require('express');
const path = require('path');
const chalk = require('chalk'); // To color highlight the log
const flash = require('express-flash'); // for displaying error messages
const session = require('express-session'); //session management
const sass = require('node-sass-middleware');
const mongoose = require('mongoose');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const dotenv = require('dotenv');

const MONGODB = 'mongodb://avneesh:willow_1234@ds223685.mlab.com:23685/willowtest1';

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
//const userController = require('./controllers/user');
const facilityController = require('./controllers/facility');
const seniorController = require('./controllers/senior');
const seniorMatchController = require('./controllers/seniorMatch');
const authRouter = require('./routes/auth');


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
    if(!err){
        console.log('Database is connected');
    }
});

mongoose.connection.on('error', (err) => {
    console.log('Connection Error Please check database connection', );
    process.exit();
});

/**
 * Express configuration.
 */
app.set('port', PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(methodOverride('_method'));
app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

  
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'adfvsvsdv', //process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 } // two weeks in milliseconds
}));


// Passport Config
dotenv.config();
var strategy = new Auth0Strategy(
    {
      domain: 'willowsenior.auth0.com',
      clientID: 'YY509UmZNKj1aKW3JjqPA47A5bOFtELZ',
      clientSecret: '6n23aGD37yB0z04pkTqRUZG_BBqMQf0wPowV0I1q97ysiVocyGK01O1aFwvMGPow',
      callbackURL:
        process.env.AUTH0_CALLBACK_URL || 'http://localhost:8080/callback'
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile);
    }
  );

passport.use(strategy);

// You can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
    done(null, user);
});
  
passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());
app.use('/', authRouter);


//Flask
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.user;
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
app.get('/', homeController.index);
//app.get('/login', userController.getLogin);
//app.post('/login', userController.postLogin);
//app.get('/logout', userController.logout);
//app.get('/customersignup', userController.getCustomerSignup);
app.get('/contact', homeController.getContact);

// app.get('/forgot', userController.getForgot);
// app.post('/forgot', userController.postForgot);
// app.get('/reset/:token', userController.getReset);
// app.post('/reset/:token', userController.postReset);

//Admin
//app.get('/willowadminsignup', userController.getWillowAdminSignup);
//app.post('/willowadminsignup', userController.postWillowAdminSignup);
//app.get('/willowadminsignin', userController.getWillowAdminSignin);
//app.post('/willowadminsignin', userController.postWillowAdminSignin);
//app.get('/admincustomersignup', userController.getAdminCustomerSignup);
//app.post('/admincustomersignup', userController.postAdminCustomerSignup);

//Facility
app.get('/facility/:facility_id', facilityController.getFacility);
app.get('/facilitysignup', facilityController.getFacilitySignup);
app.post('/facilitysignup', facilityController.postFacilitySignup);
app.get('/updatefacility/:facility_id', facilityController.getFacilityUpdate);
app.put('/updatefacility/:facility_id', facilityController.putFacilityUpdate);

app.put('/updateFacilityNewMatch/:facility_id', facilityController.putFacilityNewMatchUpdate);

//Room
app.get('/getRooms', facilityController.getRooms);
app.get('/roomsignup/:facility_id', facilityController.getRoomSignup);
app.post('/roomsignup/:facility_id', facilityController.postRoomSignup);
app.put('/updateroom/:facility_id/:room_id', facilityController.putRoomUpdate);
app.get('/updateroom/:facility_id/:room_id', facilityController.getRoomUpdate);
app.put('/updatefullroom/:facility_id/:room_id', facilityController.putFullRoomUpdate);
app.delete('/deleteRoom/:facility_id/:room_id', facilityController.deleteRoom);

app.get('/download', homeController.getDownload);


//Senior: Navigate to create senior and create senior
app.get('/createseniorrecord', seniorController.getSeniorRecordCreate);
app.post('/seniorsignup', seniorController.postCreateSenior);

//Senior: Navigate to view all seniors, GET seniors
//app.get('/viewseniors', seniorController.getAllSeniors);
app.get('/getseniors', seniorController.getSeniors);

// Senior/Match: Navigate to view one senior match, update senior, delete senior
app.put('/updateSenior/:senior_id', seniorController.postUpdateSenior);
app.delete('/deletesenior/:senior_id', seniorController.deleteSenior);


// Senior Matches: Create match, Remove Match, Patch Match
app.get('/viewsenior/:senior_id', seniorMatchController.viewSeniorMatch);
app.post('/seniormatchcreate', seniorMatchController.postCreateSeniorMatch);
app.delete('/deletesenior/:senior_id', seniorMatchController.deleteSeniorMatch);
app.post('/updateseniormatch/:senior_id', seniorMatchController.postUpdateSeniorMatch);




////AUthentication routes


/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});