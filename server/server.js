const express = require('express');
const mongoose = require('mongoose');

// Initialize Express
const app = express();
const port = 8000; // Choose any port you prefer

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017/CSCI2730';

// Define MongoDB Schema
const flightDelaySchema = new mongoose.Schema({
    departureDate: Number,
    departureTime: Number,
    airline: String,
    delayTime: Number
  });
  
  // Create MongoDB model
  const FlightDelay = mongoose.model('flightDelay', flightDelaySchema, 'flightDelay');

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Define a simple test route
    app.get('/', (req, res) => {
      res.send('MongoDB Connection Test Successful!');
    });

    // Route to retrieve flight delay info based on parameters
    app.get('/flightDelayInfo', async (req, res) => {
        try {
          const { departureDate, departureTime, airline } = req.query;
  
          // Query the database based on parameters
          const flightDelayData = await FlightDelay.find({
            departureDate: departureDate, departureTime: departureTime, airline: airline
          });
  
          console.log("Data retrieved")
          res.json(flightDelayData);
        } catch (error) {
          console.error('Error retrieving flight delay info:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })

  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
