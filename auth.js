// ============================================================
// FILE: auth.js (Confirmed Correct)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Your web app's Firebase configuration ---
    const firebaseConfig = {
        apiKey: "AIzaSyDdxTS7aU451qRCFzFIiePllanxGMd3skc",
        authDomain: "hajj-umra-expo-468c5.firebaseapp.com",
        projectId: "hajj-umra-expo-468c5",
        storageBucket: "hajj-umra-expo-468c5.appspot.com",
        messagingSenderId: "831928545119",
        appId: "1:831928545119:web:2ae9b8ea739b9c29ed50ea"
    };

    // --- 2. Initialize Firebase ---
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    // --- 3. GET DOM ELEMENTS ---
    const authModal = document.getElementById('auth-modal');
    const userProfileContainer = document.getElementById('user-profile-container');
    const profileIcon = document.getElementById('profile-icon');
    const profileDropdown = document.getElementById('profile-dropdown');
    const signOutBtn = document.getElementById('sign-out-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn'); 
    const registerBtn = document.getElementById('register-btn');
    const googleBtn = document.getElementById('google-btn');

    // --- 4. REAL-TIME AUTHENTICATION LISTENER ---
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            if (authModal) authModal.classList.add('hidden');
            if (userProfileContainer) {
                userProfileContainer.classList.remove('hidden');
                if (user.photoURL) {
                    profileIcon.src = user.photoURL;
                } else {
                    const initial = user.email ? user.email.charAt(0).toUpperCase() : 'U';
                    profileIcon.src = `https://placehold.co/40x40/1abc9c/ffffff?text=${initial}`;
                }
            }
        } else {
            // User is signed out.
            if (authModal) authModal.classList.remove('hidden');
            if (userProfileContainer) userProfileContainer.classList.add('hidden');
        }
    });

    // --- 5. EVENT LISTENERS FOR SIGN-IN/UP BUTTONS ---
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
                .catch(error => alert(`Registration Error: ${error.message}`));
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
                .catch(error => alert(`Login Error: ${error.message}`));
        });
    }

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            auth.signInWithPopup(googleProvider)
                .catch(error => alert(`Google Sign-In Error: ${error.message}`));
        });
    }

    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            auth.signOut();
        });
    }

    // --- UI Helpers ---
    if (profileIcon) {
        profileIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            if (profileDropdown) profileDropdown.classList.toggle('hidden');
        });
    }
    window.addEventListener('click', () => {
        if (profileDropdown && !profileDropdown.classList.contains('hidden')) {
            profileDropdown.classList.add('hidden');
        }
    });
});