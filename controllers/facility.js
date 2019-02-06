const Facility = require('../models/Facility');

/**
 * GET /
 * Home page.
 */
exports.getFacility = (req, res, error) => {
    var id = req.params.facility_id;
    console.log("ID:   "+id);
    Facility.findById(id)
    .then((facility)=>{
      res.render('facility', {
        title: 'Facility',
        facility
      });      
    })
    .catch((error) =>{
      if (error) {
        console.log(error);
      }
    })
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
    console.log(req.body.user);
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
        Email: req.user.email,
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
        Facility.findById({"_id" : facility._id})
        .then((currentFacility)=>{
          res.render('facility', {
            title: 'Facility',
            currentFacility
          });
        })
        .catch((error) => { 
          console.log(error);
          res.send('Sorry! Something went wrong.'); 
        })
        //res.send('Facility Created successfully')
        //res.redirect('/facility/'+currentFacility._id);
    })
};