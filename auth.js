// ============================================================
// FILE: auth.js
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const signinFormContainer = document.getElementById('signin-form-container');
    const signupFormContainer = document.getElementById('signup-form-container');
    const showSignup = document.getElementById('show-signup');
    const showSignin = document.getElementById('show-signin');

    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');

    const signinError = document.getElementById('signin-error');
    const signupError = document.getElementById('signup-error');

    // Toggle between sign-in and sign-up forms
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        signinFormContainer.classList.add('hidden');
        signupFormContainer.classList.remove('hidden');
    });

    showSignin.addEventListener('click', (e) => {
        e.preventDefault();
        signupFormContainer.classList.add('hidden');
        signinFormContainer.classList.remove('hidden');
    });

    // Handle Sign-Up
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        signupError.classList.add('hidden');

        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;

        if (!username || !email || !password) {
            signupError.textContent = 'All fields are required.';
            signupError.classList.remove('hidden');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            signupError.textContent = 'An account with this email already exists.';
            signupError.classList.remove('hidden');
            return;
        }

        const newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        sessionStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.href = 'index.html';
    });

    // Handle Sign-In
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        signinError.classList.add('hidden');

        const email = document.getElementById('signin-email').value.trim();
        const password = document.getElementById('signin-password').value;

        if (!email || !password) {
            signinError.textContent = 'Email and password are required.';
            signinError.classList.remove('hidden');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            signinError.textContent = 'Invalid email or password.';
            signinError.classList.remove('hidden');
        }
    });

    // --- Branding Panel Slideshow Logic ---
    const slideshowContainer = document.getElementById('slideshow-container');
    
    if (slideshowContainer && typeof articles !== 'undefined') {
        const allImages = articles.flatMap(article => article.images);
        let currentImageIndex = 0;

        // Create and append image elements
        allImages.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = "HARAMAIN INSIGHTS background image";
            if (index === 0) {
                img.classList.add('visible'); // Make the first image visible initially
            }
            slideshowContainer.appendChild(img);
        });

        const slides = slideshowContainer.querySelectorAll('img');

        if (slides.length > 1) {
            setInterval(() => {
                slides[currentImageIndex].classList.remove('visible');
                currentImageIndex = (currentImageIndex + 1) % slides.length;
                slides[currentImageIndex].classList.add('visible');
            }, 3000); // Change image every 3 seconds
        }
    }
});