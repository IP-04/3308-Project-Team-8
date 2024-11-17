CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(50) UNIQUE,
	password CHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
	id SERIAL PRIMARY KEY,
	username VARCHAR(50),
	description VARCHAR(500)
);

DROP TABLE IF EXISTS books;
CREATE TABLE IF NOT EXISTS books (
	id SERIAL PRIMARY KEY,
	title VARCHAR(1000),
	author VARCHAR(200),
	thumbnail_link VARCHAR(200),
	avg_rating FLOAT,
	description VARCHAR(5000),
	sample VARCHAR(5000),
	purchase_link VARCHAR(200),
	google_volume VARCHAR(12) NOT NULL UNIQUE 
); 

CREATE TABLE IF NOT EXISTS reviews (
	id SERIAL PRIMARY KEY,
	google_volume VARCHAR(12) NOT NULL,
	title VARCHAR(30),
	description VARCHAR(250),
	rating FLOAT,
	visibility BOOL
);

CREATE TABLE IF NOT EXISTS friends (
	user_id SMALLINT,
	friend_id SMALLINT
);

CREATE TABLE IF NOT EXISTS users_to_profiles (
	user_id SMALLINT,
	profile_id SMALLINT
);

CREATE TABLE IF NOT EXISTS reviews_to_books (
	review_id SMALLINT,
	book_id SMALLINT
);

CREATE TABLE IF NOT EXISTS profiles_to_books (
	profile_id SMALLINT,
	book_id SMALLINT
);

CREATE TABLE IF NOT EXISTS reviews_to_profiles (
	review_id SMALLINT,
	profile_id SMALLINT
);