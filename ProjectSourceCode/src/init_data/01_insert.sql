INSERT INTO users
    (username, password)
VALUES
    ('abc', '$2b$10$/JCQ6Lroly0QsdrkWkETOeANHYrCmluqyjYMzo9GBTMAb8D7nS6F2'),    /*password is: def */
    ('mike', '$2b$10$eYpAXNU3Pvco28ofe0uTA.8HcF2pT1CFxZuphgf.4Ss9pm.m.uUti'),   /*password is: me */
    ('john', '$2b$10$JY3wDBZNBO5AvLG8RT9.H.51tYdXtbMYb9xa9gSYQK8iDa3mRkC62'),   /*password is: jn */
    ('nancy', '$2b$10$SO3fhwGwSnX/Lu1DKC8qW.zHie5C4Pa6KkJ5nAw/JS1bTXsEAWtom'),  /*password is: ny */
    ('paul', '$2b$10$YwUDWxtHoTfZI50bzPyGSOUv7R5gDZusGyAO9GCsNGiGF.o6mi.NK'),   /*password is: pl */
    ('laura', '$2b$10$c3vUAFrv3bUuqx3Et3uGeupKY.F1UYR.cR4zax3PmEXGvgs7vih7a'),  /*password is: la */
    ('jeremy', '$2b$10$wBlYd9QCoxX0Vl6ExlOK..Z3.dx6XV.eNEbcLwBkww0w8KSNpNxES'), /*password is: jy */
    ('roger', '$2b$10$bs7c83rmRE.kgL9UhWWFtePzmwrwawdyVwn3lGVSsyZ4FlxoU5SC6'),  /*password is: rr */
    ('maddi', '$2b$10$mfbXerFiOtnZOVQtkWkMSO3yqtIO/JG8Iiv1OPY7i2yNfefkAZE9i'),  /*password is: mi */
    ('shelby', '$2b$10$Tg1Zcze/lJ/SMDiOIqJ6QuXxhDFum8PTozzoceoM3d4X4oWYBM.R2')  /*password is: sy */
    ;

INSERT INTO profiles
    (username, description)

VALUES
    ('abc', 'Add a Description of Yourself!'),
    ('mike', 'I like hiking and of course, reading books! I have been reading since I was little and have always enjoyed it. My preferred genres are science fiction, fantasy, and post-apocalyptic. If you like my reviews, add me as a frined!'),
    ('john', 'I like reading a lot and will enjoy just about any genre... except romance. I hate romance novels.'),
    ('nancy', 'I have always enjoyed reading and spending time at the library. Send me book recomendations!'),
    ('paul', 'I am new to reading books from BookHive but the experience has been great to me so far! I have connected with many like-minded folks and I am excited to meet even more.'),
    ('laura', 'I dont like reading all that much, but this website is great for sourcing books to give as gifts!'),
    ('jeremy', 'I am a guy who likes to go skiing and mountain biking when I get the chance. I always bring along a good book!'),
    ('roger', 'I have been reading professionally for 20+ years. Nobody can read as good as I can. Im super cool.'),
    ('maddi', 'BookHive is the best!'),
    ('shelby', 'I like road trips and BookHive has given me nearly endless material! Send me any recommendations in the crime genre!')
    ;

INSERT INTO reviews
    (username, google_volume, rev_title, rev_description, rating, visibility)
