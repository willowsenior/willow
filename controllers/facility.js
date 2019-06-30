const Facility = require('../models/Facility');
const SeniorMatchController = require('./seniorMatch');
const Room = require('../models/Room');
const myconstants = require('../utils/constants');

/**
 * GET /
 * Home page.
 */
exports.getFacility = (req, res, error) => {
    var id = req.params.facility_id;
    var currentFacility;
    var currentRooms;

    Facility.findById(id)
    .then((facility)=>{
        currentFacility = facility;
        return Promise.resolve(currentFacility);
    })
    .then(()=>{
        Room.find({'FacilityID':id})
        .then((rooms)=>{
           SeniorMatchController.getSeniorMatchesByFacilityId(currentFacility._id).then((matches) => {
            currentRooms = rooms;
            res.render('facility', {
              title: 'Facility',
              currentFacility,
              currentRooms,
              myconstants
            });
          })
          .catch((error) => { 
            console.log(error);
            res.send('Sorry! Something went wrong.'); })
        })
        .catch((err) =>{
          console.error('Error on fetching rooms: ', err); 
        });        
    }).catch((error) => {
      console.error('Error on fetching facility', err);
    })
};

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
    console.log("ERRRRRRR");
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
    console.log('currentTab', currentTab);
    res.render('updatefacility', {
      title: 'Facility Update',
      facility,
      currentTab,
      myconstants
    });
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


exports.postRoomSignup = (req, res, error) => {
  const errors = req.validationErrors();
  var id = req.params.facility_id;
  
  Facility.findById(id)
  .then((facility)=>{
    var room = new Room({
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
  
    room.save(function(err) {
  
      if (err) {
          console.log(err);
          return next(err);
      }
      res.redirect('/facility/'+id);
    }); 
  })
  .catch((error)=>{
    if(error){
      console.log(error);
    }
  })

  if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
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



