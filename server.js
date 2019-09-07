'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');

// Our Dependencies
const client = require('./modules/client.js');
const weather = require('./modules/weather.js');
const events = require('./modules/events.js');
const location = require('./modules/location.js');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// Route Definitions
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/events', eventsHandler);
app.get('/all', getAllHandler);
app.use('*', notFoundHandler);
app.use(errorHandler);


function getAllHandler(request,response) {
  let location = request.query.data;
  let requests = [];
  requests.push(weather.getWeatherData(location));

  Promise.all(requests)
    .then(allData => {
      render(allData, response);
    });
}

// Even after modularization, these look the exact same. Can we break this out even further?
// Stretch Goals, for sure
function locationHandler(request,response) {
  const city = request.query.data;
  location.getLocationData(city)
    .then(data => render(data, response))
    .catch( (error) => errorHandler(error, request, response) );
}

function weatherHandler(request,response) {
  const location = request.query.data;
  weather.getWeatherData(location)
    .then ( weatherSummaries => render(weatherSummaries, response) )
    .catch( (error) => errorHandler(error, request, response) );
}

function eventsHandler(request,response) {
  const location = request.query.data.formatted_query;
  events.getEventsData(location)
    .then ( weatherSummaries => render(weatherSummaries, response) )
    .catch( (error) => errorHandler(error, request, response) );
}

function render(data, response) {
  response.status(200).json(data);
}

function notFoundHandler(request,response) {
  response.status(404).send('huh?');
}

function errorHandler(error,request,response) {
  response.status(500).send(error);
}

function startServer() {
  app.listen(PORT, () => console.log(`Server up on ${PORT}`));
}

// Start Up the Server after the database is connected and cache is loaded
client.connect()
  .then( location.loadCache )
  .then( startServer )
  .catch( err => console.error(err) );  