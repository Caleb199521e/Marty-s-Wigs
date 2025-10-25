let currentCategory = 'all';
let currentFilter = 'all';
let allImages = [];

// Load gallery items
async function loadGallery(category = 'all') {
    currentFilter = category;
    
    try {
        const items = await apiRequest(`/gallery${category !== 'all' ? '?category=' + category : ''}`);
        
        const galleryGrid = document.getElementById('gallery-grid');
        
        if (!galleryGrid) {
            console.error('Gallery grid element not found');
            return;
        }
        
        if (items.length === 0) {
            galleryGrid.innerHTML = '<p class="col-span-full text-center text-gray-500 py-8">No images uploaded yet.</p>';
            return;
        }
        
        galleryGrid.innerHTML = items.map(item => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-48 object-cover">
                <div class="p-3">
                    <h3 class="font-medium text-sm truncate mb-2">${item.title}</h3>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs px-2 py-1 rounded ${getCategoryColor(item.category)}">${item.category}</span>
                        ${item.featured ? '<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">⭐ Featured</span>' : ''}
                    </div>
                    <div class="flex gap-2">
                        <button onclick="toggleFeatured('${item._id}', ${item.featured})" 
                                class="flex-1 px-2 py-1 text-xs ${item.featured ? 'bg-gray-200' : 'bg-yellow-100'} rounded hover:opacity-80">
                            ${item.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button onclick="deleteImage('${item._id}')" 
                                class="flex-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Failed to load gallery:', error);
        showToast('Failed to load gallery', 'error');
    }
}

// Get category color
function getCategoryColor(category) {
    const colors = {
        'wigs': 'bg-blue-100 text-blue-800',
        'makeovers': 'bg-pink-100 text-pink-800',
        'bridal': 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
}

// Toggle featured status
async function toggleFeatured(id, isFeatured) {
    try {
        await apiRequest(`/gallery/${id}/featured`, { method: 'PATCH' });
        showToast(`Image ${isFeatured ? 'removed from' : 'added to'} featured gallery!`, 'success');
        loadGallery(currentFilter);
    } catch (error) {
        console.error('Toggle featured error:', error);
        showToast('Failed to update featured status', 'error');
    }
}

// Update category counts
function updateCounts(images) {
    document.getElementById('count-all').textContent = images.length;
    document.getElementById('count-makeovers').textContent = images.filter(img => img.category === 'makeovers').length;
    document.getElementById('count-wigs').textContent = images.filter(img => img.category === 'wigs').length;
    document.getElementById('count-bridal').textContent = images.filter(img => img.category === 'bridal').length;
}

// Category filter
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const category = this.dataset.category;
        currentCategory = category;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(b => {
            b.classList.remove('bg-pink-600', 'text-white');
            b.classList.add('bg-gray-200', 'text-gray-700');
        });
        this.classList.remove('bg-gray-200', 'text-gray-700');
        this.classList.add('bg-pink-600', 'text-white');
        
        loadGallery(category);
    });
});

// Upload Modal
const uploadModal = document.getElementById('upload-modal');
const uploadBtn = document.getElementById('upload-btn');
const closeModal = document.getElementById('close-modal');
const cancelUpload = document.getElementById('cancel-upload');

uploadBtn.addEventListener('click', () => uploadModal.classList.remove('hidden'));
closeModal.addEventListener('click', () => uploadModal.classList.add('hidden'));
cancelUpload.addEventListener('click', () => uploadModal.classList.add('hidden'));

// Drag and drop
const dropZone = document.getElementById('drop-zone');
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const removeImageBtn = document.getElementById('remove-image');

dropZone.addEventListener('click', () => imageInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-pink-500', 'bg-pink-50');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-pink-500', 'bg-pink-50');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-pink-500', 'bg-pink-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        imageInput.files = files;
        previewImage(files[0]);
    }
});

imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        previewImage(e.target.files[0]);
    }
});

function previewImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        imagePreview.classList.remove('hidden');
        dropZone.classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

removeImageBtn.addEventListener('click', () => {
    imageInput.value = '';
    imagePreview.classList.add('hidden');
    dropZone.classList.remove('hidden');
});

// Upload form submission
const uploadForm = document.getElementById('upload-form');
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-upload');
    const errorDiv = document.getElementById('upload-error');
    
    errorDiv.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';
    
    try {
        // Check if image is selected
        const imageFile = document.getElementById('image-input').files[0];
        if (!imageFile) {
            throw new Error('Please select an image to upload');
        }

        // Check file size (5MB limit)
        if (imageFile.size > 5 * 1024 * 1024) {
            throw new Error('Image size must be less than 5MB');
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(imageFile.type)) {
            throw new Error('Only JPG, PNG, and WEBP images are allowed');
        }

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('title', document.getElementById('title').value);
        formData.append('category', document.getElementById('category').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('featured', document.getElementById('featured').checked);
        
        console.log('Uploading image:', {
            fileName: imageFile.name,
            fileSize: imageFile.size,
            fileType: imageFile.type
        });

        const result = await uploadFile('/gallery', formData);
        
        console.log('Upload successful:', result);
        showToast('Image uploaded successfully!', 'success');
        uploadModal.classList.add('hidden');
        uploadForm.reset();
        imagePreview.classList.add('hidden');
        dropZone.classList.remove('hidden');
        loadGallery(currentCategory);
        
    } catch (error) {
        console.error('Upload error:', error);
        errorDiv.textContent = error.message || 'Upload failed. Please try again.';
        errorDiv.classList.remove('hidden');
        showToast(error.message || 'Upload failed', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload Image';
    }
});

// Edit image
async function editImage(id) {
    const image = allImages.find(img => img._id === id);
    if (!image) return;
    
    document.getElementById('edit-id').value = image._id;
    document.getElementById('edit-current-image').src = image.imageUrl;
    document.getElementById('edit-title').value = image.title;
    document.getElementById('edit-category').value = image.category;
    document.getElementById('edit-description').value = image.description || '';
    document.getElementById('edit-featured').checked = image.featured || false;
    
    document.getElementById('edit-modal').classList.remove('hidden');
}

// Close edit modal
document.getElementById('close-edit-modal').addEventListener('click', () => {
    document.getElementById('edit-modal').classList.add('hidden');
});

document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-modal').classList.add('hidden');
});

// Edit form submission
document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-edit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
        const id = document.getElementById('edit-id').value;
        const data = {
            title: document.getElementById('edit-title').value,
            category: document.getElementById('edit-category').value,
            description: document.getElementById('edit-description').value,
            featured: document.getElementById('edit-featured').checked
        };
        
        await apiRequest(`/gallery/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        
        showToast('Image updated successfully!', 'success');
        document.getElementById('edit-modal').classList.add('hidden');
        loadGallery(currentCategory);
        
    } catch (error) {
        showToast('Update failed', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Changes';
    }
});

// Delete image
async function deleteImage(id, title) {
    if (!confirmAction(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        await apiRequest(`/gallery/${id}`, { method: 'DELETE' });
        showToast('Image deleted successfully', 'success');
        loadGallery(currentCategory);
    } catch (error) {
        showToast('Failed to delete image', 'error');
    }
}

// Make functions global
window.editImage = editImage;
window.deleteImage = deleteImage;

// Load gallery on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
});
