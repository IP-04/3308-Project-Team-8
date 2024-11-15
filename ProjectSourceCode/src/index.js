// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); // changge it from bcryptjs to bcrypt
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
    obj.done(); // success, release the connection
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
app.use(bodyParser.json());  // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here

// Default
app.get('/', (req, res) => {
  res.redirect('/home');
});

// Home route
app.get('/home', (req, res) => {
  const user = req.session.user;
  var username = "Guest";
  if (user) {username = user.username;}
  
  // Call API to populate book database tables upon loading /home
  axios({
    url: `https://www.googleapis.com/books/v1/volumes`,
    method: 'GET',
    dataType: 'json',
    headers: {
      'Accept-Encoding': 'application/json',
    },
    params: {
      key: process.env.API_KEY,
      q: 'e',
      maxResults: 40 // cannot exceed 40, limitation set by google
    },
  })
    .then(results => {
      // populate database with API data, all book table data except avg_rating comes from API
      var avg_rating_q = `SELECT AVG(rating) 
                          FROM reviews 
                          INNER JOIN reviews_to_books
                            ON reviews.id = review_id
                          INNER JOIN books
                            ON reviews_to_books.book_id = books.id
                          GROUP BY books.id
                          HAVING books.google_volume = ($1)`; // calculates average rating in SQL
      // insert API data into SQL
      var insert_bulk = `INSERT INTO books (title, author, thumbnail_link, avg_rating, description, sample, purchase_link, google_volume) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
      
      const title = []; // define vars outside of loop
      const author = [];
      const thumbnail = [];
      const desc = [];
      const sample = [];
      const purchase = [];
      const google_vol = [];
      const google_books = results.data.items;

      for (let i = 0; i < 40; i++) { // populate data of all 40 returned books from API into const vars
        title[i] = google_books[i].volumeInfo.title;
        if (google_books[i].volumeInfo.authors) {author[i] = google_books[i].volumeInfo.authors[0];}
        if(google_books[i].volumeInfo.imageLinks) {thumbnail[i] = google_books[i].volumeInfo.imageLinks.smallThumbnail;}
        desc[i] = google_books[i].volumeInfo.description;
        sample[i] = google_books[i].volumeInfo.previewLink;
        purchase[i] = google_books[i].volumeInfo.infoLink;
        google_vol[i] = google_books[i].id;
      }
      const featuredBooks = google_books.slice(1,7); // this determines what books are displayed
      const trendingBooks = google_books.slice(7,13);

      /*for(let i = 0; i < 10; i++) { // mix const vars with SQL query to populate database
        db.one(avg_rating_q, [google_vol[i]])
          .then(results => {
            db.any(insert_bulk, [
              title[i],
              author[i],
              thumbnail[i],
              results,
              desc[i],
              sample[i],
              purchase[i],
              google_vol[i],
            ])
              .catch(function (err) {
                //return console.log(err);
            })
          })
          .catch(function (err) { // if an average rating cannot be calculated, populate with it as 0
            db.any(insert_bulk, [
              title[i],
              author[i],
              thumbnail[i],
              0,
              desc[i],
              sample[i],
              purchase[i],
              google_vol[i],
            ])
            .catch(function (err) {
              //return console.log(err);
            })
          })
      }*/

      /*/ populates featuredBooks for home page display (NOT WORKING)
      var featuredBooks = [];
      const featured_q = `SELECT * FROM books`; 
      db.any(featured_q)
        .then(results => {
          featuredBooks = results;
          console.log(results);
        })
        .catch(function (err) {
          return console.log(err);
        })
      console.log(featuredBooks);*/
      
      // render home page
      res.render('pages/home',{
          user: user,
          username: username,
          books: google_books,
          featuredBooks: featuredBooks,
          trendingBooks: trendingBooks,
      });
    })
    .catch(error => {
      console.log(error);
      res.status(404);
      res.render('pages/home',{
        books: []
      });
      // Handle errors
    });
});

// Discover route
app.get('/discover', (req, res) => {
  const user = req.session.user;
  //const username = user ? user.username : 'Guest';
  if (user) {
    username = user.username;
    res.render('pages/discover', {
      username,
      recommendedBooks: [], // Example data (MUST REPLACE)
      newReleases: [],
      trendingBooks: [],
      wishlist: []
    });
  } else {
    res.status(302);
    res.redirect('/login');
  }
  
});

// Profile route
app.get('/profile', (req, res) => {
  if (!req.session.user) return res.redirect('/login');  // Redirect to login if the user is not authenticated

  const user = req.session.user;
  const username = user.username || 'Guest';
  const description = user.description || 'No description available.'; // Provide fallback if description is missing

  // Modified profile data for testing
  res.render('pages/profile', {
    username,
    description,
    reviews: [
      { title: 'Amazing Book!', date: '2024-10-01', reviewText: 'Loved it!' },
      { title: 'Could be better', date: '2024-09-15', reviewText: 'It was okay.' },
    ],
    genres: ['Fiction', 'Science Fiction', 'Fantasy'],
    friends: [
      { name: 'Alice', activity: 'Read "The Great Gatsby"', timeAgo: '2 hours ago' },
      { name: 'Bob', activity: 'Added "1984" to wishlist', timeAgo: '5 hours ago' },
    ],
  });
});

// Login route
//Usedd bcrypt instead of bcryptjs
// it works by hashing the password and comparing it to the hashed password in the database
app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
    if (user && bcrypt.compareSync(password, user.password)) { //`bcrypt.compareSync` compares the password entered by the user with the hashed password in the database
      req.session.user = user;
      req.session.save();
      res.status(302).redirect('/home');
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
  const hashedPassword = bcrypt.hashSync(password, 10); //`bcrypt.hashSync` hashes the password entered by the user
  try {
    await db.none('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(200).redirect('/login');
  } catch (error) {
    res.status(400).send('Invalid input');
  }
});

// Authentication Middleware
const auth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

app.use(auth);

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
module.exports = app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
