import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../redux/features/notification.slice';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector(state => state.notifications);

  useEffect(() => {
    dispatch(getUserNotifications());
  }, [dispatch]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
      // Optional: Refresh notifications after marking all as read
      dispatch(getUserNotifications());
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      // Optional: Show error to user
      alert('Failed to mark all notifications as read');
    }
  };

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

  if (loading) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg w-80 p-4 text-center">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg w-80 p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg w-80">
      <div className="p-4 border-b border-border sticky top-0 bg-background z-10">
        <h3 className="font-semibold text-lg">Notifications</h3>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', '::-webkit-scrollbar': { display: 'none' } }}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification._id}
              className={`p-4 border-b border-border hover:bg-accent/50 transition-colors cursor-pointer
                ${notification.isRead ? 'opacity-60' : ''}`}
              onClick={() => handleMarkAsRead(notification._id)}
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
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
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
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;