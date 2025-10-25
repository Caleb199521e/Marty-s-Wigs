// Load settings
async function loadSettings() {
    try {
        const settings = await apiRequest('/settings');
        
        if (settings) {
            // Hero Section
            document.getElementById('hero-title').value = settings.hero?.title || '';
            document.getElementById('hero-subtitle').value = settings.hero?.subtitle || '';
            
            if (settings.hero?.image) {
                document.getElementById('hero-image-preview-img').src = settings.hero.image;
                document.getElementById('hero-image-preview').classList.remove('hidden');
            }
            
            // Contact Information
            document.getElementById('phone').value = settings.contact?.phone || '';
            document.getElementById('whatsapp').value = settings.contact?.whatsapp || '';
            document.getElementById('email').value = settings.contact?.email || '';
            document.getElementById('address').value = settings.contact?.address || '';
            
            // Social Media
            document.getElementById('instagram').value = settings.social?.instagram || '';
            document.getElementById('tiktok').value = settings.social?.tiktok || '';
            document.getElementById('facebook').value = settings.social?.facebook || '';
            
            // About Section
            document.getElementById('about-title').value = settings.about?.title || '';
            document.getElementById('about-description').value = settings.about?.description || '';
            
            // Display about image if exists
            if (settings.about?.image) {
                document.getElementById('about-image-preview-img').src = settings.about.image;
                document.getElementById('about-image-preview').classList.remove('hidden');
            }
            
            // Business Hours
            document.getElementById('monday').value = settings.businessHours?.monday || '';
            document.getElementById('tuesday').value = settings.businessHours?.tuesday || '';
            document.getElementById('wednesday').value = settings.businessHours?.wednesday || '';
            document.getElementById('thursday').value = settings.businessHours?.thursday || '';
            document.getElementById('friday').value = settings.businessHours?.friday || '';
            document.getElementById('saturday').value = settings.businessHours?.saturday || '';
            document.getElementById('sunday').value = settings.businessHours?.sunday || '';
        }
    } catch (error) {
        console.error('Failed to load settings:', error);
        showMessage('Failed to load settings. Using default values.', 'error');
    }
}

// Upload hero image
document.getElementById('upload-hero-image-btn').addEventListener('click', async () => {
    const fileInput = document.getElementById('hero-image-upload');
    const file = fileInput.files[0];
    
    if (!file) {
        showToast('Please select an image first', 'error');
        return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB', 'error');
        return;
    }
    
    const uploadBtn = document.getElementById('upload-hero-image-btn');
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';
    
    try {
        const formData = new FormData();
        formData.append('image', file);
        
        // Upload to settings/hero-image endpoint (NOT gallery)
        const result = await uploadFile('/settings/hero-image', formData);
        
        // Update preview
        document.getElementById('hero-image-preview-img').src = result.imageUrl;
        document.getElementById('hero-image-preview').classList.remove('hidden');
        
        showToast('Hero image uploaded successfully!', 'success');
        fileInput.value = '';
        
    } catch (error) {
        console.error('Upload error:', error);
        showToast(error.message || 'Failed to upload hero image', 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload';
    }
});

// Remove hero image
document.getElementById('remove-hero-image-btn').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to remove the hero image?')) {
        return;
    }
    
    try {
        const settings = await apiRequest('/settings');
        if (settings.hero) {
            settings.hero.image = null;
        }
        
        await apiRequest('/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
        
        document.getElementById('hero-image-preview').classList.add('hidden');
        showToast('Hero image removed successfully!', 'success');
        
    } catch (error) {
        showToast('Failed to remove hero image', 'error');
    }
});

// Upload about image
document.getElementById('upload-about-image-btn').addEventListener('click', async () => {
    const fileInput = document.getElementById('about-image-upload');
    const file = fileInput.files[0];
    
    if (!file) {
        showToast('Please select an image first', 'error');
        return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB', 'error');
        return;
    }
    
    const uploadBtn = document.getElementById('upload-about-image-btn');
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';
    
    try {
        const formData = new FormData();
        formData.append('image', file);
        
        // Upload to settings/about-image endpoint
        const result = await uploadFile('/settings/about-image', formData);
        
        // Update preview
        document.getElementById('about-image-preview-img').src = result.imageUrl;
        document.getElementById('about-image-preview').classList.remove('hidden');
        
        showToast('About image uploaded successfully!', 'success');
        fileInput.value = '';
        
    } catch (error) {
        console.error('Upload error:', error);
        showToast(error.message || 'Failed to upload about image', 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload';
    }
});

// Remove about image
document.getElementById('remove-about-image-btn').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to remove the about image?')) {
        return;
    }
    
    try {
        const settings = await apiRequest('/settings');
        if (settings.about) {
            settings.about.image = null;
        }
        
        await apiRequest('/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
        
        document.getElementById('about-image-preview').classList.add('hidden');
        showToast('About image removed successfully!', 'success');
        
    } catch (error) {
        showToast('Failed to remove about image', 'error');
    }
});

// Save settings
document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const saveBtn = document.getElementById('save-settings');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
        // Get current settings to preserve hero and about images
        const currentSettings = await apiRequest('/settings');
        
        const data = {
            hero: {
                title: document.getElementById('hero-title').value.trim(),
                subtitle: document.getElementById('hero-subtitle').value.trim(),
                image: currentSettings.hero?.image || null
            },
            contact: {
                phone: document.getElementById('phone').value.trim(),
                whatsapp: document.getElementById('whatsapp').value.trim(),
                email: document.getElementById('email').value.trim(),
                address: document.getElementById('address').value.trim()
            },
            social: {
                instagram: document.getElementById('instagram').value.trim(),
                tiktok: document.getElementById('tiktok').value.trim(),
                facebook: document.getElementById('facebook').value.trim()
            },
            about: {
                title: document.getElementById('about-title').value.trim(),
                description: document.getElementById('about-description').value.trim(),
                image: currentSettings.about?.image || null
            },
            businessHours: {
                monday: document.getElementById('monday').value.trim(),
                tuesday: document.getElementById('tuesday').value.trim(),
                wednesday: document.getElementById('wednesday').value.trim(),
                thursday: document.getElementById('thursday').value.trim(),
                friday: document.getElementById('friday').value.trim(),
                saturday: document.getElementById('saturday').value.trim(),
                sunday: document.getElementById('sunday').value.trim()
            }
        };
        
        await apiRequest('/settings', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        
        showMessage('Settings saved successfully!', 'success');
        showToast('Settings saved successfully!', 'success');
        
    } catch (error) {
        showMessage('Failed to save settings. Please try again.', 'error');
        showToast('Failed to save settings', 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save All Settings';
    }
});

// Show message
function showMessage(message, type = 'success') {
    const messageEl = document.getElementById('settings-message');
    messageEl.textContent = message;
    messageEl.className = type === 'success' 
        ? 'p-4 rounded-lg bg-green-100 text-green-700' 
        : 'p-4 rounded-lg bg-red-100 text-red-700';
    messageEl.classList.remove('hidden');
    
    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 5000);
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});
