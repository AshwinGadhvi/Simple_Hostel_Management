const mongoose = require('mongoose');
const Room = require('./models/Room'); // Ensure the path matches your folder structure

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/hostel', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Predefined data
const seedRooms = [
    { roomNumber: 101, status: 'available' },
    { roomNumber: 102, status: 'occupied', bookingDetails: { userName: 'John Doe', contact: '1234567890', bookingDate: new Date() } },
    { roomNumber: 103, status: 'available' },
    { roomNumber: 104, status: 'available' },
    { roomNumber: 105, status: 'occupied', bookingDetails: { userName: 'Jane Doe', contact: '9876543210', bookingDate: new Date() } },
];

// Insert data into MongoDB
const seedDatabase = async () => {
    try {
        // Clear existing data
        await Room.deleteMany();
        console.log('Existing data cleared.');

        // Insert new data
        await Room.insertMany(seedRooms);
        console.log('Seed data inserted successfully.');

        // Close the connection
        mongoose.connection.close();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

// Execute the seeding process
seedDatabase();
