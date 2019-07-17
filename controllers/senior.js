const SeniorModel = require('../models/Senior');
const myconstants = require('../utils/constants');

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
    console.log('do we have the model', seniorModel);

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
            console.log('all the seniors', seniors);
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
    var id = req.params.senior_id;

    if (!req.user || !req.user.isAdmin) {
        return res.redirect('/');
    }

    if (!id) {
        req.flash('errors', "Missing Senior Id");
        return res.redirect('/signup'); //TODO 404 page
    }

    try {

      var seniorObject = await createSeniorObject(req);
      SeniorModel.findByIdAndUpdate(id, {
        $set: seniorObject
      }).then(() => { 
        res.redirect('/getseniors');
      })
      .catch((errors) => {
          console.log(errors || "Senior Update Error.  ID: " + id);
      });
    } catch (e) {
      console.log('errors updating senior', e);
    }
    

    
};

function createSeniorObject(req) {
    return {
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
        MonthlyPayment: req.body.monthlyPayment,
        MedicAid: req.body.medicAid,
        Pension: req.body.pension,
        VeteranOrVeteranSpouse: req.body.veteranOrVeteranSpouse,
        PropertyOwner: req.body.propertyOwner,
        LongTermInsurance: req.body.longTermInsurance,
        LifeInsurance: req.body.lifeInsurance,
        SeniorMatchId: null,
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