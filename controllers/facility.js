const Facility = require('../models/Facility');
const SeniorMatchController = require('./seniorMatch');
const Room = require('../models/Room');
const SeniorMatch = require('../models/SeniorMatch');
const myconstants = require('../utils/constants');
const async = require('async');

/**
 * GET /
 * Home page.
 */
exports.getFacility = async (req, res, error) => {
  console.log('getting facility??');
    var facilityId = req.params.facility_id;
    var currentFacility;
    var currentRooms = [];
    var currentMatches = [];
    var existingMatches = [];

    Facility.findById(facilityId)
    .then(async (facility)=>{
       console.log('got facility', facility);
        var features = await _mapFeatures(facility);
        //console.log('facility features', features);
        
        try {
          currentRooms = await _roomPromise(facilityId);
          existingMatches = await _matchPromise(facilityId);
          //console.log('got rooms and matches', currentRooms.length, existingMatches.length);
          if (existingMatches && existingMatches.length) currentMatches = await _mapMatchesPromise(existingMatches);
         
          res.render('facility', {
            title: 'Facility',
            currentFacility,
            currentMatches,
            currentRooms,
            myconstants
          });
          
        } catch (e) {
          console.log(e);
        }
    }).catch((err) =>{
      console.error('Error on fetching rooms: ', err); 
    }); 
};

/*function _mapFeatures (features) {
  return new Promise((resolve, reject) => {
    var newFeatures = {
      'Eating': [],
      'Mobility': [],
      'Transfers': [],
      'Toileting': [],
      'Verbal': [],
      'Physical': [],
      'Behavioral': []
    };
    var setupThings = Object.keys(features).forEach(key => {
      
      var obj = {};
      if (key.indexOf('Eating') > -1 && features[key]) {
        obj[key] = features[key];
        newFeatures['Eating'].push(obj);
      } else if (key.indexOf('Mobiliy') > -1 && features[key]) {
        obj[key] = features[key];
        newFeatures['Mobility'].push(obj);
      } else if (key.indexOf('Transfers') > -1 && features[key]) {
        obj[key] = features[key];
        newFeatures['Transfers'].push(obj);
      } else if (key.indexOf('Toileting') > -1 && features[key]) {
        obj[key] = features[key];
        newFeatures['Toileting'].push(obj);
      } else if (key.indexOf('Verbal') > -1 && features[key]) {
        obj[key] = features[key];
        newFeatures['Verbal'].push(obj);
      } else if (key.indexOf('Physical') > -1 && features[key]) {
        obj[key] = features[key];
        newFeatures['Physical'].push(obj);
      } else if (key.indexOf('Behaviourial') > -1 && features[key]) {
        obj[key] = features[key];
        newFeatures['Behavioral'].push(obj);
      }
      //console.log('obj here', obj);
    });
    //console.log('new features here', newFeatures);
    resolve(newFeatures);
  });
} */

function _roomPromise (facilityId) {
  return new Promise((resolve, reject) => {
    Room.find({'FacilityID': facilityId}).lean().exec(function (err, rooms) {
      if (err) reject(err);
      console.log('got rooms');
      resolve(rooms);
    });
  });
}

function _matchPromise (facilityId) {
  return new Promise((resolve, reject) => {
    SeniorMatch.find({'FacilityId': facilityId}).lean().exec(function (err, matches) {
      if (err) reject(err);
      console.log('got matches');
      resolve(matches);
    });
  });
  
}

function _mapMatchesPromise (existingMatches) {
  return new Promise((resolve, reject) => {
    var finalMatches = [];
    existingMatches.forEach(match => {
      //console.log('match', match._id);
      if (!match.RoomId) return;
      Room.findById(match.RoomId).lean().exec(function (err, room) {
        //if(typeof match !== 'object') match = match.toObject();
        Object.assign(match, {room: room});
        //console.log('match with room', match);
        finalMatches.push(match);
        if(finalMatches.length === existingMatches.length) {
          resolve(finalMatches);
        }
      });
    });
  });
}

function _getRooms (id) {
  Room.find({'FacilityID': id})
  .then((rooms)=>{
    return rooms;
  }).catch((error) => {
    console.error('Error on fetching facility', err);
  });
}

async function _getMatches (id) {
  try {
    var matches = await SeniorMatchController.getSeniorMatchesByFacilityId({id: id}).exec();
    return matches;
  } catch (e)  {
    console.error('Error on fetching facility', err);
    return err;
  }
  
}

