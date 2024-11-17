let REVIEW_MODAL;
let REVIEW_FORM;
let REVIEWS;
let MAX_REVIEWS;

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

function createBootstrapCard(id) {
    // Use `document.createElement()` function to create a `div`
    var card = document.createElement('li');
      // Let's add some bootstrap classes to the div to upgrade its appearance
      // This is the equivalent of <div class="col-sm m-1 bg-white rounded px-1 px-md-2"> in HTML
      (card.className = 'm-1 bg-light rounded px-1 px-md-2');
    // This the equivalent of <div id="monday"> in HTML
    card.id = id;
    return card;
}
function createReviewTitle(text) {
    const title = document.createElement('div');
    title.className = 'h6 text-start position-relative py-2';
    title.innerHTML = text;
    return title;
}
function createReviewRating(username, rating) {
    const info = document.createElement('div');
    info.className = 'h7 text-start position-relative py-2';
    info.innerHTML = username + ' - Rating: ' + rating + '/5.0';
    return info;
}
function createReviewDesc(text) {
    const desc = document.createElement('div');
    desc.className = 'p text-start position-relative py-2';
    desc.innerHTML = text;
    return desc;
}

function initializeReviews(reviews) {

    REVIEWS = reviews;
    initializeReviewModal();

    var max_reviews;
    if (reviews) {
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
    // Create a modal using JS. The id will be `event-modal`:
    // Reference: https://getbootstrap.com/docs/5.3/components/modal/#via-javascript
    REVIEW_MODAL = new bootstrap.Modal(document.getElementById('review-modal'));
}
function openReviewModal() {
    const form = document.getElementById('review-form');
    form.setAttribute("onsubmit", `javascript:updateReviewsFromModal()`);
    REVIEW_MODAL.show();
}

function setFormVar() {
    REVIEW_FORM = document.getElementById('review-form');
    console.log(REVIEW_FORM);
    //var current_reviews = document.body.reviews;
    REVIEW_FORM.addEventListener('submit', (event) => {
        console.log(event);
        updateReviewsFromModal();
    })
}

function updateReviewsFromModal() {

    MAX_REVIEWS++;

    let id = MAX_REVIEWS;
    let google_volume = document.getElementById('review_google_volume').value;
    let title = document.getElementById('review_title').value;
    let description = document.getElementById('review_desc').value;
    let rating = document.getElementById('review_rating').value;
    let visibility = document.getElementById('visibility').value;

    new_review = [{
        id: id,
        google_volume: google_volume,
        title: title,
        description: description,
        rating: rating,
        visibility: visibility,
    }]

    REVIEWS[MAX_REVIEWS-1] = new_review;
    updateDOM(REVIEWS, MAX_REVIEWS);
    REVIEW_MODAL.hide();
    fetch(`http://localhost:3000/book/${{google_volume}}/review`, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: {
            title: new_review.title,
            description: new_review.description,
            rating: new_review.rating,
            visibility: new_review.visibility
        }
    });
}


function updateDOM() {

    const container = document.getElementById('review-list');
    for (let i = 0; i < MAX_REVIEWS; i++) {

        var review_card = document.getElementById(`${REVIEWS[i].id}`);
        if (review_card !== null) {
            review_card.remove();
        }

        var card = createBootstrapCard(REVIEWS[i].id);

        container.appendChild(card);

        var card_title = createReviewTitle(REVIEWS[i].title);
        card.appendChild(card_title);

        var card_rating = createReviewRating(REVIEWS[i].username, REVIEWS[i].rating);
        card.appendChild(card_rating);

        var card_desc = createReviewDesc(REVIEWS[i].description);
        card.appendChild(card_desc);

        console.log(card);
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
