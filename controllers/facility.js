const Facility = require('../models/Facility');
const Room = require('../models/Room');

/**
 * GET /
 * Home page.
 */
exports.getFacility = (req, res, error) => {
    var id = req.params.facility_id;
    console.log("ID:   "+id);
    var currentFacility;
    var currentRooms;

    Facility.findById(id)
    .then((facility)=>{
        currentFacility = facility;
        //console.log('facility'+facility);
        //console.log('currentFacility: '+currentFacility);
        //console.log(currentFacility.Address);
        //console.log(currentFacility.Address.street);
        return Promise.resolve(currentFacility);
    })
    .then(()=>{
        Room.find({'FacilityID':id})
        .then((rooms)=>{
          currentRooms = rooms;
          //console.log('currentRooms: '+ currentRooms); 
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
      RoomType: req.body.roomtype,
      Range:{
        min: req.body.min,
        max: req.body.max
      },
      MedicAid: req.body.medicaid
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
  const errors = req.validationErrors();

  if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
  }
  var facilityID = req.params.facility_id;
  Facility.findByIdAndUpdate(facilityID,{$set: req.body})
  .then((facility)=>{
    console.log(facilityID);
    roomId = req.params.room_id;
    console.log(roomId);
    console.log('roomId:  '+roomId);
    res.render('/facility/'+facility._id,{
      title: 'Room Signup',
      facility,
      roomId
    });
    return Promise.resolve()
  })
  .catch((error)=>{
    console.log("ERRRRRRR");
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
    if (!req.user) {
      return res.redirect('/login');
    }
    res.render('facilitysignup', {
        title: 'Facility'
    });
};

exports.postFacilitySignup = (req, res, next) => {
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
        FacilityFeatures: {
          Eating_noassistance: req.body.eating_noassistance,
          Eating_intermittent: req.body.eating_intermittent,
          Eating_continual: req.body.eating_continual,
          Eating_byhand: req.body.eating_byhand,
          Eating_tube: req.body.eating_tube,
          Dailyliving_intermittent: req.body.dailyliving_intermittent,
          Dailyliving_oneperson: req.body.dailyliving_oneperson,
          Dailyliving_twopeople: req.body.dailyliving_twopeople,
          Dailyliving_bed : req.body.dailyliving_bed,
          Behaviourial_disruption1 : req.body.behaviourial_disruption1,
          Behaviourial_aggression1 : req.body.behaviourial_aggression1,
          Behaviourial_disruption2 : req.body.behaviourial_disruption2,
          Behaviourial_aggression2 : req.body.behaviourial_aggression2
        }
    });

    // var userdata = {
    //     email: req.body.email,
    //     password: req.body.password
    // }

    /// TO BE REMOVED LATER
    console.log('Data being send to DB');
    //console.log(facility);

    facility.save(function(err) {
        if(err){
          console.log(err);
          return err;
        }
        res.redirect('/facility/'+facility._id);
    });
};

