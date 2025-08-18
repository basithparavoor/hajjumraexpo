// ============================================================
// FILE: theme.js
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');

    // This function applies the theme instantly to avoid a flash of the default theme
    const applyTheme = () => {
        const preferredTheme = localStorage.getItem('theme');
        if (preferredTheme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
        } else {
            document.documentElement.classList.remove('dark-mode');
            if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
        }
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');

            let newTheme = 'light';
            if (document.documentElement.classList.contains('dark-mode')) {
                newTheme = 'dark';
            }
            localStorage.setItem('theme', newTheme);
            applyTheme(); // Update the button icon
        });
    }
    
    // Apply theme on initial load
    applyTheme();
});