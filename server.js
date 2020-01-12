'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Our Dependencies
const client = require('./modules/client.js');
const Weather = require('./modules/weatherConstructor.js');
// const events = require('./modules/events.js');
const isLocationInDataBase = require('./modules/location/isLocationInDataBase');
const getLocationFromAPI = require('./modules/location/getLocationFromAPI');
const getLocationFromDataBase = require('./modules/location/getLocationFromDataBase');
const getYelpData = require('./modules/yelp/getYelpData');
const getMoviesData = require('./modules/movies/getMoviesData');
const getTrailsData = require('./modules/trails/getTrailsData');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// Route Definitions
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/events', eventsHandler);
app.get('/yelp', getYelp);
app.get('/movies', getMovies);
app.get('/trails', getTrails);
// app.get('/all', getAllHandler);
app.use('*', notFoundHandler);
app.use(errorHandler);

/////////////////// LOCATION ///////////////////

function getLocation(request,response) {
  const city = request.query.city;
  console.log('the city is:', city)
  isLocationInDataBase(city)
    .then(data => {
      if(data.rows.length > 0){
        console.log('location was in the database')
        render(data.rows[0], response)
      } else {
        console.log('location was not in the database')
        getLocationFromAPI(city)
          .then(data => render(data, response))
          .catch( (error) => errorHandler(error, request, response) );
      }
    })
}

/////////// WEATHER ////////////////////////

function getWeather(request,response) {
  const latitude = request.query.latitude;
  const longitude = request.query.longitude;
    getWeatherData(latitude, longitude)
    .then ( weatherSummaries => render(weatherSummaries, response) )
    .catch( (error) => errorHandler(error, request, response) );
}

// http://localhost:3000/weather?data%5Blatitude%5D=47.6062095&data%5Blongitude%5D=-122.3320708
// That encoded query string is: data[latitude]=47.6062095&data[longitude]=122.3320708
function getWeatherData(latitude, longitude) {
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;
  return superagent.get(url)
    .then( data => parseWeatherData(data.body) );
};

function parseWeatherData(data) {
  try {
    const weatherSummaries = data.daily.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch(e) {
    return Promise.reject(e);
  }
}

//////////// YELP ////////////////////////

function getYelp(request, response){
  const city = request.query.city;
  getYelpData(city, response);
}

//////////////// MOVIES ///////////////////

function getMovies(request, response){
  let city = request.query.search_query;
  getMoviesData(city, response);
}


///////////// TRAILS //////////////////////////

function getTrails(request, response){
  let latitude = request.query.latitude;
  let longitude = request.query.longitude;
  getTrailsData(latitude, longitude, response);
}



///////////////// EVENTS ////////////////////

function eventsHandler(request,response) {
  let city = request.query.search_query;

console.log('events city', city)

  getEventsData(city)
    .then ( eventsSummaries => render(eventsSummaries, response) )
    .catch( (error) => errorHandler(error, request, response) );
}

function getEventsData(query){
  console.log('my query', query);
  const url = `http://api.eventful.com/json/events/search?location=${query}&date=Future&app_key=${process.env.EVENTFUL_API_KEY}`;

  return superagent.get(url)
    .then(data => parseEventData( JSON.parse(data.text)))
    .catch( (error) => errorHandler(error, request, response));

}

function parseEventData(data) {
  try {
    const events = data.events.event.map(eventData => {
      const event = new Event(eventData);
      return event;
    });
    return Promise.resolve(events);
  } catch(e) {
    return Promise.reject(e);
  }
}

function Event(event) {
  this.link = event.url;
  this.name = event.title;
  this.event_date = event.start_time;
  this.summary = event.description;
}

// function getAllHandler(request,response) {
//   let location = request.query.data;
//   let requests = [];
//   requests.push(getWeatherData(location));

//   Promise.all(requests)
//     .then(allData => {
//       render(allData, response);
//     });
// }

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
  .then( getLocationFromDataBase )
  .then( startServer )
  .catch( err => console.error(err) );  