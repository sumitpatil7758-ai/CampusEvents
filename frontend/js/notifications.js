window.getRelativeTime = function(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffHours < 1) return `${diffMins} minutes ago`;
    if (diffDays < 1) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return window.formatDate(dateString);
};

window.loadNotifications = async function() {
    window.requireAuth();
    const container = document.getElementById('notificationsList');
    if (!container) return;
    
    container.innerHTML = '<div style="text-align:center;"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';
    
    try {
        const res = await window.authFetch('/notifications');
        if (res.ok) {
            const notifs = await res.json();
            if (notifs.length > 0) {
                container.innerHTML = notifs.map(n => `
                    <div class="notification-item ${n.is_read ? 'read' : 'unread'}">
                        <div class="notification-icon"><i class="fas fa-bell"></i></div>
                        <div class="notification-content">
                            <div class="notification-title">${n.title}</div>
                            <div class="notification-message">${n.message}</div>
                            <div class="notification-time">${window.getRelativeTime(n.created_at)}</div>
                        </div>
                        <div class="notification-actions">
                            ${!n.is_read ? `<button onclick="window.markAsRead('${n.id}')" class="btn btn-sm btn-secondary">Mark Read</button>` : ''}
                            <button onclick="window.deleteNotification('${n.id}')" class="btn btn-sm btn-danger">Delete</button>
                        </div>
                    </div>
                `).join('');
            } else {
                container.innerHTML = '<div style="text-align:center; padding:20px;">No notifications.</div>';
            }
        }
    } catch (e) {
        container.innerHTML = '<div style="text-align:center; color:red;">Failed to load notifications.</div>';
    }
};

window.markAsRead = async function(notifId) {
    try {
        const res = await window.authFetch(`/notifications/${notifId}/read`, { method: 'PUT' });
        if (res.ok) {
            window.loadNotifications();
        }
    } catch (e) {
        window.showAlert('Error marking as read', 'danger');
    }
};

window.markAllAsRead = async function() {
    try {
        const res = await window.authFetch('/notifications/read-all', { method: 'PUT' });
        if (res.ok) {
            window.loadNotifications();
        }
    } catch (e) {
        window.showAlert('Error marking all as read', 'danger');
    }
};

window.deleteNotification = async function(notifId) {
    if (!confirm('Delete this notification?')) return;
    try {
        const res = await window.authFetch(`/notifications/${notifId}`, { method: 'DELETE' });
        if (res.ok) {
            window.loadNotifications();
        }
    } catch (e) {
        window.showAlert('Error deleting notification', 'danger');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('notifications.html')) {
        window.loadNotifications();
        
        const markAllBtn = document.getElementById('markAllReadBtn');
        if (markAllBtn) {
            markAllBtn.addEventListener('click', window.markAllAsRead);
        }
    }
});
