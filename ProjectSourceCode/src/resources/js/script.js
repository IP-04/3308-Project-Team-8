function checkSession(username) {
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
