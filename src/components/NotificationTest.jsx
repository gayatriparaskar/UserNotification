import React, { useState } from 'react';
import { Bell, BellOff, Wifi, WifiOff, TestTube } from 'lucide-react';
import notificationService from '../services/notificationService';

const NotificationTest = () => {
  const [permissionStatus, setPermissionStatus] = useState(Notification.permission);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const granted = await notificationService.requestPermission();
      setPermissionStatus(Notification.permission);
      if (granted) {
        console.log('Notification permission granted');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToPush = async () => {
    setIsLoading(true);
    try {
      const subscription = await notificationService.subscribeToPush();
      if (subscription) {
        setIsSubscribed(true);
        console.log('Successfully subscribed to push notifications');
      }
    } catch (error) {
      console.error('Error subscribing to push:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setIsLoading(true);
    try {
      const success = await notificationService.unsubscribeFromPush();
      if (success) {
        setIsSubscribed(false);
        console.log('Successfully unsubscribed from push notifications');
      }
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testNotification = async () => {
    try {
      await notificationService.testNotification();
    } catch (error) {
      console.error('Error testing notification:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <TestTube className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Notification Testing</h2>
      </div>

      <div className="space-y-6">
        {/* Permission Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {permissionStatus === 'granted' ? (
              <Bell className="h-5 w-5 text-green-600" />
            ) : (
              <BellOff className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="font-medium text-gray-900">Notification Permission</p>
              <p className="text-sm text-gray-600 capitalize">{permissionStatus}</p>
            </div>
          </div>
          {permissionStatus !== 'granted' && (
            <button
              onClick={requestPermission}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Requesting...' : 'Request Permission'}
            </button>
          )}
        </div>

        {/* Push Subscription Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {isSubscribed ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-600">
                {isSubscribed ? 'Subscribed' : 'Not Subscribed'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isSubscribed ? (
              <button
                onClick={subscribeToPush}
                disabled={isLoading || permissionStatus !== 'granted'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            ) : (
              <button
                onClick={unsubscribeFromPush}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
              </button>
            )}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-3">
          <button
            onClick={testNotification}
            disabled={permissionStatus !== 'granted'}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Bell className="h-5 w-5" />
            <span>Test Browser Notification</span>
          </button>

          <div className="text-sm text-gray-600 text-center">
            <p>Test notifications to ensure they work properly on your device</p>
            <p className="mt-1">Make sure to allow notifications when prompted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTest;

