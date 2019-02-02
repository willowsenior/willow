const Facility = require('../models/Facility');

/**
 * GET /
 * Home page.
 */
exports.getFacility = (req, res, error) => {
    if (error) {
        console.log(error);
    }
    res.render('facility', {
        title: 'Facility'
    });
};

exports.getRoom = (req, res, error) => {
    if (error) {
        console.log(error);
    }
    res.render('room', {
        title: 'Room'
    });
};


exports.getFacilitySignup = (req, res, error) => {
    if (error) {
        console.log(error);
    }
    if (!req.user) {
        return res.redirect('/login');
    }
    res.render('facilitysignup', {
        title: 'Facility'
    });
};

exports.postFacilitySignup = (req, res, next) => {
    console.log("Here>>>>>>.");
    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup');
    }


    console.log(req.body.facilityName);
    console.log(req.body.street);

    var facility = new Facility({
        FacilityName: req.body.facilityName,
        Address: {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        },
        Contact: req.body.contactNumber,
        ContactName: req.body.contactName,
        //Email: { type: String, unique: true },
        // FacilityPhoto:
        Rating: req.body.rating,

        ComplianceStatus: req.body.complianceStatus




    });

    // var userdata = {
    //     email: req.body.email,
    //     password: req.body.password
    // }

    /// TO BE REMOVED LATER
    console.log('Data being send to DB');
    console.log(facility);

    ///

    facility.save(function(err) {
        if (err) {
            return next(err);
        }
        res.send('Facility Created successfully')
    })
};