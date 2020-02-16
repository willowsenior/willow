const SeniorMatch = require('../models/SeniorMatch');
const SeniorModel = require('../models/Senior');
const Facility = require('../models/Facility');
const FacilityController = require('./facility');
const myconstants = require('../utils/constants');
const RoomModel = require('../models/Room');

exports.postCreateSeniorMatch = (req, res) => {
    var seniorId = req.body.senior_id;

    if(!seniorId) {
        req.flash('errors Missing Id');
        return res.redirect('/'); //TODO 404 page
    }

    if (!req.user || !req.user.isAdmin) {
        return res.redirect('/');
    }

    var seniorMatch = new SeniorMatch({
        SeniorId: seniorId,
        RoomId: req.body.room_id,
        FacilityId: req.body.facility_id,
        IsViewed: false
    });
  
    seniorMatch.save().then((seniorMatch) => {
        SeniorModel.findByIdAndUpdate(seniorId, {$set: {
            SeniorMatchId: seniorMatch._id
        }}).catch((error) => {
            console.log(error || "Error updating the SeniorMatchId")
        });
    }).catch((error) => {
        if(error){
            console.log(error);
        }
    })
};

exports.viewSeniorMatch = async (req, res) => {
    var user = req.user;
    var senior_id = req.params.senior_id;

    var roomMatches = [];
    var allRooms = [];
    var rooms = [];

    if(!senior_id) {
        req.flash('errors Missing Id');
        return res.redirect('/signup'); //TODO 404 page
    }

    try {
      var facilities = await Facility.find({"Email": req.user.email});
      var facility_id = facilities.length ? facilities[0]._id : undefined;

      var seniorMatches = await SeniorMatch.find({SeniorId: senior_id});
      var currentSenior = await SeniorModel.findById(senior_id);
      //if (!currentSenior) console.log('no current senior');
      //if (currentSenior) patchSeniorMatchMarkAsViewed(currentSenior._id);

      _setMatchesViewed(seniorMatches, senior_id);

      // If not admin (Will), then get facility rooms and attach to currentSenior
      if (facility_id && !user.isAdmin) {
        rooms = await RoomModel.find({FacilityID: facility_id}).lean().exec();
        //console.log('got rooms', rooms);
      } else if (user.isAdmin) {
        rooms = await RoomModel.find().lean().exec();
      }

      // Need an array of current rooms that are matched to this senior
      rooms = await rooms.map((room, idx) => {
        if (typeof room !== 'object') room.toObject();
        if (room.SeniorMatches && 
            room.SeniorMatches.length) {
          console.log('set a room to selected', room.SeniorMatches, currentSenior._id);
          roomMatches = room.SeniorMatches.map(match => {
            if (match == currentSenior._id.toString()) {
              room.selected = true;
              return match;
            }
          }) 
        }
        return room;
      });




      if (user.isAdmin) {

        //Editable for Will
        currentSenior.rooms = rooms;

      } else {

        //Read only for the facility user
        facilityRooms = rooms;
      }

      res.render('seniors/viewseniormatch', {
        title: 'View Senior',
        user,
        seniorMatches,
        currentSenior,
        allRooms,
        myconstants,
        roomMatches
      });

    } catch (e) {
      if(e){
        console.log(e);
      }
    }

 
};

function _setMatchesViewed (seniorMatches, senior_id) {
  //Have all the matches
  //console.log('senior matches to maybe set viewed', seniorMatches);
  seniorMatches.forEach(senior_match => {
    SeniorMatch.findByIdAndUpdate(senior_match._id, {$set: {
      IsViewed: true
    }})
    .exec()
    .then(()=>{
      //console.log('success setting match to viewed', senior_match);
    })
    .catch((error)=>{
      if(error){
        console.log(error);
      }
    });
  });
}


exports.deleteSeniorMatch = (req, res) => {
    var id = req.params.senior_id;

    if (!req.user || !req.user.isAdmin) {
        return res.redirect('/');
    }

    if(!id ) {
        req.flash('errors',  "Missing Id");
        return res.redirect('/signup'); //TODO 404 page
    }

    SeniorMatch.findByIdAndDelete(id).then(
        ()=> {}//TODO Success Page.
    ).catch((error) => {
        if(error){
            console.log(error);
        }
    });
};

exports.postUpdateSeniorMatch = (req, res) => {
    var id = req.params.senior_id;

    if(!id ) {
        req.flash('errors', "Missing Id");
        return res.redirect('/'); //TODO 404 page
    }

    if (!req.user || !req.user.isAdmin) {
       return res.redirect('/');
    }

    SeniorMatch.findByIdAndUpdate(id,{$set: {
        IsViewed: false,
        RoomId: req.body.room_id,
        FacilityId: req.body.facility_id
    }}).then(()=> {})
    .catch((error) => {
        console.log(error || "Error updating SeniorMatchId: " + id);
    });
};

exports.getSeniorMatchesByFacilityId = (params) => {
    var id = params.id;

    SeniorMatch.find({'FacilityId':id})
    .then((seniorMatches)=>{
        //console.log('did we find any senior matches', seniorMatches);
        return Promise.resolve(seniorMatches);
    }).catch((errors) => {
        console.log('errors in this req', errors);
        if(errors){
           console.log(errors);
           return Promise.resolve([]);
        }
    });
};

function patchSeniorMatchMarkAsViewed(id) {
    var id = id;

    SeniorMatch.findByIdAndUpdate(id,{$set: {
        IsViewed: true
    }}).then(()=> {
      //console.log('success patching isViewed for senior match', id);
    })
    .catch((errors) => {
        if(errors){
            console.log(errors);
        }
    });
};
