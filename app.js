// Global variables
let accessToken = null;
let images = [];
let currentImageIndex = 0;

// DOM elements
const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const authSection = document.getElementById('auth-section');
const authorizeButton = document.getElementById('authorize-button');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const caption = document.getElementById('caption');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (typeof GOOGLE_CONFIG === 'undefined' || !GOOGLE_CONFIG.CLIENT_ID || !GOOGLE_CONFIG.FOLDER_ID) {
        showError('Please configure your Google API credentials in config.js');
        return;
    }
    
    setupLightboxEvents();
    
    // Wait for Google library to load
    waitForGoogleLibrary();
});

// Wait for Google library to load
function waitForGoogleLibrary() {
    if (typeof google !== 'undefined' && google.accounts) {
        initializeGoogleAuth();
    } else {
        setTimeout(waitForGoogleLibrary, 100);
    }
}

// Initialize Google OAuth
function initializeGoogleAuth() {
    // Store the token client for later use
    window.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        callback: (response) => {
            if (response.access_token) {
                accessToken = response.access_token;
                hideAuth();
                loadImages();
            }
        },
    });
    
    // Try to load images without auth first (if folder is publicly shared)
    loadImagesPublic();
}

// Load images from Google Drive (public access)
async function loadImagesPublic() {
    try {
        const apiKey = GOOGLE_CONFIG.API_KEY;
        if (!apiKey) {
            showAuth();
            return;
        }
        
        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${GOOGLE_CONFIG.FOLDER_ID}'+in+parents+and+(mimeType+contains+'image/')&key=${apiKey}&fields=files(id,name,mimeType,webContentLink,thumbnailLink)`
        );
        
        if (!response.ok) {
            showAuth();
            return;
        }
        
        const data = await response.json();
        if (data.files && data.files.length > 0) {
            images = data.files;
            displayImages();
        } else {
            showAuth();
        }
    } catch (error) {
        console.error('Error loading public images:', error);
        showAuth();
    }
}

// Load images with OAuth token
async function loadImages() {
    try {
        loading.style.display = 'block';
        
        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${GOOGLE_CONFIG.FOLDER_ID}'+in+parents+and+(mimeType+contains+'image/')&fields=files(id,name,mimeType,webContentLink,thumbnailLink)`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch images');
        }
        
        const data = await response.json();
        images = data.files || [];
        
        if (images.length === 0) {
            showError('No images found in the specified folder.');
            return;
        }
        
        displayImages();
    } catch (error) {
        console.error('Error loading images:', error);
        showError('Failed to load images. Please try again.');
    } finally {
        loading.style.display = 'none';
    }
}

// Display images in gallery
function displayImages() {
    loading.style.display = 'none';
    errorDiv.style.display = 'none';
    gallery.innerHTML = '';
    
    images.forEach((image, index) => {
        const imageUrl = getImageUrl(image.id);
        
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.onclick = () => openLightbox(index);
        
        const img = document.createElement('img');
        img.alt = image.name;
        img.loading = 'lazy';
        
        // Add error handler
        img.onerror = () => {
            console.error('Failed to load image:', image.name);
            item.classList.add('image-error');
            item.title = `Failed to load: ${image.name}`;
        };
        
        // Add success handler
        img.onload = () => {
            item.classList.add('image-loaded');
        };
        
        // Check if it's a HEIC file
        if (isHeicFile(image.name)) {
            // Add a loading placeholder
            item.classList.add('loading-heic');
            convertHeicToJpeg(image.id, img, item);
        } else {
            img.src = imageUrl;
        }
        
        item.appendChild(img);
        gallery.appendChild(item);
    });
}

// Check if file is HEIC format
function isHeicFile(filename) {
    return /\.(heic|heif)$/i.test(filename);
}

// Convert HEIC to JPEG
async function convertHeicToJpeg(fileId, imgElement, containerElement) {
    try {
        // Fetch the HEIC file using Google Drive API
        const apiKey = GOOGLE_CONFIG.API_KEY;
        const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch HEIC file');
        }
        
        const blob = await response.blob();
        
        // Convert to JPEG using heic2any library
        const convertedBlob = await heic2any({
            blob: blob,
            toType: 'image/jpeg',
            quality: 0.9
        });
        
        // Create object URL and set as image source
        const jpegUrl = URL.createObjectURL(convertedBlob);
        imgElement.src = jpegUrl;
        containerElement.classList.remove('loading-heic');
        
        // Store converted URL for lightbox
        imgElement.dataset.convertedUrl = jpegUrl;
        imgElement.dataset.fileId = fileId;
    } catch (error) {
        console.error('Error converting HEIC:', error);
        // Show error message in the gallery item
        containerElement.classList.remove('loading-heic');
        containerElement.classList.add('heic-error');
        containerElement.title = 'HEIC conversion failed. Please convert to JPG and re-upload.';
    }
}

// Get image URL
function getImageUrl(fileId) {
    const apiKey = GOOGLE_CONFIG.API_KEY;
    if (apiKey) {
        // Use Google Drive API to get the actual file content
        return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
    }
    // Fallback to direct link (may not work for all files)
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

// Lightbox functions
function openLightbox(index) {
    currentImageIndex = index;
    showLightboxImage();
    lightbox.style.display = 'block';
}

function closeLightbox() {
    lightbox.style.display = 'none';
}

async function showLightboxImage() {
    const image = images[currentImageIndex];
    const imageUrl = getImageUrl(image.id);
    
    // Check if it's a HEIC file
    if (isHeicFile(image.name)) {
        // Show loading in lightbox
        caption.textContent = 'Converting ' + image.name + '...';
        
        try {
            const apiKey = GOOGLE_CONFIG.API_KEY;
            const url = `https://www.googleapis.com/drive/v3/files/${image.id}?alt=media&key=${apiKey}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch');
            
            const blob = await response.blob();
            const convertedBlob = await heic2any({
                blob: blob,
                toType: 'image/jpeg',
                quality: 0.9
            });
            const jpegUrl = URL.createObjectURL(convertedBlob);
            lightboxImg.src = jpegUrl;
        } catch (error) {
            console.error('Error converting HEIC in lightbox:', error);
            caption.textContent = 'Error: Cannot display HEIC file. Please convert to JPG.';
            return;
        }
    } else {
        lightboxImg.src = imageUrl;
    }
    
    caption.textContent = image.name;
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showLightboxImage();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showLightboxImage();
}

// Setup lightbox event listeners
function setupLightboxEvents() {
    closeBtn.onclick = closeLightbox;
    prevBtn.onclick = prevImage;
    nextBtn.onclick = nextImage;
    
    lightbox.onclick = (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    };
    
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        }
    });
    
    authorizeButton.onclick = () => {
        if (window.tokenClient) {
            window.tokenClient.requestAccessToken();
        } else {
            showError('Google authentication not ready. Please refresh the page.');
        }
    };
}

// UI helper functions
function showAuth() {
    loading.style.display = 'none';
    authSection.style.display = 'block';
}

function hideAuth() {
    authSection.style.display = 'none';
}

function showError(message) {
    loading.style.display = 'none';
    errorDiv.style.display = 'block';
    errorDiv.querySelector('p').textContent = message;
}
