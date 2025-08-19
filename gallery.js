// ============================================================
// FILE: gallery.js
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('gallery-grid');
    
    // Get Modal Elements
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalViewMore = document.getElementById('modal-view-more');
    const modalDownloadBtn = document.getElementById('modal-download-btn');
    const closeModalBtn = document.querySelector('.modal-close');

    if (!galleryGrid || typeof articles === 'undefined') {
        console.error("Gallery grid or articles data not found.");
        return;
    }

    // --- 1. Populate the gallery grid ---
    articles.forEach(article => {
        article.images.forEach(imgSrc => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            // Store data in attributes for the modal
            galleryItem.dataset.src = imgSrc;
            galleryItem.dataset.title = article.title;
            galleryItem.dataset.articleUrl = `article.html?id=${article.id}`;
            
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = article.title;
            img.loading = 'lazy'; // Improve performance by lazy loading images

            galleryItem.appendChild(img);
            galleryGrid.appendChild(galleryItem);
        });
    });

    // --- 2. Handle click events to open the modal ---
    galleryGrid.addEventListener('click', (event) => {
        const item = event.target.closest('.gallery-item');
        if (item) {
            // Populate the modal with data from the clicked item
            modalImage.src = item.dataset.src;
            modalTitle.textContent = item.dataset.title;
            modalViewMore.href = item.dataset.articleUrl;
            modalDownloadBtn.href = item.dataset.src;
            
            // Create a safe filename for downloading
            const safeFilename = `${item.dataset.title.replace(/[\s/\\?%*:|"<>]/g, '_')}_HAJJ_UMRA_EXPO.jpg`;
            modalDownloadBtn.setAttribute('download', safeFilename);
            
            // Show the modal
            imageModal.classList.remove('hidden');
        }
    });

    // --- 3. Handle closing the modal ---
    const closeModal = () => {
        imageModal.classList.add('hidden');
    };

    closeModalBtn.addEventListener('click', closeModal);
    imageModal.addEventListener('click', (event) => {
        // Close if the user clicks on the dark overlay, but not on the content inside it
        if (event.target === imageModal) {
            closeModal();
        }
    });
});