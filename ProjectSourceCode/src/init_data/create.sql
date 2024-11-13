CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(50),
	password CHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
	id SERIAL PRIMARY KEY,
	username VARCHAR(50),
	description VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS books (
	id SERIAL PRIMARY KEY,
	title VARCHAR(60),
	author VARCHAR(50),
	avg_rating SMALLINT,
	description VARCHAR(500),
	sample VARCHAR(5000),
	purchase_link VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS reviews (
	id SERIAL PRIMARY KEY,
	title VARCHAR(30),
	description VARCHAR(250),
	rating SMALLINT,
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

CREATE TABLE IF NOT EXISTS reviews_to_profiles (
	review_id SMALLINT,
	profile_id SMALLINT
);