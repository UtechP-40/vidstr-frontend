import React from 'react';

const Notifications = () => {
  // Mock notifications array
  const notifications = [
    {
      id: 1,
      type: "COMMENT",
      content: "John commented on your video",
      createdAt: new Date(),
      isRead: false
    },
    {
      id: 2,
      type: "LIKE",
      content: "Sarah liked your video",
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: true
    },
    {
      id: 3,
      type: "SUBSCRIPTION",
      content: "Alex subscribed to your channel",
      createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      isRead: false
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'COMMENT':
        return '💬';
      case 'LIKE':
        return '❤️';
      case 'SUBSCRIPTION':
        return '🔔';
      case 'VIDEO_UPLOAD':
        return '🎥';
      default:
        return '📩';
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg w-80">
      <div className="p-4 border-b border-border sticky top-0 bg-background z-10">
        <h3 className="font-semibold text-lg">Notifications</h3>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', '::-webkit-scrollbar': { display: 'none' } }}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-4 border-b border-border hover:bg-accent/50 transition-colors cursor-pointer
                ${notification.isRead ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0"></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-3 text-center border-t border-border sticky bottom-0 bg-background">
          <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;