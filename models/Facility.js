const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
    FacilityName: String,
    Address: {
        street: String,
        city: String,
        state: String,
        zip: Number
    },
    Contact: Number,
    ContactName: String,
    email: { type: String, unique: true },
    // FacilityPhoto:
    Rating: Number,
    ComplianceStatus: Boolean
}, { timestamps: true });


const Facility = mongoose.model('Facility', facilitySchema);
module.exports = Facility;