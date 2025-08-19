// user.js

document.addEventListener('DOMContentLoaded', () => {
    const userSession = document.getElementById('user-session');
    const signinLink = document.getElementById('signin-link');
    const welcomeMessage = document.getElementById('welcome-message'); // Added this line

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (currentUser) {
        // User is signed in
        userSession.innerHTML = `
            <span id="welcome-message">Welcome, ${currentUser.username}!</span>
            <a href="#" id="signout-link">Sign Out</a>
        `;

        const signoutLink = document.getElementById('signout-link');
        signoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('currentUser');
            window.location.reload(); // Refresh to update the header
        });

        // Hide welcome message after 10 seconds
        setTimeout(() => {
            const welcomeMessageElement = document.getElementById('welcome-message');
            if (welcomeMessageElement) {
                welcomeMessageElement.style.display = 'none';
            }
        }, 10000); // 10000 milliseconds = 10 seconds

    } else {
        // User is not signed in
        signinLink.style.display = 'inline';
    }
});