VALUES 
    ('abc','xD9LEAAAQBAJ', 'This book was enjoyable', 'I think this book should be more widely shared', 4, true),
    ('abc','l-LoEAAAQBAJ', 'Very dry', 'Hard to read and understand', 2.5, true),
    ('abc', '7B6cNaP-iwwC', 'Very funny!', 'This book made me laugh! I recommend it!', 4.1, true),
    ('mike', 'zXYpDwAAQBAJ', 'Made me laugh', 'Kind of boring but has its upsides', 3.5, true),
    ('mike', '7B6cNaP-iwwC', 'Good book!', 'The plot is good throughout with only a few slow spots, highly recommend!', 4.5, true),
    ('mike', 'RvfOtAEACAAJ', 'Boring', 'This book was not a fun read, I wouldnt recommend it', 1, true),
    ('mike', 'HQBGDwAAQBAJ', 'Very interesting!', 'I learned a lot from this book!', 4.3, true),
    ('john', 'tTfRAQAAQBAJ', 'Very interesting topic', 'This topic was very cool to read but I am not well versed enough to unserstand all of it', 3.4, true),
    ('john', 'zXYpDwAAQBAJ', 'it was okay', 'I wouldnt read this again', 2.3, true),
    ('john', 'RvfOtAEACAAJ', 'Not for me but still good', 'my son loved this book!', 4.3, true),
    ('nancy', 'huQ7EAAAQBAJ', 'fun read', 'Youll get a kick out of this one!', 4, true),
    ('nancy', 'Ij3EGQAACAAJ', 'not for me', 'This book is for younger audiences', 1.2, true),
    ('nancy', '0JF0UAw386MC', 'thought provoking', 'This book is very cool, I would read it again, though not anytime soon', 3.8, true),
    ('nancy', 'xD9LEAAAQBAJ', 'weird book', 'this was an interesting read for sure', 3.4, true),
    ('paul', 'OKlkzmwy6uoC', 'Well written', 'This is a very well written book where the author clearly understands how social dynamics work. I recommend.', 4.3, true),
    ('paul', '0JF0UAw386MC', 'Not well structured', 'This books has some interesting information but it is hard to understand due to the books structure.', 2.3, true),
    ('paul', 'gttDCwAAQBAJ', 'I feel stronger!', 'This book helped me uncover my strengths! I recommend!', 4.4, true),
    ('laura', 'umJVEAAAQBAJ', 'Eye opening', 'This is such a cool dive into linguistics, I highly recommend', 4.8, true),
    ('laura', 'uNUhEAAAQBAJ', 'whimsical', 'Fun little book, probably wont read again', 2.3, true),
    ('jeremy', '4tK3BMnGNCsC', 'Very informative', 'I learned a lot from this book and it applies to everyday situations.', 3.9, true),
    ('jeremy', 'huQ7EAAAQBAJ', 'I dont get it', 'This book didnt appeal to me', 2, true),
    ('jeremy', 'OKlkzmwy6uoC', 'Fun to read', 'This book kept me hooked in the entire time', 4.6, true),
    ('roger', 'Mt1eEAAAQBAJ', 'One of the coolest ive read', 'This was a really interesting introspective. I think many would benefit from reading this.', 4.6, true),
    ('roger', 'HQBGDwAAQBAJ', 'cool book but kinda meh', 'this was interesting but there wasnt much plot', 3, true),
    ('roger', 'VSXrDwAAQBAJ', 'it was alright', 'This book has good story but is a little jarring to read', 2.3, true),
    ('maddi', 'uNUhEAAAQBAJ', 'very good!', 'I liked this book a lot!', 5, true),
    ('maddi', 'iUT_AwAAQBAJ', 'hard to read', 'I didnt understand this book very well', 1, true),
    ('maddi', 'Bw2bEAAAQBAJ', 'hard to understand', 'This book was harder to understand than I expected. The parts that were clear were enjoyable.', 3.2, true),
    ('shelby', 'k6QnL6DTyDMC', 'slow but picks up', 'This book starts slow but gets better as the story comes together.', 4, true),
    ('shelby', 'fvPkDwAAQBAJ', 'not for me', 'this book has a little too much drama for my taste', 2, true),
    ('shelby', 'tTfRAQAAQBAJ', 'Lots of good info!', 'This has a lot of good information for those who love horses!', 4.3, true)
    ;


INSERT INTO friends
    (user_id, friend_id)
VALUES
    (1,2),
    (2,1),
    (2,3),
    (3,2),
    (4,5),
    (5,4),
    (4,6),
    (6,4),
    (4,8),
    (8,4),
    (5,8),
    (8,5),
    (5,9),
    (9,5),
    (6,9),
    (9,6),
    (6,1),
    (1,6),
    (6,7),
    (7,6),
    (8,1),
    (1,8),
    (8,9),
    (9,8),
    (8,10),
    (10,8),
    (9,10),
    (10,9),
    (10,5),
    (5,10)
    ;

INSERT INTO users_to_profiles
    (user_id, profile_id)
VALUES
    (1,1),
    (2,2),
    (3,3),
    (4,4),
    (5,5),
    (6,6),
    (7,7),
    (8,8),
    (9,9),
    (10,10)
    ;

INSERT INTO reviews_to_books
    (review_id, book_id)
VALUES
    (1,113),
    (2,10),
    (3,116),
    (4,96),
    (5,116),
    (6,121),
    (7,128),
    (8,17),
    (9,96),
    (10,121),
    (11,126),
    (12,107),
    (13,156),
    (14,114),
    (15,106),
    (16,156),
    (17,1),
    (18, 46),
    (19, 104),
    (20, 42),
    (21, 126),
    (22, 106),
    (23, 124),
    (24, 128),
    (25, 93),
    (26, 104),
    (27, 52),
    (28, 20),
    (29, 113),
    (30, 95),
    (31, 17)
    ;

INSERT INTO reviews_to_profiles
    (review_id, profile_id)
VALUES
    (1,1),
    (2,1),
    (3,1),
    (4,2),
    (5,2),
    (6,2),
    (7,2),
    (8,3),
    (9,3),
    (10,3),
    (11,4),
    (12,4),
    (13,4),
    (14,4),
    (15,5),
    (16,5),
    (17,5),
    (18,6),
    (19,6),
    (20,7),
    (21,7),
    (22,7),
    (23,8),
    (24,8),
    (25,8),
    (26,9),
    (27,9),
    (28,9),
    (29,10),
    (30,10),
    (31,10)
    ;