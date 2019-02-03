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
    Rating: Number,
    ComplianceStatus: String
}, { timestamps: true });


const Facility = mongoose.model('Facility', facilitySchema);
module.exports = Facility;