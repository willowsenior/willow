const SeniorMatchModel = require('../models/SeniorMatch');

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

  exports.getSeniorMatchById = (req, res) => {
    const errors = req.validationErrors();
    var id = req.params.seniormatch_id;

    if(!id || errors) {
        req.flash('errors', errors || "Missing Id");
        return res.redirect('/signup'); //TODO 404 page
    }

    SeniorMatchModel.findById(id)
    .then((seniorMatch)=>{
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

exports.patchSeniorMatchMarkAsViewed = (req, res) => {
    const errors = req.validationErrors();
    var id = req.body.seniormatch_id;

    if(!id || errors) {
        req.flash('errors', errors || "Missing Id");
        return res.redirect('/signup'); //TODO 404 page
    }

    SeniorMatchModel.findByIdAndUpdate(id,{$set: {
        IsViewed: true
    }}).then(()=> {})
    .catch((errors) => {
        if(error){
            console.log(error);
        }
    });
};

exports.getSeniorMatchesByFacilityId = (req, res) => {
    const errors = req.validationErrors();
    var id = req.params.facility_id;

    if(!id || errors) {
        req.flash('errors', errors || "Missing Facility Id");
        return res.redirect('/signup'); //TODO 404 page
    }

    SeniorMatchModel.find({'FacilityID':id})
    .then((seniorMatches)=>{
        //TODO
    }).catch((errors) => {
        if(error){
            console.log(error);
        }
    });
};