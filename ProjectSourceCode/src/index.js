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
  host: 'db', // the database server toggle between 'db' and 'dpg-csvplfhu0jms738b8sbg-a' for local or cloud hosting
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

const Handlebars = require('handlebars');
const { profile } = require('console');

// Register a custom helper to serialize data to JSON
Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});


// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here

// Default
app.get('/', (req, res) => {
  res.redirect('/home');
});

// Home  get route
app.get('/home', async (req, res) => {
  const user = req.session.user;
  var username = "Guest";
  if (user) {username = user.username;}


  const top_reviews = await db.any('SELECT * FROM reviews INNER JOIN reviews_to_books ON reviews.id = review_id INNER JOIN books ON reviews_to_books.google_volume = books.google_volume WHERE rating > 3.0 GROUP BY books.id, reviews.id, reviews_to_books.review_id, reviews_to_books.google_volume, books.google_volume ORDER BY rating DESC LIMIT 15;');


  let is_populated = false; // is books database already populated
  const is_populated_query = `SELECT google_volume FROM books WHERE id = 1;`;
  await db.oneOrNone(is_populated_query)
    .then(results => {
      if(results) {is_populated = true;}
    });
  
    if (is_populated) { // if db is populated
      const google_books = await db.any('SELECT * FROM books;');

      var randomOffset = Math.floor(Math.random() * 154);
      var randomBooks = google_books.slice(randomOffset, randomOffset + 6);

      var trendingBooks = await db.any('SELECT * FROM books ORDER BY avg_rating DESC;');
      var featuredBooks = [];
      if (user) {
        book_google_vol = await db.any('SELECT google_volume FROM reviews INNER JOIN reviews_to_profiles ON reviews.id = reviews_to_profiles.review_id INNER JOIN friends ON friends.user_id = reviews_to_profiles.profile_id WHERE friend_id = $1 ORDER BY rating DESC LIMIT 6;',[user.id]);
        await book_google_vol.forEach(async item => {
          google_volume = item.google_volume;
          var current_book = await db.one('SELECT * FROM books WHERE google_volume = $1;',[google_volume]);
          if (featuredBooks.length < 6) {featuredBooks.push(current_book);}
        })
        
        if (featuredBooks.length < 6) {
          for (let i = 0; i < 6; i++) {
            if (i >= featuredBooks.length) {
              featuredBooks[i] = trendingBooks[i+6];
            }
          }
        } else {
          featuredBooks = await db.any('SELECT * FROM books WHERE google_volume = $1;',[book_google_vol]);
        }
      } else {
        featuredBooks = google_books.slice(7,13); // this determines what books are displayed
      }
      var trendingBooks = trendingBooks.slice(1,7);
      
      
      // render home page
      res.render('pages/home',{ // render home page while passing data
          user: user,
          username: username,
          reviews: top_reviews,
          books: google_books,
          randomBooks: randomBooks,
          featuredBooks: featuredBooks,
          trendingBooks: trendingBooks,
      });

    } else { // if db isn't populated
      // Call API to populate books display upon loading /home
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
      .then(results => { // process data from API
        
        const result_books = results.data.items;
        
        var google_books = [];
        var result_info = [];
        var image_info = [];
        for (i = 0; i < 40; i++) {
          result_info[i] = result_books[i].volumeInfo;
          image_info[i] = result_info[i].imageLinks;

          google_books[i] = {
            google_volum: result_books[i].id,
            thumbnail_link : image_info[i].smallThumbnail,
            title : result_info[i].title
          }
        }

        //console.log(google_books);
        var randomOffset = Math.floor(Math.random() * 34);
        var randomBooks = google_books.slice(randomOffset, randomOffset + 6);

        const featuredBooks = google_books.slice(1,7); // this determines what books are displayed
        const trendingBooks = google_books.slice(7,13);
        
        // render home page
        res.render('pages/home',{ // render home page while passing data
            user: user,
            username: username,
            reviews: top_reviews,
            books: google_books,
            randomBooks: randomBooks,
            featuredBooks: featuredBooks,
            trendingBooks: trendingBooks,
        });
      })
      .catch(error => {
        console.log(error);
        res.status(404);
        // Handle errors
      });
    }
});

