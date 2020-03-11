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
    var facilityId = req.params.facility_id;
    var currentFacility = {}; // apparently this is useless maybe?
    var currentRooms = [];
    var currentMatches = [];
    var existingMatches = [];

    Facility.findById(facilityId)
    .then(async (facility)=>{
        let features = await _mapFeatures(facility);
        currentFacility = facility;

        try {
          currentRooms = await _roomPromise(facilityId);
          existingMatches = await _matchPromise(facilityId);
          if (existingMatches && existingMatches.length) currentMatches = await _mapMatchesPromise(existingMatches);
         
          res.render('facility', {
            title: 'Facility',
            currentFacility,
            currentMatches,
            currentRooms,
            myconstants,
            features,
            facilityId
          });
          
        } catch (e) {
          console.log(e);
        }
    }).catch((err) =>{
      console.error('Error on fetching rooms: ', err); 
    }); 
};

//TODO: This?
function _mapFeatures (features) {
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
    Object.keys(features).forEach(key => {
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
    });
    resolve(newFeatures);
  });
}

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

//TODO: update
exports.postFacilitySignup = (req, res, next) => {
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
  let assistedActivities = getAssistedActivities(req);

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
      AssistedActivites: assistedActivities,
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

  let assistedActivities = getAssistedActivities(req);

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
      Email: req.body.emailAddress,
      MedicAid: req.body.medicaid,
      AssistedActivites: assistedActivities,
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
    facility._id = facility_id;

    let currentActivities = [
      'eating',
      'dressing',
      'bathing',
      'transfers',
      'moving',
      'toileting'
    ];

    if (Array.isArray(facility.AssistedActivites)) {
      currentActivities.forEach(activity => {
        facility[activity] = facility.AssistedActivites.indexOf(activity) > -1;
      });
    }

    let currentTab = 'General';
    res.render('updatefacility', {
      title: 'Facility Update',
      facility,
      currentTab,
      myconstants
    });
  }) 
};

exports.getRoomSignup = (req, res, error) => {
  let facilityId = req.params.facility_id;
  let currentFacility;

  Facility.findById(facilityId)
  .then((facility)=>{
    currentFacility = facility;
    currentFacility.AssistedActivites.forEach(activity => {
      currentFacility[activity] = true;
    });
      res.render('roomsignup',{
      title: 'Room Sign up',
      currentFacility,
      facilityId,
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
  let id = req.params.facility_id;

  let assistedActivities = getAssistedActivities(req);

  try {
    const facility = await Facility.findById(id);
    let room = await new Room({
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
      Medicaid: req.body.medicAid,
      AssistedActivites: assistedActivities,
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
    });

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
};

exports.putFullRoomUpdate = (req, res, error) => {
  const errors = req.validationErrors();

  if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
  }
  var roomId = req.params.room_id;

  let assistedActivities = getAssistedActivities(req);

  Room.findByIdAndUpdate(roomId,{$set: {
    RoomName: req.body.roomName,
    RoomCount: req.body.count,
    Gender: req.body.gender,
    RoomType: req.body.roomtype,
    Range:{
      min: req.body.rent,
      max: req.body.max
    },
    Medicaid: req.body.medicaid,
    AssistedActivites: assistedActivities,
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

      let currentActivities = [
        'eating',
        'dressing',
        'bathing',
        'transfers',
        'moving',
        'toileting'
      ];

      currentActivities.forEach(activity => {
        if (Array.isArray(currentRoom.AssistedActivites)) {
          currentRoom[activity] = currentRoom.AssistedActivites.indexOf(activity) > -1;
        }
      });

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


const getAssistedActivities = req => {
  let currentActivities = [
    'eating',
    'dressing',
    'bathing',
    'transfers',
    'moving',
    'toileting'
  ];

  let assistedActivities = [];

  currentActivities.forEach(activity => {
    if (req.body[activity] === 'true') {
      assistedActivities.push(activity);
    }
  });

  return assistedActivities;
};

function isMatchViewed (seniorMatch) {
  return !seniorMatch.IsViewed;
}

