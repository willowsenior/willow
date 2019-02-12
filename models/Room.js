const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    FacilityID: String,
    FacilityName: String,
    RoomName: String,
    RoomCount: Number,
    Gender: String,
    RoomFeatures: {
        Oxygen: Boolean,
        Diabetes: Boolean,
        Price: Boolean,
        Incontinence: Boolean,
        Private: Boolean,
        SemiPrivate: Boolean,
        Medicaid: Boolean,
        RespiteCare: Boolean,
        Eating : Boolean,
        Transfers : Boolean,
        Mobility : Boolean,
        Toileting : Boolean,
        Verbal_Disruption : Boolean,
        Physical_Aggression : Boolean,
        Socially_Inapproriate_Behaviour : Boolean,
        Hallucinations : Boolean,
    }
}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;