exports.postFacilitySignup = (req, res, next) => {
  //console.log('req body for post======>', req.body);
  let num;
  if (req && req.body && req.body.contactNumber) {
    num = req.body.contactNumber;
    req.body.contactNumber = num.replace(/[^0-9.]/g, "");
  }

  const errors = req.validationErrors();

  console.log('create facility======>');
  if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
  }
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
      MedicAid: req.body.medicaid,
      AssistedActivites: req.body.assistedActivites,
      BehaviorProblems: req.body.behaviorProblems,
      PhysicalAggressive: req.body.physicalAggressive,
      SevereOrFrequentBehaviors: req.body.severeOrFrequentBehaviors,
      MemoryCare: req.body.memoryCare,
      AddititonalIssues: req.body.addititonalIssues,
      InsulinShots: req.body.insulinShots,
      ChangeCatheterOrColostomyBag: req.body.changeCatheterOrColostomyBag,
      OxygenTank: req.body.oxygenTank,
      ContinousOxygen: req.body.continousOxygen,
      DesiredRent: req.body.desiredRent,
  });

  facility.save(function(err) {
      if(err){
        console.log(err);
        return err;
      }
      res.redirect('/facility/'+facility._id);
  });
};

exports.putFacilityNewMatchUpdate = (req, res, next) => {
  var facilityId = req.params.facility_id;

  Facility.findByIdAndUpdate(facilityId, {$set: {
    NewMatch: false
  }})
  .exec()
  .then(()=>{
    //console.log('success setting facility new match to false');
    res.redirect('/facility/'+req.params.facility_id);
  })
  .catch((error)=>{
    if(error){
      console.log(error);
    }
  });
};

exports.putFacilityUpdate = (req, res, next) =>{
  const errors = req.validationErrors();

  if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
  }

  var facilityId = req.params.facility_id;
  Facility.findByIdAndUpdate(facilityId,{$set: {
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
      MedicAid: req.body.medicaid,
      AssistedActivites: req.body.assistedActivites,
      BehaviorProblems: req.body.behaviorProblems,
      PhysicalAggressive: req.body.physicalAggressive,
      SevereOrFrequentBehaviors: req.body.severeOrFrequentBehaviors,
      MemoryCare: req.body.memoryCare,
      AddititonalIssues: req.body.addititonalIssues,
      InsulinShots: req.body.insulinShots,
      ChangeCatheterOrColostomyBag: req.body.changeCatheterOrColostomyBag,
      OxygenTank: req.body.oxygenTank,
      ContinousOxygen: req.body.continousOxygen,
      DesiredRent: req.body.desiredRent
  }})
  .exec()
  .then(()=>{
    res.redirect('/facility/'+req.params.facility_id);
  })
  .catch((error)=>{
    if(error){
      console.log(error);
    }
  });
};

exports.getFacilityUpdate = (req, res, error) => {
  var facility_id = req.params.facility_id;

  Facility.findById(facility_id)
  .then((facility)=>{
    currentFacility = facility;
    var currentTab = 'General';
    //console.log('currentTab', currentTab);
    res.render('updatefacility', {
      title: 'Facility Update',
      facility,
      currentTab,
      myconstants
    });
  }) 
};

exports.getRoomSignup = (req, res, error) => {
  var id = req.params.facility_id;
  var currentFacility;

  Facility.findById(id)
  .then((facility)=>{
    currentFacility = facility;
    res.render('roomsignup',{
      title: 'Room Sign up',
      currentFacility,
      myconstants
    });
  })
  .catch((error)=>{
    if(error){
      console.log(error);
    }
  });
};

exports.postRoomSignup = async (req, res, error) => {
  const errors = req.validationErrors();
  var id = req.params.facility_id;
  
  try {
    var facility = await Facility.findById(id);
    var room = await new Room({
      FacilityID: id,
      FacilityName: facility.FacilityName,
      RoomName: req.body.roomName,
      RoomCount: req.body.count,
      Gender: req.body.gender,
      RoomType: req.body.roomtype,
      Range:{
        min: req.body.rent,
        max: req.body.max
      },
      Medicaid: facility.MedicAid,
      AssistedActivites: facility.AssistedActivites,
      BehaviorProblems: facility.BehaviorProblems,
      PhysicalAggressive: facility.PhysicalAggressive,
      SevereOrFrequentBehaviors: facility.SevereOrFrequentBehaviors,
      MemoryCare: facility.MemoryCare,
      AddititonalIssues: facility.AddititonalIssues,
      InsulinShots: facility.InsulinShots,
      ChangeCatheterOrColostomyBag: facility.ChangeCatheterOrColostomyBag,
      OxygenTank: facility.OxygenTank,
      ContinousOxygen: facility.ContinousOxygen,
      DesiredRent: facility.DesiredRent
    });

    //console.log('room to save with facility id', facility._id, room);
    room.save(function(err) {
  
      if (err) {
          console.log(err);
          return next(err);
      }
      res.redirect('/facility/'+id);
    }); 

  } catch (e) {
    console.error('error', e);
  }
  
};

