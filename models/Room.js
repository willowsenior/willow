const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    FacilityID: String,
    FacilityName: String,
    RoomName: String,
    RoomCount: Number,
    Gender: String,
    RoomType: String,
    Range: {
        min: { type: Number, min: 0 },
        max: { type: Number, min: 0 }
    },
    Medicaid: Boolean,
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
    SeniorMatches: Array, //Array of all SeniorMatch's that have been made to this room
}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;