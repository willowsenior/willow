const SeniorModel = require('../models/Senior');
const RoomModel = require('../models/Room');
const FacilityModel = require('../models/Facility');
const SeniorMatch = require('../models/SeniorMatch');
const myconstants = require('../utils/constants');
var _ = require('lodash');


exports.getSeniorRecordCreate = (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        return res.redirect('/');
    }
    var currentSenior = {
        Senior_Living: false
    };

    res.render('account/seniorrecordcreate', {
        title: 'Create Senior Record',
        currentSenior,
        myconstants
    });
};

exports.postCreateSenior = async (req, res) => {   
    if (!req.user || !req.user.isAdmin) {
       return res.redirect('/');
    }
    var seniorObj = await createSeniorObject(req);
    var seniorModel = new SeniorModel(seniorObj);
    //console.log('do we have the model', seniorModel);

    seniorModel.save()
    .then(()=>{
      res.redirect('/home');
    })
    .catch(err =>{
        console.log(err || "Error thrown on post create Senior");
    });
};

exports.getSeniors = (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        return res.redirect('/');
    }

    var name      = req.query.name || '',
    id        = req.query.senior_id || undefined,
    page      = req.query.page || 0;

    var limit = 10;
    var skipCount = limit * page;

    if (id) {
        SeniorModel.findById(id)
        .then((seniors) => {
            //TODO:  Individual Senior Page
        })
        .catch((error) => {
            console.log(error || "Error finding senior by Id: " + id);
        });
    } else {
        SeniorModel.find(
            { 'ContactName': { "$regex": name, "$options": "i" } },
            null,
            { skip: skipCount, limit: limit }
         )
        .then((seniors) => {
            //console.log('all the seniors', seniors);
            res.render('seniors/viewallseniors', {
                title: 'View All Seniors',
                seniors,
                myconstants
            });
        })
        .catch((error) => {
            console.log(error || "Error fetching seniors by name: " + name);      
        });
    }
};

exports.deleteSenior = (req, res) => {
    var id = req.params.senior_id;
    if (!id ) {
        req.flash('errors',  "Missing Id");
        return res.redirect('/signup'); //TODO 404 page
    }

    if (!req.user || !req.user.isAdmin) {
       return res.redirect('/');
    }

    SeniorModel.findByIdAndDelete(id).then(
        () => { }//TODO Success Page.
    ).catch((error) => {
        if (error) {
            console.log(error);
        }
    });
}

exports.postUpdateSenior = async (req, res) => {
    var senior_id = req.params.senior_id;
    var toSearch = 'roomMatch';
    var dataArray = Array.from(Object.keys(req.body), k=>[`${k}`, req.body[k]]);
    var roomMatches = [];

    try {
      var roomIdArray = await filterIt(dataArray, toSearch);

      //Delete all room matches
      //await SeniorMatches.deleteMany({'SeniorId': id});

      //Get the rooms to add/remove
      var roomsToAddArray = _.remove(roomIdArray, function(room) {
        if (room[1]) {
          return room[1].indexOf('1') > -1; 
        }
      });
      var roomsToRemoveArray = roomIdArray;
      var roomsToAdd = roomsToAddArray.map(room => {
        return room[0].slice(10); 
      });
      var roomsToRemove = roomsToRemoveArray.map(room => {
        return room[0].slice(10); });

      //Remove Rooms
      if (roomsToRemove.length > 0) {
        await _removeRooms(roomsToRemove, senior_id);
      }
      console.log('done removing rooms');

      //Add Rooms
      if(roomsToAdd.length > 0) {
        var roomMatches = await _addRooms(roomsToAdd, senior_id);
      }
      console.log('done adding rooms');

      if (req && req.body && req.body.contactNumber) {
        num = req.body.contactNumber;
        req.body.contactNumber = num.replace(/[^0-9.]/g, "");
      }

      if (!req.user || !req.user.isAdmin) {
        return res.redirect('/');
      }

      if (!senior_id) {
        req.flash('errors', "Missing Senior Id");
        return res.redirect('/signup'); //TODO 404 page
      }



      req.body.roomMatches = roomMatches ? roomMatches : [];
      //Create Senior object and Update the senior
      var seniorObject = await createSeniorObject(req);

      console.log('senior object to update', seniorObject);

      SeniorModel.findByIdAndUpdate(senior_id, {
        $set: seniorObject
      }).then(() => { 
        res.redirect('/getseniors');
      })
      .catch((errors) => {
          console.log(errors || "Senior Update Error.  ID: " + senior_id);
      });

    } catch (e) {
      console.log('errors updating senior', e);
    }
    
    
};
async function _removeRooms(roomsToRemove, senior_id) {
  return new Promise(async (resolve, reject) => {
    await roomsToRemove.forEach(async (room_id) => {
      var rooms = await _getRoom(room_id),
          room = rooms[0],
          roomSeniors = room.SeniorMatches;

      // 1. Remove senior Id from room
      var removedSenior = _.remove(roomSeniors, (s) => {
        return s._id == senior_id;
      })
      await RoomModel.findByIdAndUpdate(room._id, {$set: {
        SeniorMatches: roomSeniors
      }});

      // 2. Delete Senior Match Object
      await SeniorMatch.deleteOne({'SeniorId': removedSenior});

      // 3. Remove room from the Senior Object
      await SeniorModel.findById(senior_id).then(async senior => {
        return senior.RoomMatches;
      }).catch((error) => {
          console.log(error || "Error get the senior")
      });
      SeniorModel.findByIdAndUpdate(
        senior_id,
        { $pull: {RoomMatches: [room_id] }},
        function (err, senior) {
          resolve();
      });

    });
  });
}

