const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const roomRoutes = require('./routes/roomRoutes');  // Make sure this path is correct

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));  // To serve static files like CSS
app.use(bodyParser.urlencoded({ extended: true }));  // To handle POST request data

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/hostel', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.render('index');  // Render the homepage (index.ejs)
});

// Use room routes for all booking-related actions
app.use('/', roomRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