exports.putRoomUpdate = (req, res, error) => {
  const errors = req.validationErrors();

  if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
  }
  var roomId = req.params.room_id;
  Room.findByIdAndUpdate(roomId,{$set: {
      RoomCount: req.body.count,
      RoomType: req.body.roomtype,
      Range:{
        min: req.body.rent,
        max: req.body.max
      }
  }})
  .exec()
  .then((room)=>{
    res.redirect('/facility/'+req.params.facility_id);
  })
  .catch((error)=>{
    console.log("ERRRRRRR");
    if(error){
      console.log(error);
    }
  });
};

exports.deleteRoom = (req, res, error) => {
  var roomId = req.params.room_id;
  Room.findById(roomId, (err,room) => {
    if (err) {
      req.flash('errors', err);
      return res.redirect('/signup');
    }
    Room.deleteOne(room,(err)=>{
      if (err) {
        req.flash('errors', err);
        return res.redirect('/signup');
      }
    });
  })
  .exec()
  .then(()=>{
    res.redirect('/facility/'+req.params.facility_id);
  })
  .catch((error)=>{
    console.log("ERRRRRRR");
    if(error){
      console.log(error);
    }
  });
}

exports.putFullRoomUpdate = (req, res, error) => {
  const errors = req.validationErrors();

  if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
  }
  var roomId = req.params.room_id;
  Room.findByIdAndUpdate(roomId,{$set: {
    RoomName: req.body.roomName,
    RoomCount: req.body.count,
    Gender: req.body.gender,
    RoomType: req.body.roomtype,
    Range:{
      min: req.body.rent,
      max: req.body.max
    },
    MedicAid: req.body.medicaid,
      AssistedActivites: req.body.assistedActivites,
      BehaviorProblems: req.body.behaviorProblems,
      PhysicalAggressive: req.body.physicalAggressive,
      SevereOrFrequentBehaviors: req.body.severeOrFrequentBehaviors,
      MemoryCare: req.body.memoryCare,
      AddititonalIssues: req.body.addititonalIssues,
      InsulinShots: req.body.insulinShots,
      ChangeCatheterOrColostomyBag: req.body.changeCatheterOrColostomyBag,
      OxygenTank: req.body.oxygenTank,
      ContinousOxygen: req.body.continousOxygen,
      DesiredRent: req.body.desiredRent
  }})
  .exec()
  .then((room)=>{
    res.redirect('/facility/'+req.params.facility_id);
  })
  .catch((error)=>{
    console.log("ERRRRRRR");
    if(error){
      console.log(error);
    }
  });
};

exports.getRoomUpdate = (req, res, error) => {
  var facility_id = req.params.facility_id;
  var room_id = req.params.room_id;
  var currentRoom;
  var currentFacility;

  Facility.findById(facility_id)
  .then((facility)=>{
    currentFacility = facility;
    return Promise.resolve(currentFacility);
  })
  .then(()=>{
    Room.findById(room_id)
    .then((room)=>{
      currentRoom = room;
      res.render('updateroom', {
        title: 'Room',
        currentFacility,
        currentRoom,
        myconstants
      });
    })
    .catch((err) =>{
      console.log('currentRooms: error'); 
      if (err) {
        console.log(err);
      }
    });        
  }) 
};

exports.getFacilitySignup = (req, res, error) => {
    if (!req.user) {
      return res.redirect('/login');
    }
    res.render('facilitysignup', {
        title: 'Facility',
        myconstants
    });
};

exports.getRooms = (req, res) => {
  if (!req.user || !req.user.isAdmin) {
      return res.redirect('/');
  }

  var name      = req.query.name || '',
  id        = req.query.room_id || undefined,
  page      = req.query.page || 0;

  var limit = 10;
  var skipCount = limit * page;

  if (id) {
    Room.findById(id)
      .then((room) => {
          //Display Individual Room
      })
      .catch((error) => {
          console.log(error || "Error finding room by Id: " + id);
      });
  } else {
      Room.find(
          { 'RoomName': { "$regex": name, "$options": "i" } },
          null,
          { skip: skipCount, limit: limit }
       )
      .then((rooms) => {
          //Display list of rooms
      })
      .catch((error) => {
          console.log(error || "Error fetching rooms");      
      });
  }
};

function isMatchViewed (seniorMatch) {
  return !seniorMatch.IsViewed;
}

