let REVIEW_MODAL;
let REVIEW_FORM;
let REVIEWS = [];
let MAX_REVIEWS;
let REVIEW_COUNT = 0;
let NEW_REVIEW;

// Creates card to fill with review information
function createBootstrapCard(id) {
    var card = document.createElement('li');
    card.className = 'card m-1 bg-light rounded px-1 px-md-2';
    card.id = 'review_card_' + id;
    return card;
}
// Review data populating in Title
function createReviewTitle(text, rating) {
    const title = document.createElement('div');
    title.className = 'h6 text-start position-relative py-0';
    if (rating == null) {
        title.innerHTML = text;
        title.id = 'empty-reviews';
    } else {
        title.innerHTML = rating + '/5.0 - ' + text;
    }
    return title;
}
// Review data populating rating and username
function createReviewUser(username) {
    const user_link = document.createElement('a');
    user_link.className = 'h8 text-start position-relative py-0';
    user_link.innerHTML = 'Reviewed by: ' + username + ' - View Profile';
    console.log(username);
    user_link.href = '/profile/'+ username;
    user_link.style = 'text-decoration: none; color: #d19c1d;';
    return user_link;
}
// Review data populating decription
function createReviewDesc(text) {
    const desc = document.createElement('div');
    desc.className = 'h7 text-start position-relative py-1';
    desc.innerHTML = text;
    return desc;
}
// intialize the review-generating system
function initializeReviews(reviews) {
    
    REVIEWS = reviews; // update global variable to current state of database
    REVIEW_COUNT = reviews.length;
    initializeReviewModal(); // initialize bootstrap modal

    var max_reviews;
    if (reviews == undefined) { // logic to determien max_reviews to display
        max_reviews = 0;
    } else if (reviews.length < 6) { // verifies that max_reviews = num of reviews, limit of 6
        max_reviews = reviews.length;
    } else {
        max_reviews = 6;
    }
    MAX_REVIEWS = max_reviews;

    updateDOM();
}

function initializeReviewModal() {
    // sets global variable modal
    REVIEW_MODAL = new bootstrap.Modal(document.getElementById('review-modal'));
}
function openReviewModal() { // display form to leave a review
    REVIEW_FORM = document.getElementById('review-form');
    REVIEW_MODAL.show();
}
function closeReviewModal() { // when cancel button is clicked
    REVIEW_MODAL.hide();
}

// takes data from form to use in review display -- this is separate from database addition
function updateReviewsFromModal() {

    REVIEW_COUNT++;

    let id = REVIEW_COUNT;
    // collect inputs from form
    let google_volume = document.getElementById('review_google_vol').value;
    let title = document.getElementById('review_title').value;
    let description = document.getElementById('review_desc').value;
    let rating = document.getElementById('review_rating').value;
    let visibility = document.getElementById('review_visibility').value;
    let username = document.getElementById('review_username').value;
    

    NEW_REVIEW = [{ // create global new review object
        id: id,
        username: username,
        google_volume: google_volume,
        rev_title: title,
        rev_description: description,
        rating: rating,
        visibility: visibility,
    }]
    
    REVIEWS[REVIEW_COUNT-1] = NEW_REVIEW; // add review to global array
    //console.log(REVIEW_COUNT);
    //console.log(REVIEWS);
    //console.log(REVIEWS);
    updateDOM(); // update webpage display
    REVIEW_MODAL.hide(); // hide the modal
    
    fetch('/addReview', { // send user inputs to populate in the database
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            description: description,
            rating: rating,
            visibility: visibility,
            google_volume: google_volume
        })
    });
}

// update display of reviews
function updateDOM() {
    //console.log(REVIEWS[0]);
    const container = document.getElementById('review-list'); // parent element of listed items
    //console.log(container);

    if (MAX_REVIEWS < 6) {MAX_REVIEWS = REVIEW_COUNT} // if number of reviews is not at maximum of 6

    if (REVIEWS[0] == undefined) { // check if array is empty (no reviews yet)
        var no_reviews = createReviewTitle('No reviews for this book yet. Be the first to review!', null);
        container.appendChild(no_reviews);
        return;
    }
    for (let i = 0; i < MAX_REVIEWS; i++) { //append each review
        const empty_reviews = document.getElementById('empty-reviews'); 
        if (empty_reviews) {empty_reviews.remove()} // remove empty reviews text if present
        //console.log(REVIEWS[i]);
        var current_review = REVIEWS[i];
        if(NEW_REVIEW == current_review) {current_review = current_review[0]} // this removes a weird json parsing artifact from the data
        //console.log(current_review);

        var review_card = document.getElementById('review_card_' + current_review.id);
        //console.log(review_card);
        if (review_card != null) { // if card already exists, remove it
            review_card.remove();
        }

        if(current_review.visibility) { // check if user selected public visibility before appending
            var card = createBootstrapCard(current_review.id);

            container.appendChild(card);
            
            var card_title = createReviewTitle(current_review.rev_title, current_review.rating);
            card.appendChild(card_title);

            var card_user = createReviewUser(current_review.username);
            card.appendChild(card_user);

            var card_desc = createReviewDesc(current_review.rev_description);
            card.appendChild(card_desc);

            //console.log(card);
        }
    }
}

