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

let EVENT_MODAL;
function initializeEventModal() {
    // Create a modal using JS. The id will be `event-modal`:
    // Reference: https://getbootstrap.com/docs/5.3/components/modal/#via-javascript
    EVENT_MODAL = new bootstrap.Modal(document.getElementById('event-modal'));
}
function openEventModal() {
    EVENT_MODAL.show();
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
