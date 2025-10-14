// API Base URL
// Replace with YOUR ngrok URL (the one you just got)
const API_BASE_URL = 'https:// https://umbrellaless-condylar-maryln.ngrok-free.dev/api/resources';

// DOM Elements
const resourcesList = document.getElementById('resourcesList');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState = document.getElementById('emptyState');
const resourceCount = document.getElementById('resourceCount');
const searchInput = document.getElementById('searchInput');
const subjectFilter = document.getElementById('subjectFilter');
const semesterFilter = document.getElementById('semesterFilter');
const typeFilter = document.getElementById('typeFilter');

// Store all resources
let allResources = [];
let filteredResources = [];

// Load resources when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('API_BASE_URL:', API_BASE_URL); // Debug log
    loadResources();
    setupEventListeners();
});

// Fetch resources from API
async function loadResources() {
    try {
        console.log('Fetching from:', API_BASE_URL); // Debug log
        showLoading();

        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch resources: ' + response.status);
        }

        allResources = await response.json();
        filteredResources = [...allResources];

        console.log('Loaded resources:', allResources.length); // Debug log
        hideLoading();
        displayResources(filteredResources);
        populateSubjectFilter();

    } catch (error) {
        console.error('Error loading resources:', error);
        hideLoading();
        showEmptyState();
        alert('Failed to load resources. Error: ' + error.message);
    }
}

// Display resources on page
function displayResources(resources) {
    resourceCount.textContent = `${resources.length} resource${resources.length !== 1 ? 's' : ''}`;

    if (document.getElementById('totalResources')) {
        updateStatistics();
    }

    if (resources.length === 0) {
        showEmptyState();
        return;
    }

    emptyState.style.display = 'none';
    resourcesList.style.display = 'grid';
    resourcesList.innerHTML = '';

    resources.forEach(resource => {
        const card = createResourceCard(resource);
        resourcesList.appendChild(card);
    });
}

// Create a resource card element
function createResourceCard(resource) {
    const card = document.createElement('div');
    card.className = 'resource-card';

    const icon = getFileIcon(resource.type);
    const date = formatDate(resource.uploadDate);
    const uploaderName = resource.uploaderName || 'Anonymous';

    card.innerHTML = `
        <div class="resource-icon">${icon}</div>
        <h3 class="resource-title">${escapeHtml(resource.title)}</h3>
        <div class="resource-meta">
            <span>📚 ${escapeHtml(resource.subject)}</span>
            <span>🎓 Sem ${resource.semester}</span>
            <span>📥 ${resource.downloadCount}</span>
        </div>
        <div class="resource-date">Uploaded ${date}${uploaderName !== 'Anonymous' ? ' by ' + escapeHtml(uploaderName) : ''}</div>
        <div class="resource-actions">
            <button class="btn btn-primary btn-small" onclick="downloadResource(${resource.id})">
                Download
            </button>
            <button class="btn btn-secondary btn-small" onclick="viewDetails(${resource.id})">
                Details
            </button>
        </div>
    `;

    return card;
}

// Download resource
async function downloadResource(id) {
    try {
        const resource = allResources.find(r => r.id === id);
        window.open(`${API_BASE_URL}/download/${id}`, '_blank');

        if (typeof showToast === 'function') {
            showToast(`Downloading "${resource.title}"...`);
        }

        setTimeout(() => {
            loadResources();
        }, 1000);
    } catch (error) {
        console.error('Error downloading resource:', error);
        if (typeof showToast === 'function') {
            showToast('Failed to download resource', 'error');
        }
    }
}

