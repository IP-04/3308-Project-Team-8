let REVIEW_MODAL;
let REVIEW_FORM;
let REVIEWS = [];
let MAX_REVIEWS;
let REVIEW_COUNT = 0;
let NEW_REVIEW;

/*function checkSession(username) {
    const loginBtn = document.getElementById('loginbtn');
    const logoutBtn = document.getElementById('logoutbtn');
    const registerBtn = document.getElementById('registerbtn');
    const profileBtn = document.getElementById('profilebtn');
    if(username = "Guest") {
        loginBtn.classList.replace('hidden', 'nav-item');
        registerBtn.classList.replace('hidden', 'nav-item');

        logoutBtn.classList.replace('nav-item', 'hidden');
        profileBtn.classList.replace('nav-item', 'hidden');
    } else {
        logoutBtn.classList.replace('hidden', 'nav-item');
        profileBtn.classList.replace('hidden', 'nav-item');

        loginBtn.classList.replace('nav-item', 'hidden');
        registerBtn.classList.replace('nav-item', 'hidden');
    }
    
}*/

// Creates card to fill with review information
function createBootstrapCard(id) {
    // Use `document.createElement()` function to create a `div`
    var card = document.createElement('li');
      // Let's add some bootstrap classes to the div to upgrade its appearance
      // This is the equivalent of <div class="col-sm m-1 bg-white rounded px-1 px-md-2"> in HTML
      (card.className = 'card m-1 bg-light rounded px-1 px-md-2');
    // This the equivalent of <div id="monday"> in HTML
    card.id = 'review_card_' + id;
    return card;
}
// Review data populating in Title
function createReviewTitle(text, rating) {
    const title = document.createElement('div');
    title.className = 'h6 text-start position-relative py-0';
    title.innerHTML = rating + '/5.0 - ' + text;
    return title;
}
// Review data populating rating and username
function createReviewUser(username) {
    const user_link = document.createElement('a');
    user_link.className = 'h8 text-start position-relative py-0';
    user_link.innerHTML = 'Reviewed by: ' + username;
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
    
    REVIEWS = reviews;
    REVIEW_COUNT = reviews.length;
    initializeReviewModal(); // initialize bootstrap modal

    var max_reviews;
    if (reviews == undefined) {
        max_reviews = 0;
    } else if (reviews.length < 6) {
        max_reviews = reviews.length;
    } else {
        max_reviews = 6;
    }
    MAX_REVIEWS = max_reviews;

    updateDOM();
}


function initializeReviewModal() {
    // Create a modal using JS. The id will be `review-modal`:
    // Reference: https://getbootstrap.com/docs/5.3/components/modal/#via-javascript
    REVIEW_MODAL = new bootstrap.Modal(document.getElementById('review-modal'));
}
function openReviewModal() { // when form is opened to leave a review
    REVIEW_FORM = document.getElementById('review-form');
    //REVIEW_FORM.setAttribute("onsubmit", `javascript:updateReviewsFromModal()`);
    REVIEW_MODAL.show();
}
function closeReviewModal() { // when cancel button is clicked
    REVIEW_MODAL.hide();
}

// takes data from form to use in review display -- this is separate from database addition
function updateReviewsFromModal() {

    REVIEW_COUNT++;

    let id = REVIEW_COUNT;
    
    let google_volume = document.getElementById('review_google_vol').value;
    let title = document.getElementById('review_title').value;
    let description = document.getElementById('review_desc').value;
    let rating = document.getElementById('review_rating').value;
    let visibility = document.getElementById('review_visibility').value;
    let username = document.getElementById('review_username').value;
    

    NEW_REVIEW = [{
        id: id,
        username: username,
        google_volume: google_volume,
        title: title,
        description: description,
        rating: rating,
        visibility: visibility,
    }]
    
    REVIEWS[REVIEW_COUNT-1] = NEW_REVIEW;
    console.log(REVIEW_COUNT);
    console.log(REVIEWS);
    //console.log(REVIEWS);
    updateDOM();
    REVIEW_MODAL.hide();
    
    fetch('/addReview', {
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
    console.log(REVIEWS[0]);
    const container = document.getElementById('review-list');
    console.log(container);

    if (MAX_REVIEWS < 6) {MAX_REVIEWS = REVIEW_COUNT}

    if (REVIEWS[0] == undefined) {
        var no_reviews = createReviewTitle('No reviews for this book yet. Be the first to review!');
        container.appendChild(no_reviews);
        return;
    }
    for (let i = 0; i < MAX_REVIEWS; i++) {
        console.log(REVIEWS[i]);
        var current_review = REVIEWS[i];
        if(NEW_REVIEW == current_review) {current_review = current_review[0]} // this removes a weird json parsing artifact from the data
        console.log(current_review);

        var review_card = document.getElementById('review_card_' + current_review.id);
        console.log(review_card);
        if (review_card != null) {
            review_card.remove();
        }

        if(current_review.visibility) {
            var card = createBootstrapCard(current_review.id);

            container.appendChild(card);
            
            var card_title = createReviewTitle(current_review.title, current_review.rating);
            card.appendChild(card_title);

            var card_user = createReviewUser(current_review.username);
            card.appendChild(card_user);

            var card_desc = createReviewDesc(current_review.description);
            card.appendChild(card_desc);

            console.log(card);
        }
    }
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
