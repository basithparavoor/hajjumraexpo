document.addEventListener('DOMContentLoaded', () => {
    const userSessionContainer = document.getElementById('user-session');
    
    // Check if a user is logged in by looking at sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (currentUser) {
        // If the user is logged in, display a welcome message and a sign-out icon
        userSessionContainer.innerHTML = `
            <span class="welcome-message">Welcome, ${currentUser.username}</span>
            <a href="#" id="signout-link" class="user-icon-link" aria-label="Sign Out">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                    <line x1="12" y1="2" x2="12" y2="12"></line>
                </svg>
            </a>
        `;

        // Add a click event listener to the new sign-out link
        const signoutLink = document.getElementById('signout-link');
        if (signoutLink) {
            signoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }

        // Find the welcome message and make it disappear after 5 seconds
        const welcomeMessage = userSessionContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            setTimeout(() => {
                // Add class to trigger fade-out animation
                welcomeMessage.classList.add('fade-out');
                
                // Remove the element completely after the animation finishes (500ms)
                setTimeout(() => {
                    welcomeMessage.remove();
                }, 500);
            }, 5000); // 5000 milliseconds = 5 seconds
        }
    }
});