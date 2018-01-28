const http = require('http');
const fortune = require('fortune');
const fortuneHTTP = require('fortune-http');
const jsonApiSerializer = require('fortune-json-api');

/**
 * A user "tracks" (many) prices.
 * A price has only one "tracker", or tracking user.
 */
const store = fortune({
  user: {
    email: String,

    // Many-to-one relationship of tracked prices to user.
    price: [ Array('price'), 'user' ]
  },
  price: {
    name: String,
    note: String,
    savedPrice: Number,
    targetPrice: Number,
    selector: String,
    imageSrc: String,
    url: String,

    // One-to-many relationship of price tracking user to prices.
    user: [ 'user', 'price' ]
  }
});

const listener = fortuneHTTP(store, {
  serializers: [
    [ jsonApiSerializer, /* options */ ]
  ]
});

const server = http.createServer((request, response) =>
  listener(request, response)
  .catch(error => { console.error(error); }));

server.listen(8080);