// Discover route
app.get('/discover', async (req, res) => {
  const user = req.session.user;
  const username = user ? user.username : 'Guest';// we dont have guest, right ?   
  if (user) {
    try {
      // Query for the most recent books, ordered by publish_date
      const newReleases = await db.any(
        'SELECT id, book_title, author, thumbnail_link, publish_date, google_volume FROM books ORDER BY publish_date DESC LIMIT 6'
      );
      newReleases.forEach((book) => {
        const publishDate = new Date(book.publish_date);
        
        // Format date as "Oct 26 2023"
        const formattedDate = publishDate.toLocaleDateString('en-US', {
          month: 'short',  // "Oct"
          day: 'numeric',  // "26"
          year: 'numeric', // "2023"
        });

        book.publish_date = formattedDate;
      }); 

      const discoverUsers = await db.any(
        'SELECT username, id FROM profiles WHERE username != $1 ORDER BY RANDOM() LIMIT 6;',
        [username]  
      );

      const friends = await db.any(
        'SELECT * FROM friends INNER JOIN profiles ON profiles.id = friends.friend_id WHERE friends.user_id = $1 GROUP BY profiles.username, profiles.id, friends.user_id, friends.friend_id LIMIT 3;',
        [user.id]
      );

      let recommendedBooks = [];

     for (const friend of friends) {
      const friendUsername = friend.username;
      
      const recentlyRead = await db.any(
        'SELECT books.id, books.book_title, books.author, books.thumbnail_link, books.publish_date, books.google_volume ' +
        'FROM books ' +
        'INNER JOIN reviews_to_books ON books.google_volume = reviews_to_books.google_volume ' +
        'INNER JOIN reviews ON reviews_to_books.review_id = reviews.id ' +
        'WHERE reviews.username = $1 ' +
        'ORDER BY RANDOM() LIMIT 2;',
        [friendUsername]
      );
      
      recommendedBooks = recommendedBooks.concat(recentlyRead);
    }

      const wishlistBooks = await db.any(
          'SELECT books.* FROM books ' +
          'INNER JOIN wishlist ON books.google_volume = wishlist.google_volume ' +
          'WHERE wishlist.user_id = $1',
          [user.id]
      );
      res.render('pages/discover', {
        user: user,
        username: username,
        newReleases: newReleases, 
        discoverUsers: discoverUsers,
        recommendedBooks: recommendedBooks, 
        wishlist: wishlistBooks
      });


    } catch (error) {
      // Handle errors during the database query
      console.log(error);
      res.status(500).send('Error fetching new releases');
    }
  } else {
    res.status(302);
    res.redirect('/login');
  }  

});

//add to wishlist (future reads section discover page)
app.post('/addWishlist', async (req, res) => {
  const user = req.session.user;

  if (user) {
      try {
          const { google_volume } = req.body;
          await db.none(
              'INSERT INTO wishlist (user_id, google_volume) VALUES ($1, $2)ON CONFLICT (user_id, google_volume) DO NOTHING',
              [user.id, google_volume]
          );
          res.redirect('/discover');
      } catch (error) {
          console.log(error);
          res.status(500).send('Error adding book to wishlist');
      }
  } else {
      res.status(302);
      res.redirect('/login');
  }
});

// Remove from wishlist
app.post('/removeWishlist', async (req, res) => {
  const user = req.session.user;

  if (user) {
    try {
      const { google_volume } = req.body;

      await db.none(
        'DELETE FROM wishlist WHERE user_id = $1 AND google_volume = $2',
        [user.id, google_volume]
      );

      res.redirect('/discover');
    } catch (error) {
      console.log(error);
      res.status(500).send('Error removing book from wishlist');
    }
  } else {
    res.status(302);
    res.redirect('/login');
  }
});



