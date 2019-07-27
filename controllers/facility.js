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
        currentFacility = facility;
        
        try {
          currentRooms = await _roomPromise(facilityId);
          existingMatches = await _matchPromise(facilityId);
          console.log('got rooms and matches', currentRooms.length, existingMatches.length);
          var currentMatches;
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
        match = match.toObject();
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
  console.log('req body for post======>', req.body);
  let num;
  if (req && req.body && req.body.contactNumber) {
    num = req.body.contactNumber;
    req.body.contactNumber = num.replace(/[^0-9.]/g, "");
  }

  const errors = req.validationErrors();

  console.log('req body for post======>', req.body);
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
      Hallucination: req.body.hallucinations,
      MemoryCare: req.body.memorycare,
      InsulinShots: req.body.insulinshots,
      OxygenTank: req.body.oxygentank,
      ChangeOxygenTank: req.body.changeoxygentank,
      AllTimeOxygen: req.body.alltimeoxygen,
      ChangeCatheter: req.body.changecatheter,
      MedicationManagement: req.body.medicationmanagement,
      LiquidDiets: req.body.liquiddiets,
      GroundDiets: req.body.grounddiets,
      // FacilityPhoto:
      FacilityFeatures: {
        Eating_noassistance: req.body.eating_noassistance,
        Eating_intermittent: req.body.eating_intermittent,
        Eating_continual: req.body.eating_continual,
        Eating_byhand: req.body.eating_byhand,
        Eating_tube: req.body.eating_tube,
        Transfers_none: req.body.transfers_none,
        Transfers_intermittent: req.body.transfers_intermittent,
        Transfers_oneperson: req.body.transfers_oneperson,
        Transfers_twoperson: req.body.transfers_twoperson,
        Transfers_cannot: req.body.transfers_cannot,
        Mobiliy_noassisstance: req.body.mobiliy_noassisstance,
        Mobiliy_intermittent: req.body.mobiliy_intermittent,
        Mobiliy_continual: req.body.mobiliy_continual,
        Mobiliy_wheels: req.body.mobiliy_wheels,
        Mobiliy_cannotmove: req.body.mobiliy_cannotmove,
        Toileting_noassisstance: req.body.toileting_noassisstance,
        Toileting_bowel: req.body.toileting_bowel,
        Toileting_continual: req.body.toileting_continual,
        Toileting_nobathroomincontinent: req.body.toileting_nobathroomincontinent,
        Toileting_bathroomincontinent: req.body.toileting_bathroomincontinent,
        Verbal_none: req.body.verbal_none,
        Verbal_infrequent: req.body.verbal_infrequent,
        Verbal_predictable: req.body.verbal_predictable,
        Verbal_onceunpredictable: req.body.verbal_onceunpredictable,
        Verbal_multipleunpredictable: req.body.verbal_multipleunpredictable,
        Physical_none: req.body.physical_none,
        Physical_infrequent: req.body.physical_infrequent,
        Physical_predictable: req.body.physical_predictable,
        Physical_onceunpredictable: req.body.physical_onceunpredictable,
        Physical_multipleunpredictable: req.body.physical_multipleunpredictable,
        Behaviourial_none : req.body.behaviourial_none,
        Behaviourial_yesnondisruptive : req.body.behaviourial_yesnondisruptive,
        Behaviourial_infrequent : req.body.behaviourial_infrequent,
        Behaviourial_frequent : req.body.behaviourial_frequent,
        Behaviourial_unpredictable : req.body.behaviourial_unpredictable
      }
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
    Hallucination: req.body.hallucinations,
    MemoryCare: req.body.memorycare,
    InsulinShots: req.body.insulinshots,
    OxygenTank: req.body.oxygentank,
    ChangeOxygenTank: req.body.changeoxygentank,
    AllTimeOxygen: req.body.alltimeoxygen,
    ChangeCatheter: req.body.changecatheter,
    MedicationManagement: req.body.medicationmanagement,
    LiquidDiets: req.body.liquiddiets,
    GroundDiets: req.body.grounddiets,
    // FacilityPhoto:
    FacilityFeatures: {
      Eating_noassistance: req.body.eating_noassistance,
      Eating_intermittent: req.body.eating_intermittent,
      Eating_continual: req.body.eating_continual,
      Eating_byhand: req.body.eating_byhand,
      Eating_tube: req.body.eating_tube,
      Transfers_none: req.body.transfers_none,
      Transfers_intermittent: req.body.transfers_intermittent,
      Transfers_oneperson: req.body.transfers_oneperson,
      Transfers_twoperson: req.body.transfers_twoperson,
      Transfers_cannot: req.body.transfers_cannot,
      Mobiliy_noassisstance: req.body.mobiliy_noassisstance,
      Mobiliy_intermittent: req.body.mobiliy_intermittent,
      Mobiliy_continual: req.body.mobiliy_continual,
      Mobiliy_wheels: req.body.mobiliy_wheels,
      Mobiliy_cannotmove: req.body.mobiliy_cannotmove,
      Toileting_noassisstance: req.body.toileting_noassisstance,
      Toileting_bowel: req.body.toileting_bowel,
      Toileting_continual: req.body.toileting_continual,
      Toileting_nobathroomincontinent: req.body.toileting_nobathroomincontinent,
      Toileting_bathroomincontinent: req.body.toileting_bathroomincontinent,
      Verbal_none: req.body.verbal_none,
      Verbal_infrequent: req.body.verbal_infrequent,
      Verbal_predictable: req.body.verbal_predictable,
      Verbal_onceunpredictable: req.body.verbal_onceunpredictable,
      Verbal_multipleunpredictable: req.body.verbal_multipleunpredictable,
      Physical_none: req.body.physical_none,
      Physical_infrequent: req.body.physical_infrequent,
      Physical_predictable: req.body.physical_predictable,
      Physical_onceunpredictable: req.body.physical_onceunpredictable,
      Physical_multipleunpredictable: req.body.physical_multipleunpredictable,
      Behaviourial_none : req.body.behaviourial_none,
      Behaviourial_yesnondisruptive : req.body.behaviourial_yesnondisruptive,
      Behaviourial_infrequent : req.body.behaviourial_infrequent,
      Behaviourial_frequent : req.body.behaviourial_frequent,
      Behaviourial_unpredictable : req.body.behaviourial_unpredictable
    }
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
      MedicAid: req.body.medicaid,
      Wandergaurd: req.body.wandergaurd,
      Hallucination: req.body.hallucinations,
      MemoryCare: req.body.memorycare,
      InsulinShots: req.body.insulinshots,
      OxygenTank: req.body.oxygentank,
      ChangeOxygenTank: req.body.changeoxygentank,
      AllTimeOxygen: req.body.alltimeoxygen,
      ChangeCatheter: req.body.changecatheter,
      MedicationManagement: req.body.medicationmanagement,
      LiquidDiets: req.body.liquiddiets,
      GroundDiets: req.body.grounddiets,
      // FacilityPhoto:
      FacilityFeatures: {
        Eating_noassistance: req.body.eating_noassistance,
        Eating_intermittent: req.body.eating_intermittent,
        Eating_continual: req.body.eating_continual,
        Eating_byhand: req.body.eating_byhand,
        Eating_tube: req.body.eating_tube,
        Transfers_none: req.body.transfers_none,
        Transfers_intermittent: req.body.transfers_intermittent,
        Transfers_oneperson: req.body.transfers_oneperson,
        Transfers_twoperson: req.body.transfers_twoperson,
        Transfers_cannot: req.body.transfers_cannot,
        Mobiliy_noassisstance: req.body.mobiliy_noassisstance,
        Mobiliy_intermittent: req.body.mobiliy_intermittent,
        Mobiliy_continual: req.body.mobiliy_continual,
        Mobiliy_wheels: req.body.mobiliy_wheels,
        Mobiliy_cannotmove: req.body.mobiliy_cannotmove,
        Toileting_noassisstance: req.body.toileting_noassisstance,
        Toileting_bowel: req.body.toileting_bowel,
        Toileting_continual: req.body.toileting_continual,
        Toileting_nobathroomincontinent: req.body.toileting_nobathroomincontinent,
        Toileting_bathroomincontinent: req.body.toileting_bathroomincontinent,
        Verbal_none: req.body.verbal_none,
        Verbal_infrequent: req.body.verbal_infrequent,
        Verbal_predictable: req.body.verbal_predictable,
        Verbal_onceunpredictable: req.body.verbal_onceunpredictable,
        Verbal_multipleunpredictable: req.body.verbal_multipleunpredictable,
        Physical_none: req.body.physical_none,
        Physical_infrequent: req.body.physical_infrequent,
        Physical_predictable: req.body.physical_predictable,
        Physical_onceunpredictable: req.body.physical_onceunpredictable,
        Physical_multipleunpredictable: req.body.physical_multipleunpredictable,
        Behaviourial_none : req.body.behaviourial_none,
        Behaviourial_yesnondisruptive : req.body.behaviourial_yesnondisruptive,
        Behaviourial_infrequent : req.body.behaviourial_infrequent,
        Behaviourial_frequent : req.body.behaviourial_frequent,
        Behaviourial_unpredictable : req.body.behaviourial_unpredictable
      }
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
    Wandergaurd: req.body.wandergaurd,
    Hallucination: req.body.hallucinations,
    MemoryCare: req.body.memorycare,
    InsulinShots: req.body.insulinshots,
    OxygenTank: req.body.oxygentank,
    ChangeOxygenTank: req.body.changeoxygentank,
    AllTimeOxygen: req.body.alltimeoxygen,
    ChangeCatheter: req.body.changecatheter,
    MedicationManagement: req.body.medicationmanagement,
    LiquidDiets: req.body.liquiddiets,
    GroundDiets: req.body.grounddiets,
    // FacilityPhoto:
    FacilityFeatures: {
      Eating_noassistance: req.body.eating_noassistance,
      Eating_intermittent: req.body.eating_intermittent,
      Eating_continual: req.body.eating_continual,
      Eating_byhand: req.body.eating_byhand,
      Eating_tube: req.body.eating_tube,
      Transfers_none: req.body.transfers_none,
      Transfers_intermittent: req.body.transfers_intermittent,
      Transfers_oneperson: req.body.transfers_oneperson,
      Transfers_twoperson: req.body.transfers_twoperson,
      Transfers_cannot: req.body.transfers_cannot,
      Mobiliy_noassisstance: req.body.mobiliy_noassisstance,
      Mobiliy_intermittent: req.body.mobiliy_intermittent,
      Mobiliy_continual: req.body.mobiliy_continual,
      Mobiliy_wheels: req.body.mobiliy_wheels,
      Mobiliy_cannotmove: req.body.mobiliy_cannotmove,
      Toileting_noassisstance: req.body.toileting_noassisstance,
      Toileting_bowel: req.body.toileting_bowel,
      Toileting_continual: req.body.toileting_continual,
      Toileting_nobathroomincontinent: req.body.toileting_nobathroomincontinent,
      Toileting_bathroomincontinent: req.body.toileting_bathroomincontinent,
      Verbal_none: req.body.verbal_none,
      Verbal_infrequent: req.body.verbal_infrequent,
      Verbal_predictable: req.body.verbal_predictable,
      Verbal_onceunpredictable: req.body.verbal_onceunpredictable,
      Verbal_multipleunpredictable: req.body.verbal_multipleunpredictable,
      Physical_none: req.body.physical_none,
      Physical_infrequent: req.body.physical_infrequent,
      Physical_predictable: req.body.physical_predictable,
      Physical_onceunpredictable: req.body.physical_onceunpredictable,
      Physical_multipleunpredictable: req.body.physical_multipleunpredictable,
      Behaviourial_none : req.body.behaviourial_none,
      Behaviourial_yesnondisruptive : req.body.behaviourial_yesnondisruptive,
      Behaviourial_infrequent : req.body.behaviourial_infrequent,
      Behaviourial_frequent : req.body.behaviourial_frequent,
      Behaviourial_unpredictable : req.body.behaviourial_unpredictable
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

