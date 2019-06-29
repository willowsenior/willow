const mongoose = require('mongoose');

const SeniorMatchSchema  = new mongoose.Schema({
    SeniorId: String,
    RoomId: String,
    FacilityId: String,
    IsViewed: Boolean,
}, { timestamps: true });

const SeniorMatch = mongoose.model('SeniorMatch', SeniorMatchSchema);
module.exports = SeniorMatch;