// View resource details
function viewDetails(id) {
    const resource = allResources.find(r => r.id === id);
    if (!resource) return;

    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalBody) {
        // Fallback to alert if modal doesn't exist
        alert(`
Title: ${resource.title}
Subject: ${resource.subject}
Semester: ${resource.semester}
Type: ${resource.type}
File: ${resource.fileName}
Size: ${formatFileSize(resource.fileSize)}
Uploaded: ${formatDate(resource.uploadDate)}
Downloads: ${resource.downloadCount}
        `);
        return;
    }

    const uploaderName = resource.uploaderName || 'Anonymous';

    modalBody.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">📝 Title:</span>
            <span class="detail-value">${escapeHtml(resource.title)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">📚 Subject:</span>
            <span class="detail-value">${escapeHtml(resource.subject)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">🎓 Semester:</span>
            <span class="detail-value">Semester ${resource.semester}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">📂 Type:</span>
            <span class="detail-value">${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">📄 File Name:</span>
            <span class="detail-value">${escapeHtml(resource.fileName)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">💾 File Size:</span>
            <span class="detail-value">${formatFileSize(resource.fileSize)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">👤 Uploaded By:</span>
            <span class="detail-value">${escapeHtml(uploaderName)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">📅 Upload Date:</span>
            <span class="detail-value">${new Date(resource.uploadDate).toLocaleString()}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">📥 Downloads:</span>
            <span class="detail-value">${resource.downloadCount} times</span>
        </div>
    `;

    modal.classList.add('active');

    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };
}

// Close modal
function closeModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Setup event listeners
function setupEventListeners() {
    if (searchInput) searchInput.addEventListener('input', filterResources);
    if (subjectFilter) subjectFilter.addEventListener('change', filterResources);
    if (semesterFilter) semesterFilter.addEventListener('change', filterResources);
    if (typeFilter) typeFilter.addEventListener('change', filterResources);
}

// Filter resources
function filterResources() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSubject = subjectFilter.value;
    const selectedSemester = semesterFilter.value;
    const selectedType = typeFilter.value;

    filteredResources = allResources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm) ||
                            resource.subject.toLowerCase().includes(searchTerm);
        const matchesSubject = !selectedSubject || resource.subject === selectedSubject;
        const matchesSemester = !selectedSemester || resource.semester.toString() === selectedSemester;
        const matchesType = !selectedType || resource.type === selectedType;

        return matchesSearch && matchesSubject && matchesSemester && matchesType;
    });

    displayResources(filteredResources);
}

// Populate subject filter
function populateSubjectFilter() {
    if (!subjectFilter) return;

    const subjects = [...new Set(allResources.map(r => r.subject))].sort();

    // Clear existing options except first one
    subjectFilter.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());

    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
    });
}

// Update statistics
function updateStatistics() {
    const totalResources = allResources.length;
    const totalDownloads = allResources.reduce((sum, r) => sum + (r.downloadCount || 0), 0);
    const uniqueSubjects = new Set(allResources.map(r => r.subject)).size;
    const uniqueSemesters = new Set(allResources.map(r => r.semester)).size;

    const totalResourcesEl = document.getElementById('totalResources');
    const totalDownloadsEl = document.getElementById('totalDownloads');
    const totalSubjectsEl = document.getElementById('totalSubjects');
    const totalSemestersEl = document.getElementById('totalSemesters');

    if (totalResourcesEl) totalResourcesEl.textContent = totalResources;
    if (totalDownloadsEl) totalDownloadsEl.textContent = totalDownloads;
    if (totalSubjectsEl) totalSubjectsEl.textContent = uniqueSubjects;
    if (totalSemestersEl) totalSemestersEl.textContent = uniqueSemesters;
}

// Utility Functions
function showLoading() {
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    if (resourcesList) resourcesList.style.display = 'none';
    if (emptyState) emptyState.style.display = 'none';
}

function hideLoading() {
    if (loadingSpinner) loadingSpinner.style.display = 'none';
}

function showEmptyState() {
    if (emptyState) emptyState.style.display = 'block';
    if (resourcesList) resourcesList.style.display = 'none';
}

function getFileIcon(type) {
    const icons = {
        'notes': '📝',
        'papers': '📄',
        'books': '📚',
        'other': '📎'
    };
    return icons[type] || '📄';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

function formatFileSize(bytes) {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? '✅' : '❌';
    const title = type === 'success' ? 'Success!' : 'Error!';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}