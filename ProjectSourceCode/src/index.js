// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

app.use(express.static(__dirname + '/'));

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here

// default
app.get('/', (req, res) => {
  res.redirect('/home');
});

// Home route
app.get('/home', (req, res) => {
  const user = req.session.user;
  const username = " ";
  if (user) {username = user.username;}
  res.render('pages/home', {
    username: username,
    featuredBooks: [], // Example data (MUST REPLACE)
    topReviews: [],
  });
});

// Discover route
app.get('/discover', (req,res) => {
  const user = req.session.user;
  const username = " ";
  if (user) {username = user.username;}
  res.render('pages/discover', {
    username: username,
    recommendedBooks: [], // Example data (MUST REPLACE)
    newReleases: [],
    trendingBooks: [],
    wishlist : [],
  });
});

// Profile route
app.get('/profile', (req, res) => {
  const user = req.session.user;
  const username = " ";
  if (user) {username = user.username;}
  res.render('pages/profile', {
    username: username,
    description: req.session.user.description,
  });
});

// Login route
app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      req.session.save();
      res.status(302);
      res.redirect('/home');
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// Register route
app.get('/register', (req, res) => {
  res.render('pages/register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    await db.none('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(200).send('Success');
    res.redirect('/login');
  } catch (error) {
    res.status(400).send('Invalid input');
  }
});

// Review route
app.get('/book/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await db.oneOrNone('SELECT * FROM books WHERE id = $1', [bookId]);
    const reviews = await db.any('SELECT * FROM reviews WHERE book_id = $1', [bookId]);
    res.render('pages/review', { book, reviews });
  } catch (error) {
    res.status(500).send('Error fetching book details');
  }
});

app.post('/book/:id/review', async (req, res) => {
  const bookId = req.params.id;
  const { rating, reviewText } = req.body;
  const userId = req.session.user ? req.session.user.id : null;
  if (!userId) {
    res.status(401).send('Please log in to submit a review');
    return;
  }

  try {
    await db.none('INSERT INTO reviews (book_id, user_id, rating, reviewText) VALUES ($1, $2, $3, $4)', [bookId, userId, rating, reviewText]);
    res.redirect(`/book/${bookId}`);
  } catch (error) {
    res.status(500).send('Error submitting review');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});



// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
