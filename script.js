// ============================================================
// FILE: script.js
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const researchGrid = document.getElementById('research-grid');
    const searchInput = document.getElementById('searchInput');
    const topicFilter = document.getElementById('topicFilter');

    // --- NEW: Automatic Header Image Slideshow ---
    const heroContainer = document.querySelector('.hero-container');
    if (heroContainer && typeof articles !== 'undefined' && articles.length > 0) {
        // 1. Collect all available image URLs from the articles array
        const allImages = articles.flatMap(article => article.images);
        
        if (allImages.length > 0) {
            let currentIndex = 0;

            // Optional: Preload images in the background for smoother transitions
            allImages.forEach(src => {
                new Image().src = src;
            });

            // 2. Set the first image immediately
            heroContainer.style.backgroundImage = `url('${allImages[0]}')`;

            // 3. Set up the interval to change the image every 3 seconds
            setInterval(() => {
                // Move to the next image index, looping back to the start if needed
                currentIndex = (currentIndex + 1) % allImages.length;
                
                // 4. Update the background image of the hero container
                heroContainer.style.backgroundImage = `url('${allImages[currentIndex]}')`;
            }, 3000); // 3000 milliseconds = 3 seconds
        }
    }
    // --- End of Slideshow Code ---


    // Function to populate the homepage with article cards
    function populateHomepage() {
        researchGrid.innerHTML = ''; // Clear existing content
        articles.forEach((article, index) => {
            const card = document.createElement('a');
            card.href = `article.html?id=${article.id}`;
            card.className = 'research-card fade-in-up';
            card.style.animationDelay = `${index * 100}ms`; // Staggered animation delay
            card.dataset.topic = article.topic;
            card.dataset.title = article.title.toLowerCase();
            card.dataset.keywords = article.keywords.toLowerCase();

            // Create a short preview of the notes
            const notesPreview = article.notes.substring(0, 200).split(' ').slice(0, -1).join(' ') + '...';

            card.innerHTML = `
                <h2>${article.title}</h2>
                <div class="image-container">
                    <img src="${article.images[0]}" alt="${article.title} Image 1">
                    <img src="${article.images[1]}" alt="${article.title} Image 2">
                </div>
                <div class="notes">
                    <h3>Key Notes</h3>
                    ${notesPreview}
                </div>
            `;
            researchGrid.appendChild(card);
        });
    }

    // Function to filter cards based on search and topic
    function filterContent() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedTopic = topicFilter.value;
        const cards = researchGrid.getElementsByClassName('research-card');

        for (let card of cards) {
            const topicMatch = (selectedTopic === 'all' || card.dataset.topic === selectedTopic);
            const searchMatch = (card.dataset.title.includes(searchTerm) || card.dataset.keywords.includes(searchTerm));

            if (topicMatch && searchMatch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    }

    populateHomepage(); // Initial population of the grid
    searchInput.addEventListener('keyup', filterContent);
    topicFilter.addEventListener('change', filterContent);
});