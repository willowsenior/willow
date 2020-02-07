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
    MedicAid: String,
    AssistedActivites: Array,
    BehaviorProblems: Boolean,
    PhysicalAggressive: Boolean,
    SevereOrFrequentBehaviors: Boolean,
    MemoryCare: Boolean,
    AddititonalIssues: String,
    InsulinShots: Number,
    ChangeCatheterOrColostomyBag: Boolean,
    OxygenTank: Boolean,
    ContinousOxygen: Boolean,
    DesiredRent: Number,
}, { timestamps: true });


const Facility = mongoose.model('Facility', facilitySchema);
module.exports = Facility;