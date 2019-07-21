const FacilityModel = require('../models/Facility');
const SeniorMatchController = require('./seniorMatch');
const RoomModel = require('../models/Room');
const SeniorMatchModel = require('../models/SeniorMatch');
const myconstants = require('../utils/constants');
const async = require('async');

/**
 * GET /
 * Home page.
 */
exports.getFacility = async (req, res, error) => {
    var facilityId = req.params.facility_id;
    var currentFacility;
    var currentRooms;
    var currentMatches;

    FacilityModel.findById(facilityId)
    .then(async (facility)=>{
        currentFacility = facility;
        
        try {
          currentRooms = await RoomModel.find({'FacilityID': facilityId});
          currentMatches = await SeniorMatchModel.find({'FacilityId': facilityId});
          
          if(currentMatches.some(isMatchViewed)){
            currentFacility.NewMatch = true;
          } else {
            currentFacility.NewMatch = false;
          }

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

function _getRooms (id) {
  RoomModel.find({'FacilityID': id})
  .then((rooms)=>{
    return rooms;
  }).catch((error) => {
    console.error('Error on fetching facility', err);
  });
}

async function _getMatches (id) {
  try {
    var matches = await SeniorMatchController.getSeniorMatchesByFacilityId({id: id})
    return matches;
  } catch (e)  {
    console.error('Error on fetching facility', err);
    return err;
  }
  
}

exports.postFacilitySignup = (req, res, next) => {
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
  var facility = new FacilityModel({
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

exports.putFacilityUpdate = (req, res, next) =>{
  const errors = req.validationErrors();

  if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
  }

  var facilityId = req.params.facility_id;
  FacilityModel.findByIdAndUpdate(facilityId,{$set: {
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

  FacilityModel.findById(facility_id)
  .then((facility)=>{
    currentFacility = facility;
    var currentTab = 'General';
    console.log('currentTab', currentTab);
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

  FacilityModel.findById(id)
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
    var facility = await FacilityModel.findById(id);
    var room = await new RoomModel({
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

    console.log('room to save with facility id', facility._id, room);
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
  RoomModel.findByIdAndUpdate(roomId,{$set: {
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
  RoomModel.findById(roomId, (err,room) => {
    if (err) {
      req.flash('errors', err);
      return res.redirect('/signup');
    }
    RoomModel.deleteOne(room,(err)=>{
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
  RoomModel.findByIdAndUpdate(roomId,{$set: {
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

  FacilityModel.findById(facility_id)
  .then((facility)=>{
    currentFacility = facility;
    return Promise.resolve(currentFacility);
  })
  .then(()=>{
    RoomModel.findById(room_id)
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
    RoomModel.findById(id)
      .then((room) => {
          //Display Individual Room
      })
      .catch((error) => {
          console.log(error || "Error finding room by Id: " + id);
      });
  } else {
      RoomModel.find(
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

