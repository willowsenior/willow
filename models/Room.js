const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    FacilityName: String,
    RoomName: String,
    RoomCat: String,
    RoomFeatures: {
        Oxygen: Boolean,
        Diabetes: Boolean,
        Price: Boolean,
        Incontinence: Boolean,
        Gender: Boolean,
        Private: Boolean,
        SemiPrivate: Boolean,
        Medicaid: Boolean,
        RespiteCare: Boolean
    }
}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;