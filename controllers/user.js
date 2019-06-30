const passport = require('passport');
const User = require('../models/User');
const myconstants = require('../utils/constants');


/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/home');
    }
    res.render('account/login', {
        title: 'Login'
    });
};

//
//POST /login
//Sign in using email and password.
//
exports.postLogin = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        req.flash('errors', errors);
        return res.redirect('/login');
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }

        if(user.isAdmin){
            return res.redirect('/login');
        }

        if (!user) {
            console.log(info);
            req.flash('errors', info);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', { msg: 'Success! You are logged in.' });
            //res.redirect(req.session.returnTo || '/');
            res.redirect('/home');
        });
    })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
    if(!req.user){
        res.redirect('/');
    }
    req.logout();
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err);
      req.user = null;
      res.redirect('/');
    });
};

///
//GET /signup
// Signup page.
//
exports.getSignup = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/signup', {
        title: 'Create Account'
    });
};


//** * POST /signup
//* Create a new local account.
//
exports.postSignup = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup');
    }

    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            req.flash('errors', { msg: 'Account with that email address already exists.' });
            return res.redirect('/signup');
        }
        user.save((err) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
};

///
//GET /customersignup
// Customer Signup page.
//
exports.getCustomerSignup = (req, res) => {
    if (req.user) {
        return res.redirect('/home');
    }
    const email = 'will@willowsenior.care';
    res.render('account/customersignup', {
        title: 'Create Account',
        email
    });
};

exports.getAdminCustomerSignup = (req, res) => {
    res.render('account/admincustomersignup', {
        title: 'Create Customer Account'
    });
};

exports.postAdminCustomerSignup = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if(!req.user || !req.user.isAdmin){
        req.flash('errors', errors);
        return res.redirect('willowadminsignin');
    }
    
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('admincustomersignup');
    }

    var customer = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        
        if (existingUser) {
            req.flash('errors', { msg: 'Account with that email address already exists.' });
            return res.redirect('admincustomersignup');
        }
        customer.save((err) => {
            console.log('saving ');
            if (err) { return next(err); }

            console.log("Customer created: "+ req.body.email);
            res.redirect('/home');
        });
    });
};


exports.getWillowAdminSignup = (req, res) => {
    if (req.user) {
        return res.redirect('/home');
    }
    res.render('account/willowadminsingup', {
        title: 'Create Admin Account'
    });
};

exports.postWillowAdminSignup = (req, res, next) => {
    const passcode = 'panache';
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('willowadminsingup');
    }
    if(req.body.passcode != passcode){
        return res.redirect('willowadminsingup');
    }
    var admin = new User({
        email: req.body.email,
        password: req.body.password,
        isAdmin: true
    });
    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            req.flash('errors', { msg: 'Account with that email address already exists.' });
            return res.redirect('willowadminsignup');
        }
        admin.save((err) => {
            if (err) { return next(err); }
            req.logIn(admin, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/home');
            });
        });
    });
};

//
//POST /login
//Sign in using email and password.
//
exports.postWillowAdminSignin = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        req.flash('errors', errors);
        return res.redirect('/account/willowadminsignin');
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        
        if(!user.isAdmin){
           return res.redirect('/login');
        }

        if (!user) {
            console.log(info);
            req.flash('errors', info);
            return res.redirect('/account/willowadminsignin');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', { msg: 'Success! You are logged in.' });
            res.redirect('/home');
        });
    })(req, res, next);
};

exports.getWillowAdminSignin = (req, res) => {
    if (req.user && req.user.isAdmin) {
        return res.redirect('/home');
    }
    res.render('account/willowadminsignin', {
        title: 'Admin Sign in',
        errors : req.flash('error')
    });
};

