// ============================================================
// FILE: create.js
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Password Protection Logic ---
    const CORRECT_PASSWORD = "MSOE@2025";
    const passwordOverlay = document.getElementById('password-overlay');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordError = document.getElementById('password-error');
    const protectedContent = document.getElementById('protected-content');
    
    passwordSubmit.addEventListener('click', () => {
        if (passwordInput.value === CORRECT_PASSWORD) {
            passwordOverlay.style.display = 'none';
            protectedContent.classList.remove('hidden'); 
        } else {
            passwordError.classList.remove('hidden');
            passwordInput.value = '';
        }
    });
    
    passwordInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            passwordSubmit.click();
        }
    });

    // --- Tab Switching Logic ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            const tabId = link.getAttribute('data-tab');
            const activeContent = document.getElementById(tabId);
            
            link.classList.add('active');
            activeContent.classList.add('active');
        });
    });
    
    // --- Add New Topic Logic ---
    const addTopicBtn = document.getElementById('add-topic-btn');
    const topicSelect = document.getElementById('topic');

    addTopicBtn.addEventListener('click', () => {
        const newTopicName = prompt("Please enter the new topic name:");

        if (newTopicName && newTopicName.trim() !== "") {
            const trimmedName = newTopicName.trim();
            const topicValue = trimmedName.toLowerCase().replace(/\s+/g, '-');

            const optionExists = Array.from(topicSelect.options).some(option => option.value === topicValue);

            if (optionExists) {
                alert("This topic already exists!");
            } else {
                const newOption = document.createElement('option');
                newOption.value = topicValue;
                newOption.textContent = trimmedName;
                
                topicSelect.appendChild(newOption);
                topicSelect.value = topicValue;
            }
        }
    });
    
    // --- Article Creator Logic ---
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const outputCodeEl = document.getElementById('output-code').querySelector('code');
    const copyFeedback = document.getElementById('copy-feedback');
    const addImageBtn = document.getElementById('add-image-btn');
    const imageFieldsContainer = document.getElementById('image-fields-container');
    let imageCounter = 2;

    addImageBtn.addEventListener('click', () => {
        const newFormGroup = document.createElement('div');
        newFormGroup.className = 'form-group';
        const newLabel = document.createElement('label');
        newLabel.textContent = `Google Drive Image Share Link ${imageCounter}`;
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'image-url-input';
        newInput.placeholder = 'Paste the standard share link from Google Drive here';
        newFormGroup.appendChild(newLabel);
        newFormGroup.appendChild(newInput);
        imageFieldsContainer.appendChild(newFormGroup);
        imageCounter++;
    });

    function convertDriveLink(shareLink, type = 'image') {
        if (shareLink && shareLink.includes('drive.google.com/file/d/')) {
            try {
                const parts = shareLink.split('/d/');
                const fileId = parts[1].split('/')[0];
                if (type === 'audio') {
                    return `https://drive.google.com/file/d/${fileId}/preview`;
                } else {
                    return `https://drive.google.com/uc?id=${fileId}`;
                }
            } catch (error) {
                console.error("Could not parse Google Drive link:", shareLink, error);
                return '';
            }
        }
        return shareLink;
    }

    generateBtn.addEventListener('click', () => {
        const title = document.getElementById('title').value;
        const topic = document.getElementById('topic').value;
        const keywords = document.getElementById('keywords').value;
        const notes = document.getElementById('notes').value.trim();
        const audioShareLink = document.getElementById('audio').value;

        if (!title || !keywords || !notes) {
            alert('Please fill out Title, Keywords, and Notes.');
            return;
        }

        const allImageInputs = document.querySelectorAll('#article-creator .image-url-input');
        const imageShareLinks = [];
        allImageInputs.forEach(input => {
            if (input.value.trim() !== '') {
                imageShareLinks.push(input.value.trim());
            }
        });

        const finalImages = imageShareLinks.map(link => convertDriveLink(link, 'image'));
        const imagesArrayString = finalImages.map(link => `\n            '${link}'`).join(',');
        
        const finalAudioLink = convertDriveLink(audioShareLink, 'audio');
        const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const articleObjectString = `
    {
        id: '${id}',
        topic: '${topic}',
        keywords: '${keywords}',
        title: '${title}',
        images: [${imagesArrayString}
        ],
        notes: \`
            ${notes}
        \`,
        audioSrc: '${finalAudioLink}'
    },`;

        outputCodeEl.textContent = articleObjectString;
    });

    copyBtn.addEventListener('click', () => {
        const codeToCopy = outputCodeEl.textContent;
        navigator.clipboard.writeText(codeToCopy).then(() => {
            copyFeedback.classList.remove('hidden');
            setTimeout(() => {
                copyFeedback.classList.add('hidden');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text.');
        });
    });

    // --- QR Code Generator Logic ---
    const generateQrBtn = document.getElementById('generate-qr-btn');
    const qrLinkInput = document.getElementById('qr-link');
    const qrOutputContainer = document.getElementById('qr-output');
    const qrCodeImg = document.getElementById('qr-code-img');
    const downloadQrBtn = document.getElementById('download-qr-btn');

    generateQrBtn.addEventListener('click', async () => {
        const link = qrLinkInput.value.trim();
        if (!link) {
            alert('Please enter a link to generate a QR code.');
            return;
        }

        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(link)}`;
        
        qrCodeImg.src = qrApiUrl;
        
        try {
            const response = await fetch(qrApiUrl);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            
            downloadQrBtn.href = objectUrl;
            qrOutputContainer.classList.remove('hidden');

        } catch (error) {
            console.error('Failed to fetch QR code for download:', error);
            alert('Could not prepare the QR code for download. Please try again.');
        }
    });
});