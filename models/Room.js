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
    MedicAid: String
}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;