// API Base URL
const API_URL = 'http://localhost:8080/api/resources';  // or whatever port

// DOM Elements
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const fileUploadArea = document.getElementById('fileUploadArea');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFileBtn = document.getElementById('removeFile');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitLoader = document.getElementById('submitLoader');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

let selectedFile = null;

// Setup event listeners
document.addEventListener('DOMContentLoaded', () => {
    setupFileUpload();
    setupFormSubmit();
});

// File upload setup
function setupFileUpload() {
    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Remove file button
    removeFileBtn.addEventListener('click', clearFile);

    // Drag and drop
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });

    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('dragover');
    });

    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    });
}

// Handle file selection
function handleFileSelect() {
    const file = fileInput.files[0];

    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        alert('Please select a PDF, JPG, or PNG file');
        clearFile();
        return;
    }

    // Validate file size (10MB)
    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('File size must be less than 200MB');
        clearFile();
        return;
    }

    selectedFile = file;
    showFilePreview(file);
}

// Show file preview
function showFilePreview(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    fileUploadArea.style.display = 'none';
    filePreview.style.display = 'block';
}

// Clear selected file
function clearFile() {
    selectedFile = null;
    fileInput.value = '';

    fileUploadArea.style.display = 'block';
    filePreview.style.display = 'none';
}

// Setup form submission
function setupFormSubmit() {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert('Please select a file to upload');
            return;
        }

        await uploadResource();
    });
}

// Upload resource to API
async function uploadResource() {
    try {
        // Show loading state
        setLoadingState(true);
        hideMessages();

        // Prepare form data
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', document.getElementById('title').value);
        formData.append('subject', document.getElementById('subject').value);
        formData.append('semester', document.getElementById('semester').value);
        formData.append('type', document.getElementById('type').value);

        const uploaderName = document.getElementById('uploaderName').value.trim();
        if (uploaderName) {
            formData.append('uploaderName', uploaderName);
        }

        // Send request
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Upload failed');
        }

        const result = await response.json();
        console.log('Upload successful:', result);

        // Show success message
        showSuccess();

        // Reset form after 2 seconds and redirect
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        console.error('Upload error:', error);
        showError(error.message);
        setLoadingState(false);
    }
}

// UI State Functions

function setLoadingState(isLoading) {
    submitBtn.disabled = isLoading;

    if (isLoading) {
        submitText.style.display = 'none';
        submitLoader.style.display = 'flex';
    } else {
        submitText.style.display = 'inline';
        submitLoader.style.display = 'none';
    }
}

function showSuccess() {
    successMessage.style.display = 'flex';
    uploadForm.style.opacity = '0.5';
    uploadForm.style.pointerEvents = 'none';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';

    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function hideMessages() {
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Utility Functions

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}