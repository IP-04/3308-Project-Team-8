/* run this after populating cloud/local db, otherwise avg_rating won't be calculated*/

/*
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'xD9LEAAAQBAJ') WHERE google_volume = 'xD9LEAAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'l-LoEAAAQBAJ') WHERE google_volume = 'l-LoEAAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = '7B6cNaP-iwwC') WHERE google_volume = '7B6cNaP-iwwC';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'zXYpDwAAQBAJ') WHERE google_volume = 'zXYpDwAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'RvfOtAEACAAJ') WHERE google_volume = 'RvfOtAEACAAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'HQBGDwAAQBAJ') WHERE google_volume = 'HQBGDwAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'tTfRAQAAQBAJ') WHERE google_volume = 'tTfRAQAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'huQ7EAAAQBAJ') WHERE google_volume = 'huQ7EAAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'Ij3EGQAACAAJ') WHERE google_volume = 'Ij3EGQAACAAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = '0JF0UAw386MC') WHERE google_volume = '0JF0UAw386MC';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'OKlkzmwy6uoC') WHERE google_volume = 'OKlkzmwy6uoC';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'gttDCwAAQBAJ') WHERE google_volume = 'gttDCwAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'umJVEAAAQBAJ') WHERE google_volume = 'umJVEAAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'uNUhEAAAQBAJ') WHERE google_volume = 'uNUhEAAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = '4tK3BMnGNCsC') WHERE google_volume = '4tK3BMnGNCsC';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'Mt1eEAAAQBAJ') WHERE google_volume = 'Mt1eEAAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'VSXrDwAAQBAJ') WHERE google_volume = 'VSXrDwAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'iUT_AwAAQBAJ') WHERE google_volume = 'iUT_AwAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'Bw2bEAAAQBAJ') WHERE google_volume = 'Bw2bEAAAQBAJ';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'k6QnL6DTyDMC') WHERE google_volume = 'k6QnL6DTyDMC';
UPDATE books SET avg_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE google_volume = 'fvPkDwAAQBAJ') WHERE google_volume = 'fvPkDwAAQBAJ';
*/