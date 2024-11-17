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
app.get('/home', async (req, res) => {
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
      
      const google_books = results.data.items;
      var featuredBooks;
      if (user) {
        // temporary || make based off friends and preferencecs if user logged in
      } else {
        featuredBooks = google_books.slice(1,7); // this determines what books are displayed
      }
      const trendingBooks = google_books.slice(7,13);
      
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
  if (req.session.user) {res.redirect('/');}
  res.render('pages/login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
    if (user && bcrypt.compareSync(password, user.password)) { //`bcrypt.compareSync` compares the password entered by the user with the hashed password in the database
      req.session.user = user;
      req.session.save();

      let is_populated = false;
      const is_populated_query = `SELECT google_volume FROM books WHERE id = 1;`;
      await db.oneOrNone(is_populated_query)
            .then(results => {
              if(results) {is_populated = true;}
            });

      if (!is_populated) {
        const param_q = ['e','a','t','s'];
        const param_maxResults = 40; // cannot exceed 40, limitation set by google
        
        for(var j = 0; j < 4; j++) {
          var loop_q = param_q[j];
          // Call API to populate book database tables upon loading /home
          await axios({
            url: `https://www.googleapis.com/books/v1/volumes`,
            method: 'GET',
            dataType: 'json',
            headers: {
              'Accept-Encoding': 'application/json',
            },
            params: {
              key: process.env.API_KEY,
              q: loop_q,
              maxResults: param_maxResults // cannot exceed 40, limitation set by google
            },
          })
          .then(results => {
            const books = results.data.items;
            for (let i = 0; i < param_maxResults; i++) {
              var title = books[i].volumeInfo.title;
              if (books[i].volumeInfo.authors) {var author = books[i].volumeInfo.authors[0];}
              if(books[i].volumeInfo.imageLinks) {var thumbnail = books[i].volumeInfo.imageLinks.thumbnail;}
              var desc = books[i].volumeInfo.description;
              var sample = books[i].volumeInfo.previewLink;
              var purchase = books[i].volumeInfo.infoLink;
              var google_vol = books[i].id;

              //console.log(google_vol);

              // NO AVG RATING INSERTION (intentional)
              var query = `INSERT INTO books (title, author, thumbnail_link, description, sample, purchase_link, google_volume) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
              db.any(query, [
                title,
                author,
                thumbnail,
                desc,
                sample,
                purchase,
                google_vol,
              ])
              /*.then(results => {
                console.log(results);
              })*/
              .catch(error => {
                console.log(error);
              });
            }
          })
          .catch(err => {
            res.status(500).send('Database failed to populate');
          });
        }
      }

      res.status(302).redirect('/home');
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});



// Register route
app.get('/register', (req, res) => {
  if (req.session.user) {res.redirect('/');}
  res.render('pages/register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10); //`bcrypt.hashSync` hashes the password entered by the user
  try {
    await db.none('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

    const profile_query = `INSERT INTO profiles (username, description) VALUES ($1, $2);`;
    await db.none(profile_query, [username, "Add a Description of Yourself!"])

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

// Book route
app.get('/book', (req, res) => {
  if (book && reviews) {
    res.render('pages/book', { book, reviews});
  } else {
    res.redirect('pages/home');
  }
});

app.get('/book/:id', async (req, res) => {
  const book_google_vol = req.params.id;
  try {
    const book = await db.oneOrNone('SELECT * FROM books WHERE google_volume = $1;', [book_google_vol]);
    const reviews = await db.any('SELECT * FROM reviews LEFT JOIN reviews_to_books ON reviews.id = reviews_to_books.review_id LEFT JOIN reviews_to_profiles ON reviews.id = reviews_to_profiles.review_id LEFT JOIN profiles ON reviews_to_profiles.profile_id = profiles.id WHERE book_id = $1;', [book.id]);
    res.render('pages/book', { book, reviews});
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching book details');
  }
});
// review route
app.get('/book/:id/review', async (req, res) => {
  const bookId = req.params.id;
  
  const user = req.session.user;
  if (!user) {
    res.status(401).send('Please log in to view all reviews');
    return;
  }

  try {
    await db.any('SELECT FROM reviews WHERE google_volume = $1;', [bookId])
    .then(results => {
      res.render(`pages/reviews`,{reviews: results, google_vol: bookId});
    });
  } catch (error) {
    res.status(500).send('Error submitting review');
  }
});

app.post('/book/:id/review', async (req, res) => {
  const bookId = req.params.id;
  const {google_volume, title, description, rating, visibility } = req.body;
  const user = req.session.user;
  if (!user) {
    res.status(401).send('Please log in to submit a review');
    return;
  }

  try {
    await db.none('INSERT INTO reviews (google_volume, title, description, rating, visibility) VALUES ($1, $2, $3, $4, $5)', [bookId, title, description, rating, visibility]);
    await db.any(`SELECT * FROM reviews WHERE google_volume = $1;`, [bookId])
    .then(results => {
      res.render(`pages/reviews`,{
        reviews: results,
        google_vol: google_volume
      });
      //res.redirect(`/book/${bookId}`);
    })
    
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
