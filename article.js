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

    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    const article = articles.find(a => a.id === articleId);

    if (article) {
        document.title = article.title;
        articleTitleEl.textContent = article.title;
        
        downloadPdfBtn.classList.remove('hidden');
        
        // --- UPDATED Image Display Logic ---
        // Clear previous images and dynamically create new ones
        articleImagesEl.innerHTML = ''; // Clear existing
        article.images.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `${article.title} Image ${index + 1}`;
            articleImagesEl.appendChild(img);
        });
        
        articleNotesEl.innerHTML = `<h3>Detailed Notes</h3>${article.notes}`;
        
        let audioPlayerHtml = '';
        if (article.audioSrc && article.audioSrc.includes('drive.google.com')) {
            audioPlayerHtml = `
                <h3>Listen to the Summary</h3>
                <iframe class="google-drive-audio" src="${article.audioSrc}" allow="autoplay"></iframe>
            `;
        } else if (article.audioSrc) {
            audioPlayerHtml = `
                <h3>Listen to the Summary</h3>
                <audio controls>
                    <source src="${article.audioSrc}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            `;
        }
        
        articleAudioEl.innerHTML = audioPlayerHtml;

        // --- PDF Download Logic (Unchanged) ---
        downloadPdfBtn.addEventListener('click', () => {
            // Temporarily hide the audio player so it's not in the screenshot
            articleAudioEl.classList.add('hidden');

            html2canvas(articleContentEl, {
                scale: 2, // Higher scale for better quality
                useCORS: true
            }).then(canvas => {
                // Show the audio player again
                articleAudioEl.classList.remove('hidden');

                const imgData = canvas.toDataURL('image/png');
                const margin = 15; // PDF margin in mm
                const a4Width = 210; // A4 width in mm
                
                const usableWidth = a4Width - (margin * 2);

                const canvasAspectRatio = canvas.height / canvas.width;
                const contentHeight = usableWidth * canvasAspectRatio;

                const pageHeight = contentHeight + (margin * 2);

                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: [a4Width, pageHeight]
                });

                // Add the entire image to the single page
                pdf.addImage(imgData, 'PNG', margin, margin, usableWidth, contentHeight);

                // --- Add Copyright Footer ---
                pdf.setFontSize(8);
                pdf.setTextColor(150); // A light gray color
                const footerText = `© 2025 Basith Paravoor | HAJJ UMRA EXPO. All Rights Reserved.`;
                // Calculate the width of the text to center it
                const textWidth = pdf.getStringUnitWidth(footerText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
                const textX = (a4Width - textWidth) / 2;
                const textY = pageHeight - 10; // 10mm from the bottom
                pdf.text(footerText, textX, textY);

                const safeFilename = `${article.title.replace(/[\s/\\?%*:|"<>]/g, '_')}.pdf`;
                
                // Save the PDF
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