async function hasNotReviewed(username, google_volume) {
    // check if user review exists in database
    await fetch('/hasNotReviewed?username=' + username + '&google_volume=' + google_volume, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        
        //console.log(data);
        const bubble = document.getElementById('alert-bubble'); // display alert bubble for 3s if lready left a review
        const button = document.getElementById('review-button');
        if (data.has_not_reviewed) {
            button.style.display = "grid";
            bubble.style.display = "none";
            openReviewModal();
        } else {
            button.style.display = "none";
            bubble.style.display = "grid";

            setTimeout(() => {
                
                button.style.display = "grid";
                bubble.style.display = "none";
            }, 3000);
        }
    })
    .catch(err => {
        console.log(err);
    });
}

function addFriend(user_id, profile_id, user_username, profile_username) {
    const friend_button_parent = document.getElementById('friend-form');
    const friend_button = document.getElementById('friend-button');
    friend_button.innerHTML = 'Remove '+ profile_username + ' from Friends'; // toggle button text
    friend_button_parent.onsubmit = function (event) { // toggle button onsubmit action
        event.preventDefault(); // Prevent form submission
        removeFriend(user_id, profile_id, user_username, profile_username); 
        return false;
    }
    const friend_list = document.getElementById('friend-list');
    const new_friend = document.createElement('li');
    new_friend.className = 'card friend-card bg-light h-100 text-center py-2';
    new_friend.id = user_id;
    friend_list.appendChild(new_friend); // display new friend
    const new_friend_username = document.createElement('a');
    new_friend_username.className = 'h6';
    new_friend_username.innerHTML = user_username;
    new_friend.appendChild(new_friend_username);

    //add friend to database
    fetch('/addFriend', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: user_id,
            profile_id: profile_id
        })
    });
}

function removeFriend(user_id, profile_id, user_username, profile_username) { // basically the same as addFriend but vice versa
    const friend_button_parent = document.getElementById('friend-form');
    const friend_button = document.getElementById('friend-button');
    friend_button.innerHTML = 'Add ' + profile_username + ' to Friends'; // toggle button text
    friend_button_parent.onsubmit = function (event) { // toggle button onsubmit action
        event.preventDefault(); // Prevent form submission
        addFriend(user_id, profile_id, user_username, profile_username);
        return false;
    }
    const old_friend = document.getElementById(user_id); // remove old friend
    old_friend.remove();
    if (document.querySelector(".friend-card") == null) { // if the friend list is now empty, add display text
        const list = document.getElementById('friend-list');
        list.appendChild('h5');
        list.className('text-center');
        list.innerHTML('No friends yet!')
    }

    // remove friend in databse
    fetch('/removeFriend', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: user_id,
            profile_id: profile_id
        })
    });
}

let PROFILE_MODAL;
function openProfileModal() {
    PROFILE_MODAL = new bootstrap.Modal(document.getElementById('profile-modal')); // define and open modal
    PROFILE_MODAL.show();
}
function closeProfileModal() { // when cancel button is clicked
    PROFILE_MODAL.hide();
}
function updateProfileFromModal() {
    const new_desc = document.getElementById('profile-desc').value;

    const desc_element = document.getElementById('html-desc-div'); // parent element of desc
    const html_desc = document.getElementById('html-desc');
    if (html_desc != null) {html_desc.remove();} // remove old desc

    var new_desc_element = document.createElement('p');
    new_desc_element.innerHTML = new_desc;
    new_desc_element.id = 'html-desc';

    desc_element.appendChild(new_desc_element); // add new desc

    //update description in database
    fetch('/editDesc', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({description: new_desc})
    });
    closeProfileModal(); // hide modal
}

//function to change visibility of the password on click
function togglePasswordVisibility(){
	var x = document.getElementById("password");
	//alternate between hidden and visible
	if(x.type == "password"){
		x.type = "text";
	
	}else{
		x.type = "password";
	}
}

// added function for the search bar
async function fetchSuggestions(query) {
    const suggestionBox = document.getElementById('suggestions');
    suggestionBox.innerHTML = ''; // Clear previous suggestions

    if (query.length < 3) return; // Fetch only if query length >= 3

    try {
        const response = await fetch(`/search-suggestions?query=${encodeURIComponent(query)}`);
        const suggestions = await response.json();

        if (suggestions.length > 0) {
            suggestions.forEach((book) => {
                const suggestion = document.createElement('div');
                suggestion.className = 'suggestion-item text-dark p-2';
                suggestion.innerHTML = `<strong>${book.book_title}</strong> by ${book.author}`;
                suggestion.onclick = () => {
                    window.location.href = `/book/${book.google_volume}`;
                };
                suggestionBox.appendChild(suggestion);
            });
        } else {
            suggestionBox.innerHTML = '<div class="suggestion-item text-dark p-2">No results found</div>';
        }
    } catch (err) {
        console.error('Error fetching suggestions:', err);
    }
}