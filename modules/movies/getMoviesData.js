const Movie = require('./movieConstructor');
const superagent = require('superagent');

function getMoviesData(city, response){
  let url = `https://api.themoviedb.org/3/search/movie/?api_key=${process.env.MOVIES_API_KEY}&language=en-US&page=1&query=${city}`;

  superagent.get(url)
    .then(results => {
      const movieResults = results.body.results.map(movie => {
        return new Movie(movie);
      });
      response.send(movieResults);
    })
    .catch( (error) => console.error(error) ); 
}

module.exports = getMoviesData;