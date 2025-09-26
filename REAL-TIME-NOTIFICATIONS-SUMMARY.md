# 🔔 Real-time Notifications System

## ✅ **System Overview:**

### **How Real-time Notifications Work:**
1. **User places order** → Checkout process
2. **Backend receives order** → Order API endpoint
3. **Backend creates notification** → NotificationService.notifyOrderPlaced()
4. **Backend emits socket event** → `io.to('user-${userId}').emit('new-notification', data)`
5. **Frontend receives event** → Socket event listener
6. **Notification context updated** → addNotification() called
7. **UI updates** → Bell shows count, toast appears

### **Components Involved:**
- **SocketContext** - WebSocket connection management
- **NotificationContext** - Notification state management
- **useRealtimeNotifications** - Real-time notification hook
- **Navbar** - Bell icon with unread count
- **Backend NotificationService** - Sends notifications

---

## 🔧 **Technical Implementation:**

### **1. Socket Connection:**
```javascript
// SocketContext.jsx
const socketInstance = io(API_URL, {
  transports: ['websocket', 'polling']
})
```

### **2. User Room Joining:**
```javascript
// useRealtimeNotifications.js
joinUserRoom(user._id) // Join user-specific room
```

### **3. Event Listening:**
```javascript
// useRealtimeNotifications.js
socket.on('new-notification', handleNotification)
```

### **4. Notification Handling:**
```javascript
// useRealtimeNotifications.js
const handleNotification = (data) => {
  const notification = data.notification
  addNotification(notification) // Update context
  toast.success(notification.title) // Show toast
}
```

### **5. Context Updates:**
```javascript
// NotificationContext.jsx
case 'ADD_NOTIFICATION':
  return {
    ...state,
    notifications: [action.payload, ...state.notifications],
    unreadCount: state.unreadCount + 1
  }
```

---

## 🧪 **Testing the System:**

### **Step 1: Check Socket Connection**
1. **Open browser console**
2. **Login as user**
3. **Look for:** `"Socket connected: [socket-id]"`
4. **Look for:** `"Joined user room for: [user-id]"`

### **Step 2: Place an Order**
1. **Add items to cart**
2. **Go to checkout**
3. **Fill form and place order**
4. **Watch console for notification events**

### **Step 3: Verify Notifications**
1. **Check notification bell** - Should show unread count
2. **Check toast notification** - Should appear
3. **Check browser notification** - If permission granted

---

## 🔍 **Debug Information:**

### **Console Logs to Watch:**
```javascript
// Socket connection
"Socket connected: [socket-id]"
"useRealtimeNotifications: Setting up notifications for user: [user-id]"
"Joined user room for: [user-id]"

// Order placement
"Order response: {...}"

// Notification received
"Received notification data: {...}"
"Adding notification to context: {...}"
```

### **Expected Flow:**
1. **User places order** → API call to backend
2. **Backend processes order** → Creates notification
3. **Backend emits event** → `new-notification` to user room
4. **Frontend receives event** → Socket listener triggers
5. **Notification added** → Context updated, UI refreshed
6. **Bell shows count** → Unread count updated
7. **Toast appears** → User sees notification

---

## 🚨 **Common Issues:**

### **Issue 1: No Socket Connection**
- **Check:** Backend server is running
- **Check:** CORS settings in backend
- **Check:** Frontend API URL in `.env`

### **Issue 2: No Notifications Received**
- **Check:** User is authenticated
- **Check:** Socket is connected
- **Check:** User room is joined
- **Check:** Backend is sending notifications

### **Issue 3: Notifications Not Showing**
- **Check:** Browser notification permission
- **Check:** Toast notifications are enabled
- **Check:** Notification context is working

---

## 📋 **Expected Behavior:**

### **When Order is Placed:**
- ✅ **Real-time notification** appears immediately
- ✅ **Bell icon** shows unread count
- ✅ **Toast notification** appears
- ✅ **Browser notification** (if permission granted)
- ✅ **No page refresh** required

### **Notification Types:**
- **Customer:** "Order Placed Successfully!"
- **Admin:** "New Order Received!"

---

## 🎯 **Result:**
Real-time notifications work when orders are placed, showing up immediately without requiring page refresh. The system uses WebSocket connections to provide instant notification updates to users.
