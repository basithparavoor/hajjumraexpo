// ============================================================
// FILE: create.js
// Handles all functionality for the admin creation page.
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Password Protection ---
    const passwordOverlay = document.getElementById('password-overlay');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordError = document.getElementById('password-error');
    const protectedContent = document.getElementById('protected-content');
    
    // The password to access the admin page.
    // In a real application, this should be handled securely on a server.
    const ADMIN_PASSWORD = "MSOE@2025"; 

    if (passwordSubmit) {
        passwordSubmit.addEventListener('click', () => {
            if (passwordInput.value === ADMIN_PASSWORD) {
                passwordOverlay.classList.add('hidden');
                protectedContent.classList.remove('hidden');
            } else {
                passwordError.classList.remove('hidden');
                passwordInput.value = '';
            }
        });

        // Allow pressing Enter to submit
        passwordInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                passwordSubmit.click();
            }
        });
    }


    // --- 2. Tab Functionality ---
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.getElementById(tab.dataset.tab);
            
            // Deactivate all tabs and content
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Activate the clicked tab and its content
            tab.classList.add('active');
            if (target) {
                target.classList.add('active');
            }
        });
    });


    // --- 3. Article Creator ---
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const addImageBtn = document.getElementById('add-image-btn');
    const addTopicBtn = document.getElementById('add-topic-btn');
    const imageFieldsContainer = document.getElementById('image-fields-container');
    let imageCount = 1;

    if (addImageBtn) {
        addImageBtn.addEventListener('click', () => {
            imageCount++;
            const newImageField = document.createElement('div');
            newImageField.className = 'form-group';
            newImageField.innerHTML = `
                <label for="image${imageCount}">Image URL ${imageCount}</label>
                <input type="text" id="image${imageCount}" class="image-url-input" placeholder="Paste another direct image link">
            `;
            imageFieldsContainer.appendChild(newImageField);
        });
    }

    if (addTopicBtn) {
        addTopicBtn.addEventListener('click', () => {
            const newTopic = prompt("Enter the new topic name:");
            if (newTopic && newTopic.trim() !== "") {
                const topicSelect = document.getElementById('topic');
                const option = document.createElement('option');
                option.value = newTopic.trim().toLowerCase().replace(/\s+/g, '-');
                option.textContent = newTopic.trim();
                topicSelect.appendChild(option);
                topicSelect.value = option.value; // Select the new topic
            }
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const title = document.getElementById('title').value;
            const topic = document.getElementById('topic').value;
            const keywords = document.getElementById('keywords').value.split(',').map(k => k.trim());
            const notes = document.getElementById('notes').value;
            const audioLink = document.getElementById('audio').value;

            const images = [];
            document.querySelectorAll('.image-url-input').forEach(input => {
                if (input.value.trim() !== '') {
                    images.push(input.value.trim());
                }
            });
            
            // Convert Google Drive link to a direct play link
            let audioSrc = '';
            if (audioLink.includes('drive.google.com')) {
                const fileId = audioLink.match(/d\/(.+?)\//);
                if (fileId && fileId[1]) {
                    audioSrc = `https://docs.google.com/uc?export=open&id=${fileId[1]}`;
                }
            }

            const articleObject = {
                id: Date.now(), // Use timestamp for a simple unique ID
                title,
                topic,
                keywords,
                images,
                notes,
                audio: audioSrc
            };

            const outputCode = document.querySelector('#output-code code');
            outputCode.textContent = `// Add this object to the 'articles' array in data.js\n${JSON.stringify(articleObject, null, 4)},`;
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const codeToCopy = document.querySelector('#output-code code').textContent;
            navigator.clipboard.writeText(codeToCopy).then(() => {
                const feedback = document.getElementById('copy-feedback');
                feedback.classList.remove('hidden');
                setTimeout(() => feedback.classList.add('hidden'), 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }


    // --- 4. QR Code Generator ---
    const generateQrBtn = document.getElementById('generate-qr-btn');
    const qrLinkInput = document.getElementById('qr-link');
    const qrOutputContainer = document.getElementById('qr-output');
    const qrCodeImg = document.getElementById('qr-code-img');
    const downloadQrBtn = document.getElementById('download-qr-btn');

    if (generateQrBtn) {
        generateQrBtn.addEventListener('click', () => {
            const link = qrLinkInput.value.trim();
            if (!link) {
                alert("Please enter a URL.");
                return;
            }
            
            // Using a free public API for QR code generation
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(link)}`;
            
            qrCodeImg.src = qrApiUrl;
            downloadQrBtn.href = qrApiUrl;
            
            qrOutputContainer.classList.remove('hidden');
        });
    }

    // --- 5. Notification Creator ---
    const generateNotificationBtn = document.getElementById('generate-notification-btn');
    const notificationTitleInput = document.getElementById('notification-title');
    const notificationMessageInput = document.getElementById('notification-message');
    const copyNotificationBtn = document.getElementById('copy-notification-btn');

    if (generateNotificationBtn) {
        generateNotificationBtn.addEventListener('click', () => {
            const title = notificationTitleInput.value.trim();
            const message = notificationMessageInput.value.trim();

            if (!title || !message) {
                alert('Please fill out both title and message for the notification.');
                return;
            }

            const newNotification = {
                id: Date.now(), // Simple unique ID from timestamp
                title: title,
                message: message,
                read: false,
                timestamp: new Date().toISOString()
            };

            // Display the generated code
            const outputCode = document.querySelector('#notification-output-code code');
            outputCode.textContent = `// Add this object to the 'initialNotifications' array in notifications.js\n${JSON.stringify(newNotification, null, 4)},`;
            
            // Clear the form
            notificationTitleInput.value = '';
            notificationMessageInput.value = '';
        });
    }

    if (copyNotificationBtn) {
        copyNotificationBtn.addEventListener('click', () => {
            const codeToCopy = document.querySelector('#notification-output-code code').textContent;
            navigator.clipboard.writeText(codeToCopy).then(() => {
                const feedback = document.getElementById('copy-notification-feedback');
                feedback.classList.remove('hidden');
                setTimeout(() => feedback.classList.add('hidden'), 2000);
            }).catch(err => {
                console.error('Failed to copy notification text: ', err);
            });
        });
    }
});