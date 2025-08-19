// ============================================================
// FILE: notifications.js
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Data ---
    // In a real application, this would come from a server.
    const initialNotifications = [
        { id: 1, title: 'New Feature', message: 'You can now create QR codes for your articles.', read: false, timestamp: '2025-08-19T10:00:00Z' },
        { id: 2, title: 'Maintenance', message: 'The site will be down for maintenance this Friday at midnight.', read: false, timestamp: '2025-08-18T15:30:00Z' },
        { id: 3, title: 'Welcome!', message: 'Thanks for joining the Hajj Umra Expo community.', read: true, timestamp: '2025-08-17T12:00:00Z' },
        { id: 4, title: 'Gallery Update', message: 'New images from the latest event have been added.', read: false, timestamp: '2025-08-19T11:00:00Z' }
    ];

    // --- Helper Functions ---
    const getNotifications = () => {
        const notifications = localStorage.getItem('notifications');
        return notifications ? JSON.parse(notifications) : initialNotifications;
    };

    const saveNotifications = (notifications) => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    };
    
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };


    // --- Core Functions ---
    const updateNotificationCount = () => {
        const notifications = getNotifications();
        const unreadCount = notifications.filter(n => !n.read).length;
        const countBadge = document.getElementById('notification-count');
        
        if (countBadge) {
            if (unreadCount > 0) {
                countBadge.textContent = unreadCount;
                countBadge.classList.remove('hidden');
            } else {
                countBadge.classList.add('hidden');
            }
        }
    };

    const renderNotifications = () => {
        const notificationsList = document.getElementById('notifications-list');
        if (!notificationsList) return;

        const notifications = getNotifications().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        notificationsList.innerHTML = '';

        if (notifications.length === 0) {
            notificationsList.innerHTML = '<p class="no-notifications">You have no notifications.</p>';
            return;
        }

        notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
            item.dataset.id = notification.id;
            
            item.innerHTML = `
                <div class="notification-content">
                    <h3 class="notification-title">${notification.title}</h3>
                    <p class="notification-message">${notification.message}</p>
                </div>
                <div class="notification-meta">
                     <span class="notification-timestamp">${timeAgo(notification.timestamp)}</span>
                     <div class="notification-actions">
                        ${!notification.read ? '<span class="unread-dot"></span>' : ''}
                        <button class="delete-notification-btn" aria-label="Delete notification">&times;</button>
                     </div>
                </div>
            `;
            
            // Mark as read when the main item is clicked
            item.addEventListener('click', () => markAsRead(notification.id));

            // Delete when the delete button is clicked
            const deleteBtn = item.querySelector('.delete-notification-btn');
            deleteBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent the 'markAsRead' click from firing
                deleteNotification(notification.id);
            });

            notificationsList.appendChild(item);
        });
    };

    const markAsRead = (id) => {
        let notifications = getNotifications();
        const index = notifications.findIndex(n => n.id === id);
        if (index > -1 && !notifications[index].read) {
            notifications[index].read = true;
            saveNotifications(notifications);
            updateNotificationCount();
            if (document.getElementById('notifications-list')) {
                 renderNotifications();
            }
        }
    };

    const markAllAsRead = () => {
        let notifications = getNotifications();
        notifications.forEach(n => n.read = true);
        saveNotifications(notifications);
        updateNotificationCount();
        renderNotifications();
    };

    const deleteNotification = (id) => {
        let notifications = getNotifications();
        // Create a new array without the deleted notification
        const updatedNotifications = notifications.filter(n => n.id !== id);
        saveNotifications(updatedNotifications);
        updateNotificationCount();
        renderNotifications();
    };

    // --- Event Listeners ---
    const markAllReadBtn = document.getElementById('mark-all-read-btn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllAsRead);
    }
    
    // --- Initialization ---
    if (!localStorage.getItem('notifications')) {
        saveNotifications(initialNotifications);
    }

    updateNotificationCount();
    if (document.getElementById('notifications-list')) {
        renderNotifications();
    }
});
