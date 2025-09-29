import React, { useState } from 'react';
import { Bell, TestTube, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import notificationService from '../services/notificationService';

const NotificationTestButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(Notification.permission);
  const { user } = useAuth();

  const requestPermission = async () => {
    try {
      const granted = await notificationService.requestPermission();
      setPermissionStatus(Notification.permission);
      if (granted) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const sendTestNotification = async () => {
    if (!user) {
      console.log('No user logged in');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Sending test notification for user:', user._id || user.id);
      console.log('API Base URL:', apiService.baseURL);
      
      const response = await apiService.post('/test-notification', {
        userId: user._id || user.id,
        message: 'Test notification from frontend'
      });
      
      console.log('Test notification response:', response);
      
      if (response.success) {
        console.log('Test notification sent successfully');
      } else {
        console.error('Failed to send test notification:', response.message);
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <TestTube className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Test Real-time Notifications</h3>
      </div>
      
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Notification Permission</span>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Status: <span className={`font-medium ${permissionStatus === 'granted' ? 'text-green-600' : 'text-red-600'}`}>
            {permissionStatus}
          </span>
        </p>
        {permissionStatus !== 'granted' && (
          <button
            onClick={requestPermission}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Shield className="h-4 w-4" />
            <span>Request Permission</span>
          </button>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">
        Click the button below to send a test notification to yourself. This will test the real-time notification system.
      </p>
      
      <button
        onClick={sendTestNotification}
        disabled={isLoading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
      >
        <Bell className="h-5 w-5" />
        <span>{isLoading ? 'Sending...' : 'Send Test Notification'}</span>
      </button>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>This will test:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Real-time notification delivery</li>
          <li>Notification sound playback</li>
          <li>Unread count update</li>
          <li>Socket.IO connection</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationTestButton;
