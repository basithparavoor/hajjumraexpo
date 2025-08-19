// ============================================================
// FILE: notifications.js
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const notificationsList = document.getElementById('notifications-list');

    if (!notificationsList || typeof notifications === 'undefined' || notifications.length === 0) {
        notificationsList.innerHTML = '<p class="no-notifications">You have no new notifications.</p>';
        return;
    }

    // Sort notifications to show unread ones first, then by most recent
    const sortedNotifications = notifications.sort((a, b) => {
        if (a.status === 'unread' && b.status === 'read') return -1;
        if (a.status === 'read' && b.status === 'unread') return 1;
        // If statuses are the same, we can add date-based sorting in the future
        return 0;
    });


    sortedNotifications.forEach(notification => {
        const notificationItem = document.createElement(notification.link ? 'a' : 'div');
        notificationItem.className = `notification-item ${notification.status} type-${notification.type}`;
        if (notification.link) {
            notificationItem.href = notification.link;
        }

        // Map notification type to an icon
        const getIcon = (type) => {
            switch (type) {
                case 'new-article':
                    return '📄'; // Document icon
                case 'maintenance':
                    return '⚙️'; // Gear icon
                case 'announcement':
                    return '📢'; // Megaphone icon
                default:
                    return '🔔'; // Bell icon
            }
        };

        notificationItem.innerHTML = `
            <div class="notification-icon">${getIcon(notification.type)}</div>
            <div class="notification-content">
                <div class="notification-header">
                    <h3 class="notification-title">${notification.title}</h3>
                    <span class="notification-timestamp">${notification.timestamp}</span>
                </div>
                <p class="notification-summary">${notification.summary}</p>
            </div>
        `;
        
        notificationsList.appendChild(notificationItem);
    });
});