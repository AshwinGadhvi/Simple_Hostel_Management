const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomNumber: { type: Number, required: true, unique: true },
    status: { type: String, enum: ['available', 'occupied'], default: 'available' },
    bookingDetails: {
        userName: String,
        contact: String,
        bookingDate: Date,
    },
});

module.exports = mongoose.model('Room', RoomSchema);
