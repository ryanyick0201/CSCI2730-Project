# CSCI2730-Project
## Deploy the smart contract on Ethereum blockchain
1. `npm install`: install all npm packages.
2. Install Ganache and check the port number must be 7545.
3. `node compile.js`: compile the smart contract.
4. `node index.js`: check if everything runs smoothly up to this step.
5. `node deploy.js`: deploy the smart contract.

 ## TODO:
- Create the front-end with HTML&CSS&JavaScript or ReactJs
  + Refer to interact.js, call the functions in the smart contract to perform the business logic
- Create a MongoDB server and create a User document (`walletAddress`, `password`) and a FlightDelay document (`departureDate`, `departureTime`, `flightNumber`, `delayDuration`)
- Create a backend server (with RESTful API endpoints) to 
  + Conenct to the MongoDB server
  + POST request: Log in
  + POST requset: User registration
  + GET request: Fetch flight delay document with the key `(departureDate, departureTime, flightNumber)`
