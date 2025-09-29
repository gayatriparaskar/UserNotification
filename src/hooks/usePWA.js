import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
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

    // Check if app is already installed
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone === true;
      setIsInstalled(isStandalone);
    };

    checkInstallStatus();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
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

  const install = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      return true;
    } else {
      console.log('User dismissed the install prompt');
      return false;
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

  return {
    isInstallable,
    isInstalled,
    deviceType,
    install,
    getInstallInstructions
  };
};

export default usePWA;

