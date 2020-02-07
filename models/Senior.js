const mongoose = require('mongoose');

const SeniorSchema = new mongoose.Schema({
    SeniorName: String,
    Gender: String, //TODO: Enum,
    Age: Number,
    Zipcode: String,
    FamilyEmail: String,
    RespiteCare:Boolean,
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
    IsDeleted: {
        default: 0,
        type: Boolean
    },
    SeniorMatchId: String, //This is once we implement an ACTUAL match for a senior, aka choose one from the array of RoomMatches
    RoomMatches: Array,
}, { timestamps: true });

const Senior = mongoose.model('Senior', SeniorSchema);
module.exports = Senior;