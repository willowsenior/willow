const Facility = require('../models/Facility');
const Room = require('../models/Room');

/**
 * GET /
 * Home page.
 */
exports.getFacility = (req, res, error) => {
    console.log(' >>>> getFacility >>>>>');
    var id = req.params.facility_id;
    console.log("ID:   "+id);
    var currentFacility;
    var currentRooms;

    Facility.findById(id)
    .then((facility)=>{
        currentFacility = facility;
        console.log('facility'+facility);
        console.log('currentFacility: '+currentFacility);
        console.log(currentFacility.Address);
        console.log(currentFacility.Address.street);
        return Promise.resolve(currentFacility);
    })
    .then(()=>{
        Room.find({'FacilityID':id})
        .then((rooms)=>{
          currentRooms = rooms;
          console.log('currentRooms: '+ currentRooms);   
          res.render('facility', {
            title: 'Facility',
            currentFacility,
            currentRooms
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

exports.getRoom = (req, res, error) => {
    console.log(' >>>> getRoom >>>>>');
    if (error) {
        console.log(error);
    }
    res.render('room', {
        title: 'Room'
    });
};


exports.getRoomSignup = (req, res, error) => {
  console.log(' >>>> getRoomSignup >>>>>');
  var id = req.params.facility_id;
  var currentFacility;

  Facility.findById(id)
  .then((facility)=>{
    currentFacility = facility;
    console.log('facility>>> '+currentFacility);
    res.render('roomsignup',{
      title: 'Room Sign up',
      currentFacility
    });
  })
  .catch((error)=>{
    if(error){
      console.log(error);
    }
  });
};


exports.postRoomSignup = (req, res, error) => {
  console.log(' >>>> postRoomSignup >>>>>');
  const errors = req.validationErrors();
  var id = req.params.facility_id;
  
  
  Facility.findById(id)
  .then((facility)=>{
    var room = new Room({
      FacilityID: id,
      FacilityName: facility.FacilityName,
      RoomName: req.body.roomName,
      RoomCount: req.body.count,
      Gender: req.body.radio,
      RoomFeatures: {
          Oxygen: req.body.oxygen,
          Diabetes: req.body.diabetes,
          Price: req.body.price,
          Incontinence: req.body.incontinence,
          Private: req.body.private,
          SemiPrivate: req.body.semiPrivate,
          Medicaid: req.body.medicaid,
          RespiteCare: req.body.respiteCare,
          Eating : req.body.eating,
          Transfers : req.body.transfers,
          Mobility : req.body.mobility,
          Toileting : req.body.toileting,
          Verbal_Disruption : req.body.verbalDisruption,
          Physical_Aggression : req.body.physicalAggression,
          Socially_Inapproriate_Behaviour : req.body.sociallyInapproriateBehaviour,
          Hallucinations : req.body.hallucinations
      }
    });
  
    /// TO BE REMOVED LATER
    console.log('Room being send to DB');
    console.log(room);
    console.log('req.body.oxygen: '+req.body.Oxygen);
  
    room.save(function(err) {
  
      if (err) {
          console.log(err);
          return next(err);
      }
      res.redirect('/room');
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
  // console.log('req.params.facility_id::  '+id);
  // console.log('currentFacility.FacilityName:: '+currentFacility.FacilityName);
};


exports.getRoomUpdate = (req, res, error) => {
  console.log(">>>> getRoomUpdate >>>>")
  var facility_id = req.params.facility_id;
  var room_id = req.params.room_id;
  var currentRoom;
  var currentFacility;

  Facility.findById(facility_id)
  .then((facility)=>{
    currentFacility = facility;
    console.log('facility update '+currentFacility);
    return Promise.resolve(currentFacility);
  })
  .then(()=>{
    console.log('get room update >> ');
    Room.findById(room_id)
    .then((room)=>{
      currentRoom = room;
      console.log('currentRoom: '+ currentRoom); 
      res.render('updateroom', {
        title: 'Room',
        currentFacility,
        currentRoom
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

exports.putRoomUpdate = (req, res, error) => {
  console.log(' >>>> putRoomUpdate >>>>>');
  console.log('req.body.user: '+req.body.user);
  const errors = req.validationErrors();

  if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
  }

  Facility.findByIdAndUpdate(req.param.facility_id,{$set: req.body})
  .then((facility)=>{
    roomId = req.param.facility_id;
    console.log('roomId:  '+roomId);
    res.render('/facility/'+facility._id,{
      title: 'Room Signup',
      facility,
      roomId
    });
  })
  .catch((error)=>{
    if(error){
      console.log(error);
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

exports.getFacilitySignup = (req, res, error) => {
    console.log(' >>>> getFacilitySignup >>>>>');
    if (!req.user) {
      return res.redirect('/login');
    }
    res.render('facilitysignup', {
        title: 'Facility'
    });
};

exports.postFacilitySignup = (req, res, next) => {
    console.log(' >>>> postFacilitySignup >>>>>');
    console.log(req.body.user);
    const errors = req.validationErrors();

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
        // FacilityPhoto:
        Rating: req.body.rating,

        ComplianceStatus: req.body.complianceStatus
    });

    // var userdata = {
    //     email: req.body.email,
    //     password: req.body.password
    // }

    /// TO BE REMOVED LATER
    console.log('Data being send to DB');
    console.log(facility);

    facility.save(function(err) {
        if(err){
          console.log(err);
          return err;
        }
        res.redirect('/facility/'+facility._id);
    });
};

