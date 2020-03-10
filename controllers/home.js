const Facility = require('../models/Facility');
const SeniorMatchController = require('./seniorMatch');
const Rooms = require('../models/Room');
const mongoXlsx = require('mongo-xlsx');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res, error) => {
    if(error){
        console.log(error);
    }
    console.log('do we not have a user??', req.user);
    if(!req.user){
      console.log('Simple Home');
      res.render('home', {
        title: 'Home'
      });
    } else {
      Facility.find({"Email" : req.user.emails[0].value   })
      .then((facilities)=>{
        console.log('facilities here', facilities);
        if(facilities.length){
          if (typeof facilities[0]._id !== 'string') {
            res.redirect('/facility/'+facilities[0]._id.toString());
          } else {
            res.redirect('/facility/'+facilities[0]._id);
          }
          
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

exports.getDownload = (req,res) => {
  var doc = [];
  
  Facility.find({}, function (err, facility) {
    for(var i = 0; i < facility.length; i++) {
      delete facility[i].createdAt;
      delete facility[i].updatedAt;
    }
    var model = mongoXlsx.buildDynamicModel(facility);
    var xlsxData = mongoXlsx.mongoData2XlsxData(facility, model);
    doc.push(xlsxData);
  }).lean();

  Rooms.find({}, function (err, room) {
    for(var i = 0; i < room.length; i++) {
      delete room[i].createdAt;
      delete room[i].updatedAt;
    }
    var model = mongoXlsx.buildDynamicModel(room);
    var xlsxData = mongoXlsx.mongoData2XlsxData(room, model);
    doc.push(xlsxData);
    mongoXlsx.mongoData2XlsxMultiPage(doc, ['User','Facility','Rooms'], function(err, data) {
      res.setHeader('Content-disposition', 'attachment; filename=data.xlsx');
      res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.download(data.fullPath);
    });
  }).lean();
}



  