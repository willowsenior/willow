const SeniorMatchModel = require('../models/SeniorMatch');
const SeniorController = require('./senior');
const SeniorModel = require('../models/Senior');
const myconstants = require('../utils/constants');

exports.postCreateSeniorMatch = (req, res) => {
    const errors = req.validationErrors();
  
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup'); //TODO: Update to Senior Creation Page
    }

    var seniorMatch = new SeniorMatchModel({
        SeniorId: req.body.senior_id,
        RoomId: req.body.room_id,
        FacilityId: req.body.facility_id,
        IsViewed: false
    });
  
    seniorMatch.save().then(() => {
    }).catch((error) => {
        if(error){
            console.log(error);
        }
    })
  };


  //Get the match and the senior
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

exports.deleteSeniorMatch = (req, res) => {
    const errors = req.validationErrors();
    var id = req.body.seniormatch_id;

    if(!id || errors) {
        req.flash('errors', errors || "Missing Id");
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
    const errors = req.validationErrors();
    var id = req.body.seniormatch_id;

    if(!id || errors) {
        req.flash('errors', errors || "Missing Id");
        return res.redirect('/signup'); //TODO 404 page
    }

    SeniorMatchModel.findByIdAndUpdate(id,{$set: {
        IsViewed: req.body.senior_id,
        RoomId: req.body.room_id,
        FacilityId: req.body.facility_id
    }}).then(()=> {})
    .catch((errors) => {if(error){
        console.log(error);
    }});
};

function patchSeniorMatchMarkAsViewed(id) {
    var id = id;

    SeniorMatchModel.findByIdAndUpdate(id,{$set: {
        IsViewed: true
    }}).then(()=> {})
    .catch((errors) => {
        if(error){
            console.log(error);
        }
    });
};

exports.getSeniorMatchesByFacilityId = (params) => {
    var id = params.id;
    console.log('hit hereeeee', id);
    return Promise.resolve([]);

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
