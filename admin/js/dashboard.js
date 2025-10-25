async function loadDashboardStats() {
    try {
        // Load all stats
        const [bookings, gallery, testimonials] = await Promise.all([
            apiRequest('/bookings'),
            apiRequest('/gallery'),
            apiRequest('/testimonials')
        ]);
        
        // Update stats
        document.getElementById('total-bookings').textContent = bookings.length;
        document.getElementById('total-gallery').textContent = gallery.length;
        document.getElementById('total-testimonials').textContent = testimonials.length;
        
        // Count pending bookings
        const pending = bookings.filter(b => b.status === 'pending').length;
        document.getElementById('pending-bookings').textContent = pending;
        
        // Load recent bookings
        loadRecentBookings(bookings);
        
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

function loadRecentBookings(bookings) {
    const tbody = document.getElementById('recent-bookings');
    
    if (bookings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-8 text-gray-500">
                    No bookings yet
                </td>
            </tr>
        `;
        return;
    }
    
    // Show latest 5 bookings
    const recent = bookings.slice(0, 5);
    
    tbody.innerHTML = recent.map(booking => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${booking.name}</td>
            <td class="py-3 px-4">${booking.service}</td>
            <td class="py-3 px-4">${new Date(booking.date).toLocaleDateString()}</td>
            <td class="py-3 px-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                }">
                    ${booking.status}
                </span>
            </td>
            <td class="py-3 px-4">
                <a href="bookings.html?id=${booking._id}" class="text-pink-600 hover:text-pink-700">
                    View
                </a>
            </td>
        </tr>
    `).join('');
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
});