// Profile route (w/ determine user page)
let USER_PROFILE = null;
app.get('/profile', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');  // Redirect to login if the user is not authenticated

  const logged_in_user = req.session.user;  // differentiate between logged in user and profile user (in case of viewing other profile)
  let profile;
  if (USER_PROFILE) { // this constant variable sets user to someone else if calling their profile page
    profile = USER_PROFILE;
  } else {
    profile = await db.one('SELECT * FROM profiles WHERE username = $1;',[logged_in_user.username]);
  }
  // generate data to pass to render 
  const username = profile.username;
  var description = profile.description;
  const profile_id = profile.id;
  const user_id = logged_in_user.id;
  // collect up to 15 reviews in rating DESC order
  const reviews = await db.any('SELECT * FROM reviews INNER JOIN reviews_to_books ON reviews.id = review_id INNER JOIN books ON reviews_to_books.google_volume = books.google_volume WHERE username = $1 GROUP BY books.id, reviews.id, reviews_to_books.review_id, reviews_to_books.google_volume, books.google_volume ORDER BY rating DESC LIMIT 15;', [username]);
  // collect up to 10 friends
  const friends = await db.any('SELECT * FROM friends INNER JOIN profiles ON profiles.id = friends.friend_id WHERE friends.user_id = $1 GROUP BY profiles.username, profiles.id, friends.user_id, friends.friend_id LIMIT 10;',[profile.id]);
  // select up to 4 books from particular user where avg_rating > 3.0
  const liked_books = await db.any('SELECT * FROM books INNER JOIN reviews_to_books ON books.google_volume = reviews_to_books.google_volume INNER JOIN reviews ON reviews_to_books.review_id = reviews.id WHERE reviews.username = $1 AND books.avg_rating > 3.0 LIMIT 4;', [username]);
  // select books from particular user in id DESC order (recent to oldest)
  const recently_read = await db.any('SELECT * FROM books INNER JOIN reviews_to_books ON books.google_volume = reviews_to_books.google_volume INNER JOIN reviews ON reviews_to_books.review_id = reviews.id WHERE reviews.username = $1 GROUP BY books.id, reviews.id, reviews_to_books.review_id, reviews_to_books.google_volume, books.google_volume ORDER BY reviews.id DESC LIMIT 4;', [username])
  const is_my_profile = (username == logged_in_user.username); // parameter passed for html display options
  var is_friend = false;
  friends.forEach(friend => { // determines is the logged in user is on the profile's friend list
    if (!is_friend) { // only check when is_friend is false
      if (friend.username == logged_in_user.username) {is_friend = true;} else {is_friend = is_my_profile;}
    }
  });


  //console.log({username, description, reviews, friends, liked_books});
  
  USER_PROFILE = null;
  res.render('pages/profile', {
    profile_id,
    user_id,
    username,
    logged_in_username: logged_in_user.username,
    description,
    liked_books,
    recently_read,
    reviews,
    friends,
    is_my_profile,
    is_friend
  });
});

//profile route (otheruser)
app.get('/profile/:username', async (req, res) => {
  const logged_in_user = req.session.user;
  const username = req.params.username;
  const profile = await db.one('SELECT * FROM profiles WHERE username = $1', [username]); // retrieve relant profile info from database
  // update default description if viewing a different user's profile
  if (profile.description == 'Add a Description of Yourself!' && username != logged_in_user.username) {profile.description = 'This user is too reclusive to add a description!'}
  USER_PROFILE = profile;
  res.redirect('/profile'); // call regular profile path with updated info
});

// edit profile description
app.put('/editDesc', async (req, res) => { // when a user edits their profile description, update database
  const description = req.body.description;
  const user = req.session.user;
  await db.none('UPDATE profiles SET description = $1 WHERE profiles.username = $2', [description, user.username]);
  res.redirect(303, '/profile'); // 303 here allows a redirect from PUT to GET
});

// add friend route
app.post('/addFriend', async (req, res) => { // add friend to database
  const user_id = req.body.user_id;
  const friend_id = req.body.profile_id;
  await db.none('INSERT INTO friends (user_id, friend_id) VALUES ($1, $2),($2, $1);',[user_id, friend_id]);
  res.status(200);
});

// remove friend route
app.post('/removeFriend', async (req, res) => { // remove friend from database
  const user_id = req.body.user_id;
  const friend_id = req.body.profile_id;
  const query = 'DELETE FROM friends WHERE user_id = $1 AND friend_id = $2;';
  await db.none(query,[user_id, friend_id]);
  await db.none(query,[friend_id, user_id]); // deletes both instances from the friends table
  res.status(200);
});

