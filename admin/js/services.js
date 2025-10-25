let allServices = [];
let currentCategory = 'all';
let currentServiceId = null;
let features = [];

// Load services
async function loadServices() {
    try {
        const services = await apiRequest('/services');
        allServices = services;
        renderServices(services);
    } catch (error) {
        console.error('Failed to load services:', error);
        showToast('Failed to load services', 'error');
        document.getElementById('services-container').innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-600">Failed to load services. Please refresh the page.</p>
            </div>
        `;
    }
}

// Render services
function renderServices(services) {
    const container = document.getElementById('services-container');
    
    // Filter by category
    const filtered = currentCategory === 'all' ? services : services.filter(s => s.category === currentCategory);
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <p class="text-gray-600">No services found</p>
                <button onclick="document.getElementById('add-service-btn').click()" class="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
                    Add First Service
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(service => `
        <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-xl font-bold text-gray-800">${service.name}</h3>
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${
                            service.category === 'wig' ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800'
                        }">
                            ${service.category === 'wig' ? 'Wig Service' : 'Makeup Service'}
                        </span>
                        ${!service.active ? '<span class="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Inactive</span>' : ''}
                    </div>
                    <p class="text-gray-600 mb-4">${service.description}</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        ${service.priceRange && (service.priceRange.min || service.priceRange.max) ? `
                            <div>
                                <p class="text-sm text-gray-500">Price Range</p>
                                <p class="font-medium text-gray-800">
                                    $${service.priceRange.min || '0'} - $${service.priceRange.max || '0'}
                                </p>
                            </div>
                        ` : ''}
                        ${service.priceNote ? `
                            <div>
                                <p class="text-sm text-gray-500">Pricing Note</p>
                                <p class="font-medium text-gray-800">${service.priceNote}</p>
                            </div>
                        ` : ''}
                        ${service.duration ? `
                            <div>
                                <p class="text-sm text-gray-500">Duration</p>
                                <p class="font-medium text-gray-800">${service.duration}</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    ${service.features && service.features.length > 0 ? `
                        <div>
                            <p class="text-sm text-gray-500 mb-2">What's Included:</p>
                            <ul class="list-disc list-inside text-gray-600 space-y-1">
                                ${service.features.map(f => `<li>${f}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                <div class="flex gap-2 ml-4">
                    <button 
                        onclick="editService('${service._id}')"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button 
                        onclick="deleteService('${service._id}', '${service.name}')"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Category filter
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        currentCategory = this.dataset.category;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(b => {
            b.classList.remove('bg-pink-600', 'text-white');
            b.classList.add('bg-gray-200', 'text-gray-700');
        });
        this.classList.remove('bg-gray-200', 'text-gray-700');
        this.classList.add('bg-pink-600', 'text-white');
        
        renderServices(allServices);
    });
});

// Modal controls
const modal = document.getElementById('service-modal');
const addBtn = document.getElementById('add-service-btn');
const closeBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-service');

addBtn.addEventListener('click', () => openModal());
closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

// Open modal (add or edit)
function openModal(service = null) {
    currentServiceId = service ? service._id : null;
    features = service && service.features ? [...service.features] : [];
    
    document.getElementById('modal-title').textContent = service ? 'Edit Service' : 'Add Service';
    document.getElementById('service-id').value = service ? service._id : '';
    document.getElementById('service-name').value = service ? service.name : '';
    document.getElementById('service-category').value = service ? service.category : '';
    document.getElementById('service-description').value = service ? service.description : '';
    document.getElementById('price-min').value = service && service.priceRange ? service.priceRange.min || '' : '';
    document.getElementById('price-max').value = service && service.priceRange ? service.priceRange.max || '' : '';
    document.getElementById('price-note').value = service ? service.priceNote || '' : '';
    document.getElementById('duration').value = service ? service.duration || '' : '';
    document.getElementById('service-active').checked = service ? service.active : true;
    
    renderFeatures();
    modal.classList.remove('hidden');
}

// Features management
function renderFeatures() {
    const container = document.getElementById('features-container');
    container.innerHTML = features.map((feature, index) => `
        <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
            <span class="flex-1 text-gray-700">${feature}</span>
            <button 
                type="button"
                onclick="removeFeature(${index})"
                class="text-red-600 hover:text-red-700"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

document.getElementById('add-feature-btn').addEventListener('click', () => {
    const input = document.getElementById('new-feature');
    const value = input.value.trim();
    
    if (value) {
        features.push(value);
        renderFeatures();
        input.value = '';
    }
});

// Allow Enter key to add feature
document.getElementById('new-feature').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('add-feature-btn').click();
    }
});

function removeFeature(index) {
    features.splice(index, 1);
    renderFeatures();
}

// Form submission
document.getElementById('service-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-service');
    const errorDiv = document.getElementById('service-error');
    
    errorDiv.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
        const data = {
            name: document.getElementById('service-name').value.trim(),
            category: document.getElementById('service-category').value,
            description: document.getElementById('service-description').value.trim(),
            priceRange: {
                min: parseFloat(document.getElementById('price-min').value) || null,
                max: parseFloat(document.getElementById('price-max').value) || null
            },
            priceNote: document.getElementById('price-note').value.trim() || null,
            duration: document.getElementById('duration').value.trim() || null,
            features: features,
            active: document.getElementById('service-active').checked
        };
        
        if (currentServiceId) {
            // Update existing service
            await apiRequest(`/services/${currentServiceId}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            showToast('Service updated successfully', 'success');
        } else {
            // Create new service
            await apiRequest('/services', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            showToast('Service created successfully', 'success');
        }
        
        modal.classList.add('hidden');
        document.getElementById('service-form').reset();
        features = [];
        loadServices();
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
        showToast('Failed to save service', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Service';
    }
});

// Edit service
async function editService(id) {
    const service = allServices.find(s => s._id === id);
    if (service) {
        openModal(service);
    }
}

// Delete service
async function deleteService(id, name) {
    if (!confirmAction(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        await apiRequest(`/services/${id}`, { method: 'DELETE' });
        showToast('Service deleted successfully', 'success');
        loadServices();
    } catch (error) {
        showToast('Failed to delete service', 'error');
    }
}

// Make functions global
window.editService = editService;
window.deleteService = deleteService;
window.removeFeature = removeFeature;

// Load services on page load
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
});
