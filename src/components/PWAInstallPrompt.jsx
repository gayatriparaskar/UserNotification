import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Tablet } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    // Detect device type
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        if (/iPad|Android.*Tablet/i.test(userAgent)) {
          setDeviceType('tablet');
        } else {
          setDeviceType('mobile');
        }
      } else {
        setDeviceType('desktop');
      }
    };

    detectDevice();
    
    // Debug PWA status
    console.log('PWA Debug Info:');
    console.log('- Service Worker:', 'serviceWorker' in navigator);
    console.log('- HTTPS:', location.protocol === 'https:');
    console.log('- Manifest:', document.querySelector('link[rel="manifest"]')?.href);
    console.log('- Display mode:', window.matchMedia('(display-mode: standalone)').matches);
    console.log('- Standalone:', window.navigator.standalone);

    // Check if app is already installed
    const checkInstallStatus = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsInstalled(true);
        return;
      }
      setIsInstalled(false);
    };

    checkInstallStatus();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check install status periodically
    const interval = setInterval(checkInstallStatus, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(interval);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Show manual install instructions for mobile if no automatic prompt
  const showManualInstall = deviceType === 'mobile' && !deferredPrompt && !isInstalled;
  
  // Don't show if already installed or recently dismissed (unless manual install)
  if (isInstalled || (!showInstallPrompt && !showManualInstall)) return null;

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-6 w-6" />;
      case 'tablet':
        return <Tablet className="h-6 w-6" />;
      default:
        return <Monitor className="h-6 w-6" />;
    }
  };

  const getInstallInstructions = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          title: "Install SnacksShop App",
          steps: [
            "Tap the share button in your browser",
            "Select 'Add to Home Screen'",
            "Tap 'Add' to install the app"
          ]
        };
      case 'tablet':
        return {
          title: "Install SnacksShop App",
          steps: [
            "Tap the menu button (⋮) in your browser",
            "Select 'Add to Home Screen'",
            "Tap 'Add' to install the app"
          ]
        };
      default:
        return {
          title: "Install SnacksShop App",
          steps: [
            "Click the install button below",
            "Or look for the install icon in your browser's address bar",
            "Click 'Install' when prompted"
          ]
        };
    }
  };

  const instructions = getInstallInstructions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getDeviceIcon()}
            <h3 className="text-lg font-semibold text-gray-900">
              {instructions.title}
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {instructions.steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700">{step}</p>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Install Now</span>
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Maybe Later
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Get the full app experience with offline support and notifications
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;