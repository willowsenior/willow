const mongoose = require('mongoose');

const SeniorMatchSchema  = new mongoose.Schema({
    SeniorID: String,
    RoomId: String,
    FacilityId: String,
    IsViewed: bool,
}, { timestamps: true });

const SeniorMatch = mongoose.model('SeniorMatch', SeniorMatchSchema);
module.exports = SeniorMatch;