import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Smartphone, Wifi, WifiOff, TestTube, AlertCircle, CheckCircle } from 'lucide-react';
import mobileNotificationService from '../services/mobileNotificationService';

const MobileNotificationTest = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    // Detect mobile
    const userAgent = navigator.userAgent;
    const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobile);
    
    // Get permission status
    setPermissionStatus(Notification.permission);
  }, []);

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const granted = await mobileNotificationService.requestPermission();
      setPermissionStatus(Notification.permission);
      
      addTestResult(
        granted ? 'Permission granted successfully' : 'Permission denied',
        granted ? 'success' : 'error'
      );
    } catch (error) {
      addTestResult(`Error requesting permission: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const testNotification = async () => {
    setIsLoading(true);
    try {
      const success = await mobileNotificationService.testMobileNotification();
      
      addTestResult(
        success ? 'Test notification sent successfully' : 'Failed to send test notification',
        success ? 'success' : 'error'
      );
    } catch (error) {
      addTestResult(`Error testing notification: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const testRealTimeNotification = async () => {
    setIsLoading(true);
    try {
      const success = await mobileNotificationService.showNotification('Real-time Test', {
        body: 'This is a real-time notification test for mobile',
        tag: 'realtime-test',
        data: { url: '/dashboard' }
      });
      
      addTestResult(
        success ? 'Real-time notification sent successfully' : 'Failed to send real-time notification',
        success ? 'success' : 'error'
      );
    } catch (error) {
      addTestResult(`Error testing real-time notification: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addTestResult = (message, type) => {
    const result = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
  };

  const getStatusIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'denied':
        return <BellOff className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'Notifications Enabled';
      case 'denied':
        return 'Notifications Blocked';
      default:
        return 'Permission Required';
    }
  };

  if (!isMobile) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Monitor className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Desktop Mode</h3>
        </div>
        <p className="text-gray-600">
          This test is designed for mobile devices. Please open this page on a mobile device to test mobile notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Smartphone className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Mobile Notification Test</h3>
      </div>

      {/* Status */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <p className="font-medium text-gray-900">{getStatusText()}</p>
              <p className="text-sm text-gray-600">
                {isMobile ? 'Mobile Device Detected' : 'Desktop Device'}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {permissionStatus}
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="space-y-3 mb-6">
        {permissionStatus !== 'granted' && (
          <button
            onClick={requestPermission}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Bell className="w-5 h-5" />
            <span>{isLoading ? 'Requesting...' : 'Request Notification Permission'}</span>
          </button>
        )}

        {permissionStatus === 'granted' && (
          <>
            <button
              onClick={testNotification}
              disabled={isLoading}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
            >
              <TestTube className="w-5 h-5" />
              <span>{isLoading ? 'Testing...' : 'Test Mobile Notification'}</span>
            </button>

            <button
              onClick={testRealTimeNotification}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Wifi className="w-5 h-5" />
              <span>{isLoading ? 'Testing...' : 'Test Real-time Notification'}</span>
            </button>
          </>
        )}
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Test Results:</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`p-3 rounded-lg text-sm ${
                  result.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{result.message}</span>
                  <span className="text-xs opacity-75">{result.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Mobile Testing Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Make sure you're on HTTPS (required for notifications)</li>
          <li>• Allow notifications when prompted</li>
          <li>• Test on different mobile browsers (Chrome, Safari, Samsung Internet)</li>
          <li>• Check if notifications appear in your notification panel</li>
          <li>• Test with the app installed as PWA</li>
        </ul>
      </div>
    </div>
  );
};

export default MobileNotificationTest;