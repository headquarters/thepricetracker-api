const server = require('../index.js');
const r2 = require('r2');
const { expect } = require('chai');

/**
 * The following tests are meant to have side effects because the
 * default in-memory Fortune.js database gets reset any time these tests are run. 
 * So, entity creation tests run first to create entities that are later fetched. 
 */
describe('The Price Tracker API server', function() {
  const jsonType = 'application/vnd.api+json';
  const headers = {
    'Content-Type': jsonType,
    'Accept': jsonType,
  };

  // These IDs ARE updated in tests and used in the fetching tests
  let userId;
  let priceId;

  it('serves up a JSON API', async function serveJsonApi() {
    let res = await r2.get('http://localhost:8080/', {
      headers
    }).response;

    let body = await res.json();

    expect(body.jsonapi.version).to.equal('1.0');
  });

  it('[POST] can create a user', async function createUser() {
    const res = await r2.post('http://localhost:8080/users', { 
      headers,
      body: JSON.stringify({
        "data": {
          "type": "users",
          "attributes": {
            "email": "test@example.com"
          }
        }
      })
    }).response;

    const body = await res.json();

    userId = body.data.id;

    expect(res.status).to.equal(201);
    expect(res.ok).to.equal(true);
    expect(body.data.attributes.email).to.equal('test@example.com');
  });

  it('[GET] can get a user', async function getUser() {
    const res = await r2.get(`http://localhost:8080/users/${userId}`, { 
      headers
    }).response;

    const body = await res.json();

    expect(res.status).to.equal(200);
    expect(res.ok).to.equal(true);
    expect(body.data.id).to.equal(userId);
  });

  it('[POST] can create a price to track', async function createPrices() {
    const res = await r2.post('http://localhost:8080/prices', { 
      headers,
      body: JSON.stringify({
        "data": {
          "type": "prices",
          "attributes": {
            "name": "Awesome product!",
            "note": "This thing is cool, buy many of them",
            "savedPrice": 49.99,
            "targetPrice": 39.99,
            "selector": "body p .price",
            "imageSrc": "",
            "url": "http://example.com"
          },
          "relationships": {
            "user": {
              "data": {
                "type": "users",
                "id": `${userId}`
              }
            }
          }
        }
      })
    }).response;

    const body = await res.json();

    priceId = body.data.id;

    expect(res.status).to.equal(201);
    expect(res.ok).to.equal(true);
    expect(body.data.attributes.name).to.equal('Awesome product!');    
    expect(body.data.attributes['saved-price']).to.equal(49.99);    
  });

  it('[GET] can get a price', async function getPrice() {
    const res = await r2.get(`http://localhost:8080/prices/${priceId}`, { 
      headers
    }).response;

    const body = await res.json();

    expect(res.status).to.equal(200);
    expect(res.ok).to.equal(true);
    expect(body.data.id).to.equal(priceId);
  });
});