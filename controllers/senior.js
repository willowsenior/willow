const SeniorModel = require('../models/Senior');
const myconstants = require('../utils/constants');

//** Start creating a /senior
//* Create a new local account.
//
exports.getSeniorRecordCreate = (req, res) => {
    if (!req.user.isAdmin) {
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

// exports.viewSeniorMatch = (req, res) => {
//   console.log('is this hitting');
//   if (!req.user.isAdmin) {
//       return res.redirect('/');
//   }
//    var currentSenior = {
//         _id: '23785639487'
//    };
//   res.render('seniors/viewseniormatch', {
//       title: 'View Senior Match',
//       currentSenior,
//       myconstants
//   });
// };


exports.postCreateSenior = (req, res) => {
    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup'); //TODO: Update to Senior Creation Page
    }


    console.log('okay setup the senior with the model');

    var seniorModel = new SeniorModel({
        SeniorName: req.body.seniorName,
        WhenAreYouLooking: req.body.whenAreYouLooking,
        ContactName: req.body.contactName,
        ContactEmail: req.body.contactEmail,
        ContactRelationship: req.body.contactRelationship,
        ContactPowerOfAttorney: req.body.contactPowerOfAttorney,
        ContactHealthProxy: req.body.contactHealthProxy,
        Gender: req.body.gender,
        Age: req.body.age,
        Zipcode: req.body.zipCode,
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
        MonthlyPayment: req.body.monthlyPayment,
        MedicAid: req.body.medicAid,
        Pension: req.body.pension,
        VeteranOrVeteranSpouse: req.body.veteranOrVeteranSpouse,
        PropertyOwner: req.body.propertyOwner,
        LongTermInsurance: req.body.longTermInsurance,
        LifeInsurance: req.body.lifeInsurance,
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
    });

    console.log('okay save the senior');

    seniorModel.save()
    .then(()=>{
      console.log('okay redirect');
      res.redirect('/home');
    })
    .catch(err =>{
      console.log("ERRRRRRR");
      if(err){
        console.log(err);
      }
    });
};

exports.viewAllSeniors = (req, res) => {
    
    var currentSenior = {
        Senior_Living: false
    };
    

};

exports.getSeniors = (req, res) => {
    if (!req.user.isAdmin) {
        return res.redirect('/');
    }
    const errors  = req.validationErrors();
    var name      = req.query.name || '',
        id        = req.query.senior_id || undefined,
        page      = req.query.page,
        skipCount = req.query.skipCount || 0;


    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup'); //TODO 404 page
    }

    if (id) {
        SeniorModel.findById(id)
        .then((senior) => {
            console.log('seniors here for the specific id', seniors);
            //TODO: Load page with seniors
            res.render('seniors/viewallseniors', {
                title: 'View All Seniors',
                seniors,
                myconstants
            });
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
    } else {
        SeniorModel.find(
            { 'ContactName': { "$regex": name, "$options": "i" } },
            //null,
            //{ skip: skipCount, limit: 10 }
         )
        .then((seniors) => {
            console.log('seniors here?', seniors);
            //TODO: Load page with seniors
            res.render('seniors/viewallseniors', {
                title: 'View All Seniors',
                seniors,
                myconstants
            });
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
    }
    

};

exports.getSeniorById = (req, res) => {
    var id = req.params.senior_id;

    if (!id) {
        req.flash('errors Missing Id');
        return res.redirect('/signup'); //TODO 404 page
    }
    
    SeniorModel.findById(id)
        .then((senior) => {
            return senior;
        })
        .catch((error) => {
            return error;
            if (error) {
                console.log(error);
            }
        });
};

exports.getSearchSeniorByName = (req, res) => {
    const errors = req.validationErrors();
    var lastName = req.query.lastName || "";
    var skipCount = req.query.skipCount || 0;

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup'); //TODO 404 page
    }
    SeniorModel.find(
        { 'LastName': { "$regex": lastName, "$options": "i" } },
        null,
        { skip: skipCount, limit: 10 })
        .then((seniors) => {
            //TODO: Load page with seniors
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
}

exports.deleteSenior = (req, res) => {
    const errors = req.validationErrors();
    var id = req.params.senior_id;

    if (!id || errors) {
        req.flash('errors', errors || "Missing Id");
        return res.redirect('/signup'); //TODO 404 page
    }

    SeniorModel.findByIdAndDelete(id).then(
        () => { }//TODO Success Page.
    ).catch((error) => {
        if (error) {
            console.log(error);
        }
    });
}

exports.postUpdateSenior = (req, res) => {
    const errors = req.validationErrors();
    var id = req.params.senior_id;

    if (!id || errors) {
        req.flash('errors', errors || "Missing Id");
        return res.redirect('/signup'); //TODO 404 page
    }

    SeniorModel.findByIdAndUpdate(id, {
        $set: {
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            WhenAreYouLooking: req.body.whenAreYouLooking,
            ContactFirstName: req.body.contactFirstName,
            ContactLastName: req.body.contactLastName,
            ContactEmail: req.body.contactEmail,
            Gender: req.body.gender,
            Age: req.body.age,
            Zipcode: req.body.zipCode,
            ShortTermStay: req.body.shortTermStay,
            InsulinShots: req.body.insulinShots,
            OxygenTank: req.body.oxygenTank,
            ChangeOxygenTank: req.body.changeOxygenTank,
            AllTimeOxygen: req.body.allTimeOxygen,
            ChangeCatheter: req.body.changeCatheter,
            MedicationManagement: req.body.medicationmManagement,
            LiquidDiets: req.body.liquidDiets,
            GroundDiets: req.body.groundDiets,
            MemoryCare: req.body.memoryCare,
            Wandergaurd: req.body.wanderGaurd,
            MonthlyPayment: req.body.monthlyPayment,
            MedicAid: req.body.medicAid,
            Pension: req.body.pension,
            VeteranOrVeteranSpouse: req.body.veteranOrVeteranSpouse,
            PropertyOwner: req.body.propertyOwner,
            LongTermInsurance: req.body.longTermInsurance,
            LifeInsurance: req.body.lifeInsurance,
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
        }
    }).then(() => { })
        .catch((errors) => {
            if (error) {
                console.log(error);
            }
        });
};