// Load dashboard stats
async function loadDashboardStats() {
    try {
        const bookings = await apiRequest('/bookings');
        
        // Calculate stats
        const total = bookings.length;
        const pending = bookings.filter(b => b.status === 'pending' || !b.status).length;
        const confirmed = bookings.filter(b => b.status === 'confirmed').length;
        const completed = bookings.filter(b => b.status === 'completed').length;
        
        // Update stat cards
        document.getElementById('total-bookings').textContent = total;
        document.getElementById('pending-bookings').textContent = pending;
        document.getElementById('confirmed-bookings').textContent = confirmed;
        document.getElementById('completed-bookings').textContent = completed;
        
        // Load recent bookings
        loadRecentBookings(bookings);
        
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}

// Load recent bookings
function loadRecentBookings(bookings) {
    const tableBody = document.getElementById('recent-bookings');
    
    if (!bookings || bookings.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-4 py-8 text-center text-gray-500">No bookings yet</td>
            </tr>
        `;
        return;
    }
    
    // Sort by date and get latest 5
    const recent = bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    
    tableBody.innerHTML = recent.map(booking => {
        const statusColor = getStatusColor(booking.status);
        return `
            <tr>
                <td class="px-4 py-3 text-sm text-gray-900">${booking.name}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${formatService(booking.service)}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${new Date(booking.date).toLocaleDateString()}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 text-xs rounded-full ${statusColor}">
                        ${booking.status || 'pending'}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

// Helper functions
function formatService(service) {
    const serviceNames = {
        'wig-styling': 'Wig Styling',
        'wig-coloring': 'Wig Coloring',
        'frontal-installation': 'Frontal Installation',
        'hair-treatment': 'Hair Treatment',
        'standard-makeup': 'Standard Makeup',
        'evening-makeup': 'Evening Makeup',
        'bridal-makeup': 'Bridal Makeup',
        'bridal-package': 'Bridal Package'
    };
    return serviceNames[service] || service;
}

function getStatusColor(status) {
    const colors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-green-100 text-green-800',
        'completed': 'bg-purple-100 text-purple-800',
        'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || colors['pending'];
}

// Load on page ready
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
});
