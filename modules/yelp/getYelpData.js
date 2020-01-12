const superagent = require('superagent');
const Yelp = require('./yelpConstructor');

function getYelpData(city, response){
  const url = `https://api.yelp.com/v3/businesses/search?location=${city}`;

  superagent.get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(result => {
      const yelpSummaries = result.body.businesses.map(business => {
        const review = new Yelp(business);
        return review;
      });

      response.send(yelpSummaries);
    })
    .catch( (error) => console.error(error) );
}

module.exports = getYelpData;