'use strict';

const pg = require('pg');

// Start Up the Server after the database is connected and cache is loaded
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

module.exports = client;
