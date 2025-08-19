// ============================================================
// FILE: nav.js
// Handles the mobile navigation toggle.
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            // Toggle the 'is-active' class on both the button and the nav links
            menuToggle.classList.toggle('is-active');
            navLinks.classList.toggle('is-active');
        });
    }
});