let allBookings = [];
let currentBookingId = null;

// Load bookings
async function loadBookings() {
    try {
        const bookings = await apiRequest('/bookings');
        allBookings = bookings;
        
        updateStats(bookings);
        renderBookings(bookings);
    } catch (error) {
        console.error('Failed to load bookings:', error);
        showToast('Failed to load bookings', 'error');
    }
}

// Update statistics
function updateStats(bookings) {
    document.getElementById('total-bookings').textContent = bookings.length;
    document.getElementById('pending-count').textContent = bookings.filter(b => b.status === 'pending').length;
    document.getElementById('confirmed-count').textContent = bookings.filter(b => b.status === 'confirmed').length;
    document.getElementById('completed-count').textContent = bookings.filter(b => b.status === 'completed').length;
}

// Render bookings table
function renderBookings(bookings) {
    const tbody = document.getElementById('bookings-table');
    
    if (bookings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-12 text-gray-500">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p>No bookings found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => `
        <tr class="border-b hover:bg-gray-50 cursor-pointer" onclick="viewBooking('${booking._id}')">
            <td class="py-4 px-6">
                <div>
                    <p class="font-medium text-gray-800">${booking.name}</p>
                    <p class="text-sm text-gray-500">${booking.email || 'No email'}</p>
                </div>
            </td>
            <td class="py-4 px-6 text-gray-600">${booking.contact}</td>
            <td class="py-4 px-6">
                <span class="text-sm">${formatService(booking.service)}</span>
            </td>
            <td class="py-4 px-6 text-gray-600">${formatDate(booking.date)}</td>
            <td class="py-4 px-6">
                <span class="px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}">
                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
            </td>
            <td class="py-4 px-6">
                <button 
                    onclick="event.stopPropagation(); viewBooking('${booking._id}')"
                    class="text-pink-600 hover:text-pink-700 font-medium"
                >
                    View
                </button>
            </td>
        </tr>
    `).join('');
}

// Format service name
function formatService(service) {
    const services = {
        'wig-styling': 'Personalized Wig Styling',
        'wig-coloring': 'Wig Coloring & Maintenance',
        'frontal-installation': 'Frontal & Closure Installation',
        'hair-treatment': 'Hair Treatments & Revamping',
        'standard-makeup': 'Standard Makeup',
        'evening-makeup': 'Evening & Photoshoot Makeup',
        'bridal-makeup': 'Bridal Makeup',
        'bridal-package': 'Bridal Party Package'
    };
    return services[service] || service;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-green-100 text-green-800',
        'completed': 'bg-blue-100 text-blue-800',
        'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

// View booking details
function viewBooking(id) {
    const booking = allBookings.find(b => b._id === id);
    if (!booking) return;
    
    currentBookingId = id;
    
    // Populate modal
    document.getElementById('modal-name').textContent = booking.name;
    document.getElementById('modal-contact').textContent = booking.contact;
    document.getElementById('modal-email').textContent = booking.email || 'Not provided';
    document.getElementById('modal-service').textContent = formatService(booking.service);
    document.getElementById('modal-date').textContent = formatDate(booking.date);
    document.getElementById('modal-notes').textContent = booking.notes || 'No special requests';
    document.getElementById('modal-status').value = booking.status;
    document.getElementById('modal-admin-notes').value = booking.adminNotes || '';
    
    // Update contact links
    document.getElementById('whatsapp-contact').href = `https://wa.me/${booking.contact.replace(/\D/g, '')}`;
    document.getElementById('call-contact').href = `tel:${booking.contact}`;
    
    // Show modal
    document.getElementById('booking-modal').classList.remove('hidden');
}

// Close modal
document.getElementById('close-booking-modal').addEventListener('click', () => {
    document.getElementById('booking-modal').classList.add('hidden');
    currentBookingId = null;
});

// Save booking changes
document.getElementById('save-booking').addEventListener('click', async () => {
    if (!currentBookingId) return;
    
    const saveBtn = document.getElementById('save-booking');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
        const data = {
            status: document.getElementById('modal-status').value,
            adminNotes: document.getElementById('modal-admin-notes').value
        };
        
        await apiRequest(`/bookings/${currentBookingId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        
        showToast('Booking updated successfully', 'success');
        document.getElementById('booking-modal').classList.add('hidden');
        loadBookings();
    } catch (error) {
        showToast('Failed to update booking', 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
    }
});

// Delete booking
document.getElementById('delete-booking').addEventListener('click', async () => {
    if (!currentBookingId) return;
    
    if (!confirmAction('Are you sure you want to delete this booking? This action cannot be undone.')) {
        return;
    }
    
    try {
        await apiRequest(`/bookings/${currentBookingId}`, { method: 'DELETE' });
        showToast('Booking deleted successfully', 'success');
        document.getElementById('booking-modal').classList.add('hidden');
        loadBookings();
    } catch (error) {
        showToast('Failed to delete booking', 'error');
    }
});

// Filter by date
document.getElementById('date-filter').addEventListener('change', function() {
    const date = this.value;
    const status = document.getElementById('status-filter').value;
    filterBookings(date, status);
});

// Filter by status
document.getElementById('status-filter').addEventListener('change', function() {
    const status = this.value;
    const date = document.getElementById('date-filter').value;
    filterBookings(date, status);
});

// Filter bookings
function filterBookings(date, status) {
    let filtered = [...allBookings];
    
    if (date) {
        filtered = filtered.filter(b => {
            const bookingDate = new Date(b.date).toISOString().split('T')[0];
            return bookingDate === date;
        });
    }
    
    if (status) {
        filtered = filtered.filter(b => b.status === status);
    }
    
    renderBookings(filtered);
}

// Make function global
window.viewBooking = viewBooking;

// Load bookings on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBookings();
});
