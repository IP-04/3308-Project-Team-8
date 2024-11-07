// ********************** Initialize server **********************************

const server = require('../src/index.js'); 

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

// Positive Test Case
chai.use(chaiHttp);

describe('Testing Register API', () => {
  it('Positive: /register - Successfully registers a user', done => {
    chai
      .request(server)
      .post('/register') // Adjust the endpoint if your register route has a different name
      .send({ username: 'testuser', password: 'password123' }) // Sample input
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Success'); // Ensure your API sends this message on success
        done();
      });
  });
});

// Negative Test Case
it('Negative: /register - Invalid input should return error', done => {
  chai
    .request(server)
    .post('/register')
    .send({ username: '', password: 'short' }) // Invalid input for testing
    .end((err, res) => {
      expect(res).to.have.status(400); // Expecting a 400 status code for invalid input
      expect(res.body.message).to.equals('Invalid input'); // Ensure your API sends this message on failure
      done();
    });
});

// test redirect
describe('Testing Redirect', () => {
  // Sample test case given to test /test endpoint.
  it('default route should redirect to /home with 302 HTTP status code', done => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(302); // Expecting a redirect status code
        res.should.redirectTo('http://localhost:3000/home'); // Expecting a redirect to /home 
        done();
      });
  });
});

// test home page render
describe('Testing Render', () => {
  // Sample test case given to test /test endpoint.
  it('test "/home" route should render with an html response', done => {
    chai
      .request(server)
      .get('/home') // for reference, see lab 8's login route (/login) which renders home.hbs
      .end((err, res) => {
        res.should.have.status(200); // Expecting a success status code
        res.should.be.html; // Expecting a HTML response
        done();
      });
  });
});
// ********************************************************************************