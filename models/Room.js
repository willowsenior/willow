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
    MedicAid: String,
    Wandergaurd: String,
    Hallucination: String,
    MemoryCare: String,
    InsulinShots: Number,
    OxygenTank: String,
    ChangeOxygenTank: String,
    AllTimeOxygen: String,
    ChangeCatheter: String,
    MedicationManagement: String,
    LiquidDiets: String,
    GroundDiets: String,
    // FacilityPhoto:
    FacilityFeatures: {
        Eating_noassistance: Boolean,
        Eating_intermittent: Boolean,
        Eating_continual: Boolean,
        Eating_byhand: Boolean,
        Eating_tube: Boolean,
        Transfers_none: Boolean,
        Transfers_intermittent: Boolean,
        Transfers_oneperson: Boolean,
        Transfers_twoperson: Boolean,
        Transfers_cannot: Boolean,
        Mobiliy_noassisstance: Boolean,
        Mobiliy_intermittent: Boolean,
        Mobiliy_continual: Boolean,
        Mobiliy_wheels: Boolean,
        Mobiliy_cannotmove: Boolean,
        Toileting_noassisstance: Boolean,
        Toileting_bowel: Boolean,
        Toileting_continual: Boolean,
        Toileting_nobathroomincontinent: Boolean,
        Toileting_bathroomincontinent: Boolean,
        Verbal_none: Boolean,
        Verbal_infrequent: Boolean,
        Verbal_predictable: Boolean,
        Verbal_onceunpredictable: Boolean,
        Verbal_multipleunpredictable: Boolean,
        Physical_none: Boolean,
        Physical_infrequent: Boolean,
        Physical_predictable: Boolean,
        Physical_onceunpredictable: Boolean,
        Physical_multipleunpredictable: Boolean,
        Behaviourial_none : Boolean,
        Behaviourial_yesnondisruptive : Boolean,
        Behaviourial_infrequent : Boolean,
        Behaviourial_frequent : Boolean,
        Behaviourial_unpredictable : Boolean
    }
}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;