async function _addRooms(roomsToAdd, senior_id) {
  return new Promise(async (resolve, reject) => {

    // 1. Create a match for each room we're adding
    await roomsToAdd.forEach(async (room_id) => {

      var rooms = await _getRoom(room_id),
          room = rooms[0];

      console.log('found a room', room_id, room);
      var roomSeniors = room.seniorMatches || [];
      if (!room.seniorMatches || (room.seniorMatches && room.seniorMatches.indexOf(senior_id) < 0)) {
        roomSeniors.push(senior_id)
      } else {
        console.log('already there');
      } 

      // 2. Add senior Id to the room
      console.log('add seniors to room', room._id, roomSeniors);
      await RoomModel.findByIdAndUpdate(room._id, {$set: {
        SeniorMatches: roomSeniors
      }});
      

      // 3. Setup the SeniorMatch object and Update the facility to have new match
      var seniorMatch = new SeniorMatch({
          SeniorId: senior_id,
          RoomId: room_id,
          FacilityId: room.FacilityID,
          IsViewed: false
      });
      console.log('save this match', seniorMatch);
      await FacilityModel.findByIdAndUpdate(room.FacilityID, {$set: {
        NewMatch: true
      }}).catch((error) => {
          console.log(error || "Error updating the Facility")
      });

      // 4. Save the senior match
      seniorMatch.save().then((seniorMatch) => {
          console.log('saved one', seniorMatch);
      }).catch((error) => {
          if(error){
            console.log(error);
          }
      });
    });

   
    // 5. Get existing rooms matched to senior
    var matches = await SeniorModel.findById(senior_id).then(async senior => {
        return senior.RoomMatches;
    }).catch((error) => {
        console.log(error || "Error get the senior")
    });


    //console.log('already have some matches', matches);
    // 6. Set new array with rooms passed plus uniq existing
    roomMatches = _.union(matches, roomsToAdd);
    resolve(roomMatches);
  });
}

async function _getRoom(room_id) {
  console.log('use this id', room_id);
  return RoomModel.find({_id: room_id}).lean().exec();
}

function filterIt(arr, searchKey) {
  return arr.filter(function(obj) {
    return Object.keys(obj).some(function(key) {
      return obj[key].includes(searchKey);
    })
  });
}

function createSeniorObject(req) {
    return {
        SeniorName: req.body.seniorName,
        WhenAreYouLooking: req.body.whenAreYouLooking,
        ContactName: req.body.contactName,
        ContactEmail: req.body.contactEmail,
        ContactNumber: req.body.contactNumber,
        ContactRelationship: req.body.contactRelationship,
        ContactPowerOfAttorney: req.body.contactPowerOfAttorney,
        ContactHealthProxy: req.body.contactHealthProxy,
        Gender: req.body.gender,
        Age: req.body.age,
        Zipcode: req.body.zipCode,
        Hallucination: req.body.hallucinations,
        LiveWithContact: req.body.liveWithContact,
        ShortTermStay: req.body.shortTermStay,
        InsulinShots: req.body.insulinShots,
        OxygenTank: req.body.oxygenTank,
        ChangeOxygenTank: req.body.changeOxygenTank,
        AllTimeOxygen: req.body.allTimeOxygen,
        ChangeCatheter: req.body.changeCatheter,
        MedicationManagement: req.body.medicationManagement,
        LiquidDiets: req.body.liquidDiets,
        GroundDiets: req.body.groundDiets,
        MemoryCare: req.body.memoryCare,
        Wandergaurd: req.body.wanderGaurd,
        MonthlyIncome: req.body.monthlyIncome,
        MedicAid: req.body.medicAid,
        Pension: req.body.pension,
        VeteranOrVeteranSpouse: req.body.veteranOrVeteranSpouse,
        PropertyOwner: req.body.propertyOwner,
        LongTermInsurance: req.body.longTermInsurance,
        LifeInsurance: req.body.lifeInsurance,
        MemoryCareUnit: req.body.memoryCareUnit,
        SeniorMatchId: null,
        RoomMatches: req.body.roomMatches,
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
            Behaviourial_none: req.body.behaviourial_none,
            Behaviourial_yesnondisruptive: req.body.behaviourial_yesnondisruptive,
            Behaviourial_infrequent: req.body.behaviourial_infrequent,
            Behaviourial_frequent: req.body.behaviourial_frequent,
            Behaviourial_unpredictable: req.body.behaviourial_unpredictable
        }
    };
};