// Login route
//Used bcrypt instead of bcryptjs
// it works by hashing the password and comparing it to the hashed password in the database
app.get('/login', (req, res) => {
  if (req.session.user) {res.redirect('/');} // check if user is already logged in
  res.render('pages/login');
});

// login route helper - db init data insertion verification
async function booksRelationInsertion() {
  
  const reviews = await db.any('SELECT * FROM reviews;');
  reviews.forEach(async review => {
    console.log(review);
    const curr_review = await db.oneOrNone('SELECT * FROM books WHERE google_volume = $1;', [review.google_volume]);
    if (!curr_review) { // If a book with this google_volume doesn't exist, change the book the review is for
      const new_review = await db.one('SELECT google_volume FROM books WHERE id = $1;',[Math.floor(Math.random() * 159) + 1]); // prevent looking for id 0
      // update db tables accordingly
      await db.none('UPDATE reviews SET google_volume = $1 WHERE google_volume = $2;',[new_review.google_volume, review.google_volume]);
      await db.none('UPDATE reviews_to_books SET google_volume = $1 WHERE google_volume = $2;', [new_review.google_volume, review.google_volume]);
      
      await db.none('UPDATE books SET avg_rating = (SELECT AVG(rating) FROM reviews WHERE google_volume = $1) WHERE google_volume = $1;',[new_review.google_volume]);
      
    }
  });
}

