// API Base URL
const API_URL = 'http://localhost:8081/api/resources';  // or whatever port
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
    loadResources();
    setupEventListeners();
});

// Fetch resources from API
async function loadResources() {
    try {
        showLoading();

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch resources');
        }

        allResources = await response.json();
        filteredResources = [...allResources];

        hideLoading();
        displayResources(filteredResources);
        populateSubjectFilter();

    } catch (error) {
        console.error('Error loading resources:', error);
        hideLoading();
        showEmptyState();
        alert('Failed to load resources. Make sure your backend is running!');
    }
}

// Display resources on page
function displayResources(resources) {
    // Update count
    resourceCount.textContent = `${resources.length} resource${resources.length !== 1 ? 's' : ''}`;

    // Show empty state if no resources
    if (resources.length === 0) {
        showEmptyState();
        return;
    }

    // Hide empty state
    emptyState.style.display = 'none';
    resourcesList.style.display = 'grid';

    // Clear existing resources
    resourcesList.innerHTML = '';

    // Create resource cards
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
        // Open download link in new tab
        window.open(`${API_URL}/download/${id}`, '_blank');

        // Reload resources to update download count
        setTimeout(() => {
            loadResources();
        }, 1000);

    } catch (error) {
        console.error('Error downloading resource:', error);
        alert('Failed to download resource');
    }
}

// View resource details
function viewDetails(id) {
    const resource = allResources.find(r => r.id === id);
    if (resource) {
        const message = `
Title: ${resource.title}
Subject: ${resource.subject}
Semester: ${resource.semester}
Type: ${resource.type}
File: ${resource.fileName}
Size: ${formatFileSize(resource.fileSize)}
Uploaded: ${formatDate(resource.uploadDate)}
Downloads: ${resource.downloadCount}
        `;
        alert(message);
    }
}

// Setup event listeners for filters
function setupEventListeners() {
    searchInput.addEventListener('input', filterResources);
    subjectFilter.addEventListener('change', filterResources);
    semesterFilter.addEventListener('change', filterResources);
    typeFilter.addEventListener('change', filterResources);
}

// Filter resources based on search and filters
function filterResources() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSubject = subjectFilter.value;
    const selectedSemester = semesterFilter.value;
    const selectedType = typeFilter.value;

    filteredResources = allResources.filter(resource => {
        // Search filter
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm) ||
                            resource.subject.toLowerCase().includes(searchTerm);

        // Subject filter
        const matchesSubject = !selectedSubject || resource.subject === selectedSubject;

        // Semester filter
        const matchesSemester = !selectedSemester || resource.semester.toString() === selectedSemester;

        // Type filter
        const matchesType = !selectedType || resource.type === selectedType;

        return matchesSearch && matchesSubject && matchesSemester && matchesType;
    });

    displayResources(filteredResources);
}

// Populate subject filter with unique subjects
function populateSubjectFilter() {
    const subjects = [...new Set(allResources.map(r => r.subject))].sort();

    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
    });
}

// Utility Functions

function showLoading() {
    loadingSpinner.style.display = 'block';
    resourcesList.style.display = 'none';
    emptyState.style.display = 'none';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showEmptyState() {
    emptyState.style.display = 'block';
    resourcesList.style.display = 'none';
}

function getFileIcon(type) {
    const icons = {
        'notes': '📝',
        'papers': '📄',
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
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}