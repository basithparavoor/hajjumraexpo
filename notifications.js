// ============================================================
// FILE: notifications.js
// Handles notification logic, now using notification-data.js
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- Helper Functions ---
    const getStoredNotifications = () => {
        const notifications = localStorage.getItem('notifications');
        return notifications ? JSON.parse(notifications) : [];
    };

    const saveNotifications = (notifications) => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    };

    // --- Core Data Initialization ---
    const initializeNotifications = () => {
        const staticNotifications = typeof getAllNotifications === 'function' ? getAllNotifications() : [];
        let storedNotifications = getStoredNotifications();
        
        // Create a map of stored notifications for quick lookup
        const storedIds = new Map(storedNotifications.map(n => [n.id, n]));

        // Merge static notifications with stored ones
        // This adds new notifications from the data file without overwriting user's read/deleted status
        const mergedNotifications = staticNotifications.map(staticNotif => {
            const storedNotif = storedIds.get(staticNotif.id);
            if (storedNotif) {
                // If notification exists in storage, keep its read status
                return { ...staticNotif, read: storedNotif.read };
            }
            // Otherwise, it's a new notification
            return staticNotif;
        });

        saveNotifications(mergedNotifications);
        return mergedNotifications;
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

    // --- UI Functions ---
    const updateNotificationCount = () => {
        const notifications = getStoredNotifications();
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

        const notifications = getStoredNotifications().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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
            
            item.querySelector('.notification-content').addEventListener('click', () => markAsRead(notification.id));
            
            const deleteBtn = item.querySelector('.delete-notification-btn');
            deleteBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                deleteNotification(notification.id);
            });

            notificationsList.appendChild(item);
        });
    };

    const markAsRead = (id) => {
        let notifications = getStoredNotifications();
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
        let notifications = getStoredNotifications();
        notifications.forEach(n => n.read = true);
        saveNotifications(notifications);
        updateNotificationCount();
        renderNotifications();
    };

    const deleteNotification = (id) => {
        let notifications = getStoredNotifications();
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
    initializeNotifications();
    updateNotificationCount();
    if (document.getElementById('notifications-list')) {
        renderNotifications();
    }
});