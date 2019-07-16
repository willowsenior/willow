const SeniorMatchModel = require('../models/SeniorMatch');
const SeniorModel = require('../models/Senior');
const myconstants = require('../utils/constants');

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

exports.viewSeniorMatch = (req, res) => {
    console.log('hit the senior match', req.params.senior_id);
    //return;
    var senior_id = req.params.senior_id;

    if(!senior_id) {
        req.flash('errors Missing Id');
        return res.redirect('/signup'); //TODO 404 page
    }

    SeniorMatchModel.find({SeniorID: senior_id})
    .then((seniorMatch)=>{
      if (!seniorMatch) console.log('no match');
      //Then get the senior (seniorMatch.SeniorID)
      SeniorModel.findById(senior_id)
      .then((currentSenior)=>{
          console.log('current senior');
          if (!currentSenior) console.log('no current senior');
          //Mark as viewed
          if (currentSenior) patchSeniorMatchMarkAsViewed(currentSenior._id);

          res.render('seniors/viewseniormatch', {
            title: 'View Senior Match',
            seniorMatch,
            currentSenior,
            myconstants
          });

      })
      .catch((error)=>{
          if(error){
              console.log(error);
          }
      });

    })
    .catch((error)=>{
      if(error){
          console.log(error);
      }
    });
};

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
    var id = req.params.seniormatch_id;

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
    var id = req.params.seniormatch_id;

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

    SeniorMatchModel.find({'FacilityID':id})
    .then((seniorMatches)=>{
        console.log('did we find anything', seniorMatches);
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
