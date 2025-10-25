let allTestimonials = [];
let currentFilter = 'all';
let currentTestimonialId = null;
let selectedRating = 5;

// Load testimonials
async function loadTestimonials() {
    try {
        const testimonials = await apiRequest('/testimonials');
        allTestimonials = testimonials;
        
        updateCounts(testimonials);
        renderTestimonials(testimonials);
    } catch (error) {
        console.error('Failed to load testimonials:', error);
        showToast('Failed to load testimonials', 'error');
        document.getElementById('testimonials-container').innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-red-600">Failed to load testimonials. Please refresh the page.</p>
            </div>
        `;
    }
}

// Update counts
function updateCounts(testimonials) {
    document.getElementById('count-all').textContent = testimonials.length;
    document.getElementById('count-approved').textContent = testimonials.filter(t => t.approved).length;
    document.getElementById('count-pending').textContent = testimonials.filter(t => !t.approved).length;
    document.getElementById('count-featured').textContent = testimonials.filter(t => t.featured).length;
}

// Render testimonials
function renderTestimonials(testimonials) {
    const container = document.getElementById('testimonials-container');
    
    // Filter testimonials
    let filtered = [...testimonials];
    if (currentFilter === 'approved') {
        filtered = filtered.filter(t => t.approved);
    } else if (currentFilter === 'pending') {
        filtered = filtered.filter(t => !t.approved);
    } else if (currentFilter === 'featured') {
        filtered = filtered.filter(t => t.featured);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
                <p class="text-gray-600">No testimonials found</p>
                <button onclick="document.getElementById('add-testimonial-btn').click()" class="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
                    Add First Testimonial
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(testimonial => `
        <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center">
                    <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3">
                        ${testimonial.clientImage ? 
                            `<img src="${testimonial.clientImage}" alt="${testimonial.clientName}" class="w-full h-full object-cover">` :
                            `<div class="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
                                ${testimonial.clientName.charAt(0).toUpperCase()}
                            </div>`
                        }
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-800">${testimonial.clientName}</h4>
                        <div class="flex text-yellow-400 text-sm">
                            ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button 
                        onclick="editTestimonial('${testimonial._id}')"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button 
                        onclick="deleteTestimonial('${testimonial._id}', '${testimonial.clientName}')"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <p class="text-gray-600 mb-4 italic">"${testimonial.comment}"</p>
            
            ${testimonial.service ? `
                <p class="text-sm text-gray-500 mb-3">Service: ${testimonial.service}</p>
            ` : ''}
            
            <div class="flex gap-2 flex-wrap">
                ${testimonial.approved ? 
                    '<span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>' :
                    '<span class="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>'
                }
                ${testimonial.featured ? 
                    '<span class="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">★ Featured</span>' :
                    ''
                }
            </div>
        </div>
    `).join('');
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        currentFilter = this.dataset.filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('bg-pink-600', 'text-white');
            b.classList.add('bg-gray-200', 'text-gray-700');
        });
        this.classList.remove('bg-gray-200', 'text-gray-700');
        this.classList.add('bg-pink-600', 'text-white');
        
        renderTestimonials(allTestimonials);
    });
});

// Modal controls
const modal = document.getElementById('testimonial-modal');
const addBtn = document.getElementById('add-testimonial-btn');
const closeBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-testimonial');

addBtn.addEventListener('click', () => openModal());
closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

// Star rating
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('rating');

stars.forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = parseInt(this.dataset.rating);
        ratingInput.value = selectedRating;
        updateStars();
    });
});

function updateStars() {
    stars.forEach(star => {
        const rating = parseInt(star.dataset.rating);
        if (rating <= selectedRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Open modal
function openModal(testimonial = null) {
    currentTestimonialId = testimonial ? testimonial._id : null;
    selectedRating = testimonial ? testimonial.rating : 5;
    
    document.getElementById('modal-title').textContent = testimonial ? 'Edit Testimonial' : 'Add Testimonial';
    document.getElementById('testimonial-id').value = testimonial ? testimonial._id : '';
    document.getElementById('client-name').value = testimonial ? testimonial.clientName : '';
    document.getElementById('comment').value = testimonial ? testimonial.comment : '';
    document.getElementById('service').value = testimonial ? testimonial.service || '' : '';
    document.getElementById('rating').value = selectedRating;
    document.getElementById('approved').checked = testimonial ? testimonial.approved : true;
    document.getElementById('featured').checked = testimonial ? testimonial.featured || false : false;
    
    updateStars();
    modal.classList.remove('hidden');
}

// Form submission
document.getElementById('testimonial-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-testimonial');
    const errorDiv = document.getElementById('testimonial-error');
    
    errorDiv.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
        const imageFile = document.getElementById('client-image').files[0];
        let imageUrl = null;
        
        // Upload image if provided
        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('title', 'client-photo');
            formData.append('category', 'testimonials');
            
            const uploadResult = await uploadFile('/gallery', formData);
            imageUrl = uploadResult.imageUrl;
        }
        
        const data = {
            clientName: document.getElementById('client-name').value.trim(),
            rating: parseInt(document.getElementById('rating').value),
            comment: document.getElementById('comment').value.trim(),
            service: document.getElementById('service').value.trim() || null,
            approved: document.getElementById('approved').checked,
            featured: document.getElementById('featured').checked
        };
        
        if (imageUrl) {
            data.clientImage = imageUrl;
        }
        
        if (currentTestimonialId) {
            // Update existing testimonial
            await apiRequest(`/testimonials/${currentTestimonialId}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            showToast('Testimonial updated successfully', 'success');
        } else {
            // Create new testimonial
            await apiRequest('/testimonials', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            showToast('Testimonial created successfully', 'success');
        }
        
        modal.classList.add('hidden');
        document.getElementById('testimonial-form').reset();
        document.getElementById('client-image').value = '';
        selectedRating = 5;
        updateStars();
        loadTestimonials();
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
        showToast('Failed to save testimonial', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Testimonial';
    }
});

// Edit testimonial
async function editTestimonial(id) {
    const testimonial = allTestimonials.find(t => t._id === id);
    if (testimonial) {
        openModal(testimonial);
    }
}

// Delete testimonial
async function deleteTestimonial(id, clientName) {
    if (!confirmAction(`Are you sure you want to delete the testimonial from "${clientName}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        await apiRequest(`/testimonials/${id}`, { method: 'DELETE' });
        showToast('Testimonial deleted successfully', 'success');
        loadTestimonials();
    } catch (error) {
        showToast('Failed to delete testimonial', 'error');
    }
}

// Make functions global
window.editTestimonial = editTestimonial;
window.deleteTestimonial = deleteTestimonial;

// Load testimonials on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTestimonials();
    updateStars(); // Initialize stars
});
