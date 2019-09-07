'use strict';

const superagent = require('superagent');

const weather = {};

// http://localhost:3000/weather?data%5Blatitude%5D=47.6062095&data%5Blongitude%5D=-122.3320708
// That encoded query string is: data[latitude]=47.6062095&data[longitude]=122.3320708
weather.getWeatherData = function(location) {
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${location.latitude},${location.longitude}`;
  return superagent.get(url)
    .then( data => parseWeatherData(data.body) );
};

// Helpers

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

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

module.exports = weather;