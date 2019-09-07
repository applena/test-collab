'use strict';

const superagent = require('superagent');

const events = {};

// Sample URL: http://localhost:3000/events?data%5Bformatted_query%5D=Seattle
events.getEventsData = function(location) {
  const url = `https://www.eventbriteapi.com/v3/events/search?token=${process.env.EVENTBRITE_API_KEY}&location.address=${location}`;
  return superagent.get(url)
    .then( data => parseEventData(data.body) );
};

// Helpers
function parseEventData(data) {
  try {
    const events = data.events.map(eventData => {
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
  this.name = event.name.text;
  this.event_date = new Date(event.start.local).toString().slice(0, 15);
  this.summary = event.summary;
}

module.exports = events;