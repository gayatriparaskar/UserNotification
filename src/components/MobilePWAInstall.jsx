import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share, Plus, AlertCircle, CheckCircle } from 'lucide-react';

const MobilePWAInstall = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [browser, setBrowser] = useState('unknown');
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const userAgent = navigator.userAgent;
    const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobile);

    // Detect browser
    if (/Chrome/i.test(userAgent)) {
      setBrowser('chrome');
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      setBrowser('safari');
    } else if (/SamsungBrowser/i.test(userAgent)) {
      setBrowser('samsung');
    } else if (/Firefox/i.test(userAgent)) {
      setBrowser('firefox');
    } else {
      setBrowser('other');
    }

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true;
    setIsInstalled(isStandalone);
  }, []);

  const getInstallInstructions = () => {
    if (!isMobile) return null;

    switch (browser) {
      case 'chrome':
        return {
          title: 'Install on Android Chrome',
          steps: [
            'Tap the menu button (⋮) in the top-right corner',
            'Look for "Add to Home Screen" or "Install App"',
            'Tap "Add" to install the app',
            'The app will appear on your home screen'
          ],
          icon: <Download className="w-6 h-6 text-blue-600" />
        };
      
      case 'safari':
        return {
          title: 'Install on iOS Safari',
          steps: [
            'Tap the Share button (□↗) at the bottom',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" in the top-right corner',
            'The app will appear on your home screen'
          ],
          icon: <Share className="w-6 h-6 text-blue-600" />
        };
      
      case 'samsung':
        return {
          title: 'Install on Samsung Internet',
          steps: [
            'Tap the menu button (⋮) in the top-right corner',
            'Tap "Add page to"',
            'Select "Home screen"',
            'Tap "Add" to install the app'
          ],
          icon: <Plus className="w-6 h-6 text-green-600" />
        };
      
      case 'firefox':
        return {
          title: 'Install on Firefox Mobile',
          steps: [
            'Tap the menu button (⋮) in the top-right corner',
            'Look for "Add to Home Screen"',
            'Tap "Add" to install the app',
            'The app will appear on your home screen'
          ],
          icon: <Download className="w-6 h-6 text-orange-600" />
        };
      
      default:
        return {
          title: 'Install PWA',
          steps: [
            'Look for an install button or menu option',
            'Follow your browser\'s PWA installation process',
            'The app will appear on your home screen'
          ],
          icon: <AlertCircle className="w-6 h-6 text-gray-600" />
        };
    }
  };

  const instructions = getInstallInstructions();

  if (!isMobile || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Smartphone className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Install SnacksShop App
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Get the full app experience on your mobile device
            </p>
            
            {!showInstructions ? (
              <button
                onClick={() => setShowInstructions(true)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Show Installation Steps</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {instructions.icon}
                  <h4 className="font-medium text-gray-900">{instructions.title}</h4>
                </div>
                
                <ol className="space-y-2">
                  {instructions.steps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePWAInstall;
