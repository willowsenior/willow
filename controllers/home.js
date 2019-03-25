const Facility = require('../models/Facility');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res, error) => {
    if(error){
        console.log(error);
    }

    if(!req.user){
      console.log('Simple Home');
      res.render('home', {
        title: 'Home'
      });
    } else {
      console.log('Home with facilities');
      Facility.find({"Email" : req.user.email})
      .then((facilities)=>{
        if(facilities.length === 1){
          res.redirect('/facility/'+facilities[0]._id);
        }else{
          res.render('home', {
            title: 'Home',
            facilities
          });
        }
      })
      .catch((error) => { 
        console.log(error);
        res.send('Sorry! Something went wrong.'); })
    }
  };

exports.getContact = (req, res) => {
    res.render('contact', {
        title: 'Contact'
    });
};

  