import React from 'react'
import { useNotifications } from '../contexts/NotificationContext'
import { Wifi, WifiOff } from 'lucide-react'

const ConnectionStatus = () => {
  const { error, isOnline } = useNotifications()

  // Don't show if there's no error or if we're online
  if (!error || isOnline) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
        <WifiOff className="h-4 w-4 text-red-500" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">Connection Issue</p>
          <p className="text-xs text-red-600">
            {error.includes('timeout') ? 'Server is not responding' : 
             error.includes('overloaded') ? 'Server is overloaded' :
             'Unable to connect to server'}
          </p>
        </div>
        <Wifi className="h-4 w-4 text-red-500" />
      </div>
    </div>
  )
}

export default ConnectionStatus
