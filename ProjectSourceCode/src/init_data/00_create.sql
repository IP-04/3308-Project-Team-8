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
	book_title VARCHAR(1000),
	author VARCHAR(200),
	thumbnail_link VARCHAR(200),
	avg_rating FLOAT,
	description VARCHAR(5000),
	sample VARCHAR(5000),
	purchase_link VARCHAR(200),
	google_volume VARCHAR(12) NOT NULL UNIQUE,
	publish_date DATE 			/*Added a publish date*/
);

/*some books only show the year or the year and month and for those weve made a default 01-01 addition to the column
this is used in the index.js function when parsin in the published date*/
CREATE OR REPLACE FUNCTION convert_partial_date(text)
RETURNS DATE AS $$
BEGIN
    IF $1 ~ '^\d{4}$' THEN
        RETURN ($1 || '-01-01')::DATE;
    ELSIF $1 ~ '^\d{4}-\d{2}$' THEN
        RETURN ($1 || '-01')::DATE;		
    ELSE
        RETURN $1::DATE;
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Invalid date format. Use YYYY or YYYY-MM-DD';
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS reviews (
	id SERIAL PRIMARY KEY,
	username VARCHAR(50),
	google_volume VARCHAR(12) NOT NULL,
	rev_title VARCHAR(30),
	rev_description VARCHAR(250),
	rating FLOAT,
	visibility BOOLEAN
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