let allBookings = [];
let currentBookingId = null;
let currentFilter = 'all';

// Load bookings
async function loadBookings() {
    try {
        const bookings = await apiRequest('/bookings');
        allBookings = bookings;
        
        displayBookings(bookings);
        
    } catch (error) {
        console.error('Failed to load bookings:', error);
        showToast('Failed to load bookings', 'error');
    }
}

// Display bookings based on filter
function displayBookings(bookings) {
    const tableBody = document.getElementById('bookings-table');
    const countEl = document.getElementById('bookings-count');
    
    // Filter bookings based on current filter
    let filteredBookings = bookings;
    if (currentFilter !== 'all') {
        filteredBookings = bookings.filter(b => (b.status || 'pending') === currentFilter);
    }
    
    if (!filteredBookings || filteredBookings.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                    No ${currentFilter !== 'all' ? currentFilter : ''} booking requests yet.
                </td>
            </tr>
        `;
        countEl.textContent = `0 Bookings`;
        return;
    }
    
    countEl.textContent = `${filteredBookings.length} Booking${filteredBookings.length !== 1 ? 's' : ''}`;
    
    tableBody.innerHTML = filteredBookings.map(booking => {
        const submittedDate = new Date(booking.createdAt).toLocaleDateString();
        const preferredDate = new Date(booking.date).toLocaleDateString();
        const statusColor = getStatusColor(booking.status);
        
        return `
            <tr>
                <td class="px-6 py-4 text-sm text-gray-900">${submittedDate}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">${booking.name}</td>
                <td class="px-6 py-4 text-sm text-gray-600">
                    <div>${booking.contact}</div>
                    ${booking.email ? `<div class="text-xs text-gray-500">${booking.email}</div>` : ''}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">${formatService(booking.service)}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${preferredDate}</td>
                <td class="px-6 py-4">
                    <select onchange="updateBookingStatus('${booking._id}', this.value)" 
                            class="px-2 py-1 text-xs rounded-full border-0 ${statusColor} cursor-pointer">
                        <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td class="px-6 py-4 text-sm">
                    <div class="flex gap-2">
                        <button onclick="viewBooking('${booking._id}')" 
                                class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                            View
                        </button>
                        <button onclick="deleteBooking('${booking._id}')" 
                                class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Format service name
function formatService(service) {
    const serviceNames = {
        'wig-styling': 'Wig Styling',
        'wig-coloring': 'Wig Coloring & Maintenance',
        'frontal-installation': 'Frontal & Closure Installation',
        'hair-treatment': 'Hair Treatments',
        'standard-makeup': 'Standard Makeup',
        'evening-makeup': 'Evening Makeup',
        'bridal-makeup': 'Bridal Makeup',
        'bridal-package': 'Bridal Party Package'
    };
    return serviceNames[service] || service;
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-green-100 text-green-800',
        'completed': 'bg-blue-100 text-blue-800',
        'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || colors['pending'];
}

// Update booking status
async function updateBookingStatus(id, newStatus) {
    try {
        await apiRequest(`/bookings/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus })
        });
        
        showToast(`Booking status updated to ${newStatus}`, 'success');
        loadBookings();
    } catch (error) {
        console.error('Status update error:', error);
        showToast('Failed to update booking status', 'error');
        loadBookings(); // Reload to reset the dropdown
    }
}

// View booking details
function viewBooking(id) {
    const booking = allBookings.find(b => b._id === id);
    if (!booking) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h3 class="text-2xl font-bold text-gray-800">Booking Details</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-medium text-gray-500">Name</label>
                        <p class="text-gray-900 font-medium">${booking.name}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">Status</label>
                        <p><span class="px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}">${booking.status || 'pending'}</span></p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">Phone</label>
                        <p class="text-gray-900">${booking.contact}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">Email</label>
                        <p class="text-gray-900">${booking.email || 'Not provided'}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">Service</label>
                        <p class="text-gray-900">${formatService(booking.service)}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">Preferred Date</label>
                        <p class="text-gray-900">${new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                    <div class="col-span-2">
                        <label class="text-sm font-medium text-gray-500">Submitted On</label>
                        <p class="text-gray-900">${new Date(booking.createdAt).toLocaleString()}</p>
                    </div>
                    ${booking.notes ? `
                        <div class="col-span-2">
                            <label class="text-sm font-medium text-gray-500">Additional Notes</label>
                            <p class="text-gray-900 bg-gray-50 p-3 rounded">${booking.notes}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="p-6 border-t bg-gray-50 flex justify-end gap-3">
                <button onclick="this.closest('.fixed').remove()" 
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                    Close
                </button>
                <a href="https://wa.me/${booking.contact.replace(/\D/g, '')}" target="_blank"
                   class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    Contact on WhatsApp
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Delete booking
async function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking?')) {
        return;
    }
    
    try {
        await apiRequest(`/bookings/${id}`, { method: 'DELETE' });
        showToast('Booking deleted successfully', 'success');
        loadBookings();
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Failed to delete booking', 'error');
    }
}

// Filter bookings by status
function filterBookings(status) {
    currentFilter = status;
    
    // Update tab styles
    document.querySelectorAll('.status-tab').forEach(tab => {
        if (tab.dataset.status === status) {
            tab.classList.add('border-pink-500', 'text-pink-600');
            tab.classList.remove('border-transparent', 'text-gray-600');
        } else {
            tab.classList.remove('border-pink-500', 'text-pink-600');
            tab.classList.add('border-transparent', 'text-gray-600');
        }
    });
    
    displayBookings(allBookings);
}

// Load bookings on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBookings();
});
