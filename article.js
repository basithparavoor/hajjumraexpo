// ============================================================
// FILE: article.js
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Make jsPDF available from the global window object
    const { jsPDF } = window.jspdf;

    const articleTitleEl = document.getElementById('article-title');
    const articleImagesEl = document.getElementById('article-images');
    const articleNotesEl = document.getElementById('article-notes');
    const articleAudioEl = document.getElementById('article-audio');
    const articleContentEl = document.getElementById('article-content');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');

    // Get Modal Elements
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalDownloadBtn = document.getElementById('modal-download-btn');
    const closeModalBtn = document.querySelector('.modal-close');

    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    // --- FIX APPLIED HERE ---
    // Convert the string 'articleId' from the URL to a number before comparing.
    const article = articles.find(a => a.id === parseInt(articleId));

    if (article) {
        document.title = article.title;
        articleTitleEl.textContent = article.title;
        
        downloadPdfBtn.classList.remove('hidden');
        
        // --- Image Display Logic ---
        articleImagesEl.innerHTML = ''; // Clear existing
        article.images.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `${article.title} Image ${index + 1}`;

            // Add click event to each image to open the modal
            img.addEventListener('click', () => {
                imageModal.classList.remove('hidden');
                modalImage.src = imgSrc;
                
                // Set download link and filename for the download button
                const safeFilename = `${article.title.replace(/[\s/\\?%*:|"<>]/g, '_')}_Image_${index + 1}_HAJJ_UMRA_EXPO.jpg`;
                modalDownloadBtn.href = imgSrc;
                modalDownloadBtn.setAttribute('download', safeFilename);
            });
            
            articleImagesEl.appendChild(img);
        });
        
        articleNotesEl.innerHTML = `<h3>Detailed Notes</h3>${article.notes}`;
        
        let audioPlayerHtml = '';
        if (article.audioSrc && article.audioSrc.includes('drive.google.com')) {
            const autoplaySrc = article.audioSrc.includes('?') ? `${article.audioSrc}&autoplay=1` : `${article.audioSrc}?autoplay=1`;
            audioPlayerHtml = `
                <h3>Listen to the Summary</h3>
                <iframe class="google-drive-audio" src="${autoplaySrc}" allow="autoplay"></iframe>
            `;
        } else if (article.audioSrc) {
            audioPlayerHtml = `
                <h3>Listen to the Summary</h3>
                <audio controls autoplay>
                    <source src="${article.audioSrc}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            `;
        }
        
        articleAudioEl.innerHTML = audioPlayerHtml;

        // --- Modal Event Listeners ---
        const closeModal = () => {
            imageModal.classList.add('hidden');
        };

        closeModalBtn.addEventListener('click', closeModal);
        imageModal.addEventListener('click', (event) => {
            if (event.target === imageModal) {
                closeModal();
            }
        });
        
        // --- NEW: Direct Image Download Logic ---
        modalDownloadBtn.addEventListener('click', (event) => {
            // Prevent the default link behavior
            event.preventDefault(); 
            
            const button = event.currentTarget;
            const imgSrc = button.href;
            const filename = button.getAttribute('download');
            
            // Give user feedback that download is starting
            button.textContent = 'Downloading...';
            button.style.pointerEvents = 'none';

            fetch(imgSrc)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return response.blob();
                })
                .then(blob => {
                    // Create a temporary link to trigger the download
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = blobUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(blobUrl);

                    // Reset button state
                    button.textContent = 'Download Image';
                    button.style.pointerEvents = 'auto';
                })
                .catch(err => {
                    console.error('Image download failed:', err);
                    alert('Sorry, the image could not be downloaded. It might be due to a network issue or server restrictions.');
                    // Reset button state on error
                    button.textContent = 'Download Image';
                    button.style.pointerEvents = 'auto';
                });
        });


        // --- PDF Download Logic ---
        downloadPdfBtn.addEventListener('click', () => {
            articleAudioEl.classList.add('hidden');

            html2canvas(articleContentEl, {
                scale: 2,
                useCORS: true
            }).then(canvas => {
                articleAudioEl.classList.remove('hidden');

                const imgData = canvas.toDataURL('image/png');
                const margin = 15;
                const a4Width = 210;
                const usableWidth = a4Width - (margin * 2);
                const canvasAspectRatio = canvas.height / canvas.width;
                const contentHeight = usableWidth * canvasAspectRatio;
                const pageHeight = contentHeight + (margin * 2);

                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: [a4Width, pageHeight]
                });

                pdf.addImage(imgData, 'PNG', margin, margin, usableWidth, contentHeight);

                pdf.setFontSize(8);
                pdf.setTextColor(150);
                const footerText = `© 2025 Basith Paravoor | HAJJ UMRA EXPO. All Rights Reserved.`;
                const textWidth = pdf.getStringUnitWidth(footerText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
                const textX = (a4Width - textWidth) / 2;
                const textY = pageHeight - 10;
                pdf.text(footerText, textX, textY);

                const safeFilename = `${article.title.replace(/[\s/\\?%*:|"<>]/g, '_')}.pdf`;
                pdf.save(safeFilename);

            }).catch(err => {
                articleAudioEl.classList.remove('hidden');
                console.error("PDF generation failed:", err);
                alert("Sorry, we couldn't generate the PDF. Please try again.");
            });
        });

    } else {
        articleContentEl.innerHTML = `<h1>Article Not Found</h1><p>Sorry, we couldn't find that article. Please <a href="index.html">return to the homepage</a>.</p>`;
    }
});