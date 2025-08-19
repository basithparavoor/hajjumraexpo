// ============================================================
// FILE: script.js
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const topicFilter = document.getElementById('topicFilter');
    const researchGrid = document.getElementById('research-grid');

    if (!researchGrid || typeof articles === 'undefined') {
        console.error("Required elements or articles data not found.");
        return;
    }

    // --- 1. Populate Topic Filter ---
    const populateTopics = () => {
        const topics = new Set(articles.map(article => article.topic));
        topics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            // Capitalize the first letter for better display
            option.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
            topicFilter.appendChild(option);
        });
    };

    // --- 2. Display Articles in the Grid ---
    const displayArticles = (articlesToDisplay) => {
        researchGrid.innerHTML = ''; // Clear existing articles

        if (articlesToDisplay.length === 0) {
            researchGrid.innerHTML = '<p class="no-results">No articles found. Try adjusting your search or filter.</p>';
            return;
        }

        articlesToDisplay.forEach(article => {
            const card = document.createElement('a');
            card.href = `article.html?id=${article.id}`;
            card.className = 'research-card';

            const image = document.createElement('img');
            // Use the first image as the thumbnail
            image.src = article.images[0] || 'https://placehold.co/600x400/EEE/31343C?text=No+Image';
            image.alt = article.title;
            image.loading = 'lazy';

            const title = document.createElement('h3');
            title.textContent = article.title;
            
            // Create a short description from the notes
            const description = document.createElement('p');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = article.notes;
            description.textContent = tempDiv.textContent.substring(0, 100) + '...';


            card.appendChild(image);
            card.appendChild(title);
            card.appendChild(description);
            researchGrid.appendChild(card);
        });
    };

    // --- 3. Filter and Search Logic ---
    const filterAndSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedTopic = topicFilter.value;

        const filteredArticles = articles.filter(article => {
            const matchesTopic = selectedTopic === 'all' || article.topic === selectedTopic;
            
            const matchesSearch = 
                article.title.toLowerCase().includes(searchTerm) ||
                article.keywords.toLowerCase().includes(searchTerm);

            return matchesTopic && matchesSearch;
        });

        displayArticles(filteredArticles);
    };

    // --- 4. Add Event Listeners ---
    searchInput.addEventListener('input', filterAndSearch);
    topicFilter.addEventListener('change', filterAndSearch);

    // --- 5. Initial Load ---
    populateTopics();
    displayArticles(articles); // Display all articles initially
});