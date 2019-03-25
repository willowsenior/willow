const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
    FacilityName: { type: String, unique: true },
    Address: {
        street: String,
        city: String,
        state: String,
        zip: Number
    },
    Contact: Number,
    ContactName: String,
    Email: { type: String },
    // FacilityPhoto:
    FacilityFeatures: {
        Eating_noassistance: Boolean,
        Eating_intermittent: Boolean,
        Eating_continual: Boolean,
        Eating_byhand: Boolean,
        Eating_tube: Boolean,
        Dailyliving_intermittent: Boolean,
        Dailyliving_oneperson: Boolean,
        Dailyliving_twopeople : Boolean,
        Dailyliving_bed : Boolean,
        Behaviourial_disruption1 : Boolean,
        Behaviourial_aggression1 : Boolean,
        Behaviourial_disruption2 : Boolean,
        Behaviourial_aggression2 : Boolean,
    }
}, { timestamps: true });


const Facility = mongoose.model('Facility', facilitySchema);
module.exports = Facility;