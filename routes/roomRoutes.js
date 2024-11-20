const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

// Fetch Specific Room Details
router.get('/room/details', async (req, res) => {
    try {
        const { roomNumber } = req.query; // Get the room number from the query string
        const room = await Room.findOne({ roomNumber });

        if (!room) {
            return res.render('error', {
                message: `Room ${roomNumber} not found.`,
                backLink: '/'
            });
        }

        res.render('roomDetails', { room }); // Render roomDetails.ejs with the room data
    } catch (error) {
        res.render('error', {
            message: 'Server error occurred while fetching room details.',
            backLink: '/'
        });
    }
});


// Book a Room
router.post('/room/book', async (req, res) => {
    try {
        const { roomNumber, userName, contact } = req.body;
        const room = await Room.findOne({ roomNumber });

        if (!room) {
            return res.render('error', { message: 'Room not found.', backLink: '/' });
        }

        if (room.status === 'occupied') {
            return res.render('error', { message: 'Room already booked.', backLink: '/' });
        }

        room.status = 'occupied';
        room.bookingDetails = { userName, contact, bookingDate: new Date() };
        await room.save();

        res.render('success', { message: 'Room booked successfully!', backLink: '/' });
    } catch (error) {
        res.render('error', { message: 'Server error occurred.', backLink: '/' });
    }
});

// Cancel Booking
router.post('/room/cancel', async (req, res) => {
    try {
        const { roomNumber } = req.body;
        const room = await Room.findOne({ roomNumber });

        if (!room || room.status === 'available') {
            return res.render('error', { message: 'No booking exists to cancel.', backLink: '/' });
        }

        room.status = 'available';
        room.bookingDetails = null;
        await room.save();

        res.render('success', { message: `Booking for Room ${roomNumber} cancelled successfully!`, backLink: '/' });
    } catch (error) {
        res.render('error', { message: 'Server error occurred.', backLink: '/' });
    }
});

// Fetch All Bookings
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Room.find({ status: 'occupied' });
        res.render('bookings', { bookings });
    } catch (error) {
        res.render('error', { message: 'Server error occurred.', backLink: '/' });
    }
});

// Fetch User-Specific Bookings using query param 'userName'
router.get('/user/bookings', async (req, res) => {
    try {
        const userName = req.query.userName; // Capture userName from query params
        const bookings = await Room.find({ "bookingDetails.userName": userName });

        if (bookings.length === 0) {
            return res.render('error', {
                message: `No bookings found for user: ${userName}`,
                backLink: '/'
            });
        }

        res.render('userBookings', { userName, bookings });
    } catch (error) {
        res.render('error', { message: 'Server error occurred while fetching bookings.', backLink: '/' });
    }
});



// Render Update Booking Form
router.get('/room/update/:roomNumber', async (req, res) => {
    try {
        const room = await Room.findOne({ roomNumber: req.params.roomNumber });

        if (!room || room.status === 'available') {
            return res.render('error', {
                message: 'This room is not currently booked.',
                backLink: '/'
            });
        }

        res.render('updateBooking', { room });
    } catch (error) {
        res.render('error', {
            message: 'Server error occurred while fetching booking details.',
            backLink: '/'
        });
    }
});

// Handle Update Booking Request
router.post('/room/update/:roomNumber', async (req, res) => {
    try {
        const { userName, contact } = req.body;
        const room = await Room.findOne({ roomNumber: req.params.roomNumber });

        if (!room || room.status === 'available') {
            return res.render('error', {
                message: 'This room is not currently booked.',
                backLink: '/'
            });
        }

        room.bookingDetails.userName = userName;
        room.bookingDetails.contact = contact;
        await room.save();

        res.render('success', {
            message: `Booking for Room ${room.roomNumber} updated successfully!`,
            backLink: '/'
        });
    } catch (error) {
        res.render('error', {
            message: 'Server error occurred while updating booking.',
            backLink: '/'
        });
    }
});

// Check Room Availability
router.get('/room/check', async (req, res) => {
    try {
        const { roomNumber } = req.query;
        const room = await Room.findOne({ roomNumber });

        if (!room) {
            return res.render('error', {
                message: `Room ${roomNumber} not found.`,
                backLink: '/'
            });
        }

        res.render('success', {
            message: `Room ${roomNumber} is currently ${room.status}.`,
            backLink: '/'
        });
    } catch (error) {
        res.render('error', {
            message: 'Server error occurred while checking room availability.',
            backLink: '/'
        });
    }
});


module.exports = router;
