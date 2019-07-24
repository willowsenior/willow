const SeniorMatchModel = require('../models/SeniorMatch');
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

    var seniorMatch = new SeniorMatchModel({
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
   console.log('req user', req.user);
    //console.log('hit the senior match', req.params.senior_id);
    //return;
    var user = req.user;
    var senior_id = req.params.senior_id;

    var roomMatches = [];
    var rooms = [];

    if(!senior_id) {
        req.flash('errors Missing Id');
        return res.redirect('/signup'); //TODO 404 page
    }

    try {
      var facilities = await Facility.find({"Email": req.user.email});
      var facility_id = facilities.length ? facilities[0]._id : undefined;

      var seniorMatches = await SeniorMatchModel.find({SeniorId: senior_id});
      var currentSenior = await SeniorModel.findById(senior_id);
      if (!currentSenior) console.log('no current senior');
      if (currentSenior) patchSeniorMatchMarkAsViewed(currentSenior._id);

      _setMatchesViewed(seniorMatches, senior_id);

      if (facility_id) {
        rooms = await RoomModel.find({FacilityID: facility_id}).lean().exec();
        //console.log('got rooms', rooms);


        //Need an array of current rooms that are matched to this senior
        rooms = await rooms.map((room, idx) => {
          if (room.SeniorMatches && 
              room.SeniorMatches.length) {
            roomMatches = room.SeniorMatches.map(match => {
              if (match.SeniorId == currentSenior._id) {
                room.selected = true;
                return match;
              }
            }) 
          }
          return room;
        });
        console.log('done with rooms');
      } else {
        console.log('no facility');
      } 

      //console.log('rooms for senior match here', rooms);
      currentSenior.rooms = rooms;
      //console.log('matches and rooms', rooms);
          
      res.render('seniors/viewseniormatch', {
        title: 'View Senior',
        user,
        seniorMatches,
        currentSenior,
        rooms,
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
  seniorMatches.forEach(match => {
    SeniorMatchModel.find({SeniorId: senior_id}, function (err, match) {
      SeniorMatchModel.findByIdAndUpdate(match._id, {$set: {
        IsViewed: true
      }})
      .exec()
      .then(()=>{
        //console.log('success setting match to viewed');
      })
      .catch((error)=>{
        if(error){
          console.log(error);
        }
      });
    });
  })
}

// exports.viewSeniorMatch = (req, res) => {
//     var seniormatch_id = req.params.seniormatch_id;
//     console.log('use this id', seniormatch_id);

//     if(!seniormatch_id) {
//         req.flash('errors Missing Id');
//         return res.redirect('/'); //TODO 404 page
//     }

//     if (!req.user || !req.user.isAdmin) {
//         return res.redirect('/');
//     }

//     SeniorMatchModel.findById({id: seniormatch_id})
//     .then((seniorMatch)=>{
//       if (!seniorMatch){
//         return console.log('no match'); //TODO: 404 Page
//       } else {
//           patchSeniorMatchMarkAsViewed(seniorMatch._id);
//       }
//       console.log('got senior match this id', seniorMatch);

//       SeniorModel.findById(seniorMatch.SeniorId)
//       .then((currentSenior)=>{
//           if (!currentSenior) {
//             console.log('No senior found for Id: ' + senior_id);
//           }
//           res.render('seniors/viewseniormatch', {
//             title: 'View Senior Match',
//             seniorMatch,
//             currentSenior,
//             myconstants
//           });
//       })
//       .catch((error)=>{
//           console.log(error || "Error viewing seniorId: " +senior_id );
//       });

//     })
//     .catch((error)=>{
//         console.log(error || "Error viewing seniorMatch for seniorId: " +senior_id );
//     });
// };

exports.deleteSeniorMatch = (req, res) => {
    var id = req.params.senior_id;

    if (!req.user || !req.user.isAdmin) {
        return res.redirect('/');
    }

    if(!id ) {
        req.flash('errors',  "Missing Id");
        return res.redirect('/signup'); //TODO 404 page
    }

    SeniorMatchModel.findByIdAndDelete(id).then(
        ()=> {}//TODO Success Page.
    ).catch((error) => {
        if(error){
            console.log(error);
        }
    });
}

exports.postUpdateSeniorMatch = (req, res) => {
    var id = req.params.senior_id;

    if(!id ) {
        req.flash('errors', "Missing Id");
        return res.redirect('/'); //TODO 404 page
    }

    if (!req.user || !req.user.isAdmin) {
       return res.redirect('/');
    }

    SeniorMatchModel.findByIdAndUpdate(id,{$set: {
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

    SeniorMatchModel.find({'FacilityId':id})
    .then((seniorMatches)=>{
        console.log('did we find any senior matches', seniorMatches);
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

    SeniorMatchModel.findByIdAndUpdate(id,{$set: {
        IsViewed: true
    }}).then(()=> {})
    .catch((errors) => {
        if(errors){
            console.log(errors);
        }
    });
};