// login submission route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]); // fetch user details from database
    if (user && bcrypt.compareSync(password, user.password)) { //`bcrypt.compareSync` compares the password entered by the user with the hashed password in the database
      req.session.user = user;
      req.session.save();

      let is_populated = false; // is books database already populated
      const is_populated_query = `SELECT google_volume FROM books WHERE id = 1;`;
      await db.oneOrNone(is_populated_query)
            .then(results => {
              if(results) {is_populated = true;}
            });

      if (!is_populated) { // if the database isn't already populated, populate it
        const param_q = ['e','a','t','s'];
        const param_maxResults = 40; // cannot exceed 40, limitation set by google
        
        for(var j = 0; j < 4; j++) { // loop 4 different api calls with different search queries (this upgrades imported books from 40 to 160)
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
          .then(results => { // save results as variables for clarity
            const books = results.data.items;
            for (let i = 0; i < param_maxResults; i++) {
              var title = books[i].volumeInfo.title;
              if (books[i].volumeInfo.authors) {var author = books[i].volumeInfo.authors[0];}
              if(books[i].volumeInfo.imageLinks) {var thumbnail = books[i].volumeInfo.imageLinks.thumbnail;}
              var desc = books[i].volumeInfo.description;
              var sample = books[i].volumeInfo.previewLink;
              var purchase = books[i].saleInfo.buyLink;
              var google_vol = books[i].id;
              var publish_date = books[i].volumeInfo.publishedDate;


              //console.log(google_vol);

              // NO AVG RATING INSERTION (intentional)
              var query = `INSERT INTO books (book_title, author, thumbnail_link, avg_rating, description, sample, purchase_link, google_volume, publish_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, convert_partial_date($9)) RETURNING *;`;
              db.any(query, [
                title,
                author,
                thumbnail,
                0,
                desc,
                sample,
                purchase,
                google_vol,
                publish_date
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
        await booksRelationInsertion(); // calls helper function to propogate db values dependent on the newly inserted books data
      }

      res.status(302).redirect('/home'); // redirecet to home after populating database
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
  if (req.session.user) {res.redirect('/');} // check if user is already logged in
  res.render('pages/register');
});

// register submission route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10); //`bcrypt.hashSync` hashes the password entered by the user
  try {
    // insert new user into database
    var user_id = await db.one('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id;', [username, hashedPassword]);
    // create a profile entry for user
    const profile_query = `INSERT INTO profiles (username, description) VALUES ($1, $2) RETURNING id;`;
    var profile_id = await db.one(profile_query, [username, "Add a Description of Yourself!"]);
    // link user table to profile table
    await db.none('INSERT INTO users_to_profiles (user_id, profile_id) VALUES ($1, $2);', [user_id.id, profile_id.id]);

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

// Backup Book route
app.get('/book', (req, res) => {
  if (book && reviews && username && user) {
    res.render('pages/book', { book, reviews, username, user}); 
  } else {
    res.redirect('pages/home'); // redirects invalid path to home
  }
});

// fetch book details route
app.get('/book/:id', async (req, res) => {
  const book_google_vol = `${req.params.id}`; // funky but it works
  const user = req.session.user;
  const username = user.username;
  try {
    const book = await db.one('SELECT * FROM books WHERE google_volume = $1;', [book_google_vol]);
    var reviews = await db.any('SELECT * FROM reviews WHERE google_volume = $1;', [book_google_vol]);
   
    res.render('pages/book', {book, reviews, username, user}); // render page with books details and reviews
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching book details');
  }
});


// new review submission path
app.post('/addReview', async (req, res) => {
  const {title, description, rating, visibility, google_volume} = req.body;
  const user = req.session.user;
  if (!user) {
    res.status(401).send('Please log in to submit a review'); // user auth
    return;
  }

  try {
    // populate review data and fetch review id
    var review_id = await db.one('INSERT INTO reviews (username, google_volume, rev_title, rev_description, rating, visibility) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;', [user.username, google_volume, title, description, rating, visibility]);
    
    // link review, book, and profile in respective tables
    await db.none('INSERT INTO reviews_to_books (review_id, google_volume) VALUES ($1, $2);', [review_id.id, google_volume]);
    await db.none('INSERT INTO reviews_to_profiles (review_id, profile_id) VALUES ($1, $2);',[review_id.id, user.id]);
    await db.none('UPDATE books SET avg_rating = (SELECT AVG(rating) FROM reviews WHERE google_volume = $1) WHERE google_volume = $1;', [google_volume])
    res.status(200);
    
  } catch (error) {
    res.status(500).send('Error submitting review');
  }
});

// route to check if user has already reviewed
app.get('/hasNotReviewed', async (req, res) => {
  try {
    const username = req.query.username;
    const google_volume = req.query.google_volume;
    const review = await db.oneOrNone('SELECT * FROM reviews WHERE username = $1 AND google_volume = $2;',[username, google_volume]);
    const has_not_reviewed = !review;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ has_not_reviewed });

  } catch (error){
    console.log(error);
    res.status(500);
  }
  
});

// view all reviews for one book route
app.get('/reviews/:id', async (req, res) => {
  const book_google_vol = `${req.params.id}`;
  const user = req.session.user;

  if (!user) {
    res.status(401).send('Please log in to view all reviews'); // user auth
    return;
  }

  var reviews = await db.any('SELECT * FROM reviews WHERE google_volume = $1', [book_google_vol]);

  res.render('pages/reviews', {user, reviews}); 
});


// search for books
// Updated Search Route
app.get('/search', async (req, res) => {
  const search_terms = req.query.search_terms; // Capture search input
  const user = req.session.user;

  if (!user) {
      return res.status(401).send('Please log in to search'); // Ensure the user is logged in
  }

  try {
      // Search for books in the database 
      const searchResults = await db.any(
          `SELECT * FROM books WHERE LOWER(book_title) LIKE LOWER($1)`,
          [`%${search_terms}%`] //case-insensitive match
      );

      res.render('pages/search', {
          books: searchResults,
          user,
          search_terms,
      });
  } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).send('Error fetching search results');
  }
});

// Suggestion Endpoint for Search Bar Autocomplete
app.get('/search-suggestions', async (req, res) => {
  const query = req.query.query; // User's input

  if (!query || query.length < 1) {
      return res.json([]); // Return empty if input is too short
  }

  try {
      const suggestions = await db.any(
          `SELECT book_title, author, google_volume FROM books WHERE LOWER(book_title) LIKE LOWER($1) LIMIT 5`,
          [`%${query}%`]
      );

      res.json(suggestions); // Send matching books to the frontend
  } catch (error) {
      console.error('Error fetching suggestions:', error);
      res.status(500).send('Error fetching suggestions');
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

app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Assumes you use session for authentication
  next();
});