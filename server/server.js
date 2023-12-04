const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Add this line to parse JSON in the request body
const cors = require('cors');

// Initialize Express
const app = express();
const port = 8000; // Choose any port you prefer

// Add middleware to parse JSON in the request body
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017/CSCI2730';

// Define MongoDB Schema
const flightDelaySchema = new mongoose.Schema({
    departureDate: Number,
    departureTime: Number,
    airline: String,
    delayTime: Number
  });
  
const userSchema = new mongoose.Schema({
  walletAddress: String,
  password: String,
});

// Create MongoDB model
const FlightDelay = mongoose.model('flightdelays', flightDelaySchema, 'flightdelays');
const User = mongoose.model('users', userSchema, 'users');

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Define a simple test route
    app.get('/', (req, res) => {
      res.send('Server and MongoDB Connection Test Successful!');
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

      // Route to add a new user
      app.post('/addUser', async (req, res) => {
        try {
          const { walletAddress, password } = req.body;
          let inpWalletAddress = walletAddress;
          let inpPassword = password;

          console.log(inpWalletAddress, inpPassword);

          // Create a new user document
          const newUser = new User({ walletAddress: inpWalletAddress, password: inpPassword });

          console.log(newUser);
          console.log(newUser.walletAddress);
          // Save the new user to the database
          await newUser.save();

          console.log('User added successfully');
          res.json({ message: 'User added successfully' });
        } catch (error) {
          console.error('Error adding user:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

      // Route to do authentication
      app.post('/authenticate', async (req, res) => {
        try {
          const { walletAddress, password } = req.body;
          console.log(walletAddress, password);
      
          // Find a user with the given walletAddress and password
          const user = await User.findOne({ walletAddress, password });
      
          if (user) {
            // Authentication successful
            console.log('Authentication successful');
            res.json({ authenticated: true });
          } else {
            // Authentication failed
            console.log('Authentication failed');
            res.json({ authenticated: false });
          }
        } catch (error) {
          console.error('Error during authentication:', error);
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
