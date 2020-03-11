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

    // Finance
    MedicAid: Boolean,
    DesiredRent: Number,

    BehaviorProblems: Boolean,
    PhysicalAggressive: Boolean,
    SevereOrFrequentBehaviors: Boolean,
    //Additional
    InsulinShots: Number,

    //Behavior Problems
    AssistedActivites: Array, // what goes into this array?
    MemoryCare: Boolean,
    OxygenTank: Boolean,
    ContinousOxygen: Boolean,
    ChangeCatheterOrColostomyBag: Boolean,
    AddititonalIssues: String,
}, { timestamps: true });


const Facility = mongoose.model('Facility', facilitySchema);
module.exports = Facility;