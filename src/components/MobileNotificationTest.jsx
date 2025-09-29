import React, { useState, useEffect } from 'react';
import { Smartphone, Bell, Wifi, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import notificationService from '../services/notificationService';

const MobileNotificationTest = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    // Detect mobile device
    const userAgent = navigator.userAgent;
    const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobile);
    
    // Check notification permission
    setPermissionStatus(Notification.permission);
    
    // Check socket status
    setSocketStatus(isConnected ? 'connected' : 'disconnected');
  }, [isConnected]);

  const addTestResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date() }]);
  };

  const testNotificationPermission = async () => {
    setIsLoading(true);
    try {
      console.log('Testing notification permission...');
      addTestResult('Permission', 'testing', 'Requesting notification permission...');
      
      const granted = await notificationService.requestPermission();
      setPermissionStatus(Notification.permission);
      
      if (granted) {
        addTestResult('Permission', 'success', 'Notification permission granted');
      } else {
        addTestResult('Permission', 'error', 'Notification permission denied');
      }
    } catch (error) {
      addTestResult('Permission', 'error', `Permission error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSocketConnection = () => {
    console.log('Testing socket connection...');
    addTestResult('Socket', 'testing', 'Checking socket connection...');
    
    if (socket) {
      if (isConnected) {
        addTestResult('Socket', 'success', `Connected (ID: ${socket.id})`);
      } else {
        addTestResult('Socket', 'error', 'Socket not connected');
      }
    } else {
      addTestResult('Socket', 'error', 'Socket instance not available');
    }
  };

  const testNotificationSound = async () => {
    console.log('Testing notification sound...');
    addTestResult('Sound', 'testing', 'Testing notification sound...');
    
    try {
      // Import the notification context to access the sound function
      const { playNotificationSound } = await import('../contexts/NotificationContext');
      playNotificationSound();
      addTestResult('Sound', 'success', 'Notification sound played');
    } catch (error) {
      addTestResult('Sound', 'error', `Sound error: ${error.message}`);
    }
  };

  const testBrowserNotification = async () => {
    console.log('Testing browser notification...');
    addTestResult('Browser Notification', 'testing', 'Testing browser notification...');
    
    try {
      if (Notification.permission === 'granted') {
        const notification = new Notification('Mobile Test', {
          body: 'This is a test notification on mobile',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          vibrate: [200, 100, 200],
          requireInteraction: true
        });
        
        notification.onclick = () => {
          console.log('Notification clicked');
          notification.close();
        };
        
        addTestResult('Browser Notification', 'success', 'Browser notification sent');
      } else {
        addTestResult('Browser Notification', 'error', 'Notification permission not granted');
      }
    } catch (error) {
      addTestResult('Browser Notification', 'error', `Browser notification error: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    setIsLoading(true);
    
    try {
      await testNotificationPermission();
      testSocketConnection();
      testNotificationSound();
      await testBrowserNotification();
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'testing':
        return <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'testing':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Smartphone className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Mobile Notification Test</h3>
      </div>
      
      <div className="mb-6 space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Device Information</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Device:</strong> {isMobile ? 'Mobile' : 'Desktop'}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Socket Status:</strong> <span className={socketStatus === 'connected' ? 'text-green-600' : 'text-red-600'}>{socketStatus}</span></p>
            <p><strong>Permission:</strong> <span className={permissionStatus === 'granted' ? 'text-green-600' : 'text-red-600'}>{permissionStatus}</span></p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <button
          onClick={testNotificationPermission}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Bell className="h-4 w-4" />
          <span>Test Permission</span>
        </button>
        
        <button
          onClick={testSocketConnection}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Wifi className="h-4 w-4" />
          <span>Test Socket</span>
        </button>
        
        <button
          onClick={testNotificationSound}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Bell className="h-4 w-4" />
          <span>Test Sound</span>
        </button>
        
        <button
          onClick={testBrowserNotification}
          disabled={isLoading || permissionStatus !== 'granted'}
          className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Bell className="h-4 w-4" />
          <span>Test Browser Notification</span>
        </button>
        
        <button
          onClick={runAllTests}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Smartphone className="h-5 w-5" />
          <span>{isLoading ? 'Running Tests...' : 'Run All Tests'}</span>
        </button>
      </div>
      
      {testResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Test Results</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                    {result.test}
                  </p>
                  <p className="text-xs text-gray-600">{result.message}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {result.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNotificationTest;
