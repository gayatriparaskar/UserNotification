# 🔔 Real-time Notification Testing Guide

## 🧪 **Testing Real-time Notifications When Orders Are Placed**

### **Step 1: Setup Testing Environment**

1. **Open browser console** (F12)
2. **Login as a user**
3. **Add items to cart**
4. **Look for debug components** (bottom corners)

### **Step 2: Test Socket Connection**

1. **Check console for:**
   ```
   "Socket connected: [socket-id]"
   "useRealtimeNotifications: Setting up notifications for user: [user-id]"
   "Joined user room for: [user-id]"
   ```

2. **Use "Test Socket" button** (bottom-right)
   - Should show connection status
   - Should show user information

### **Step 3: Test Order Placement**

1. **Add items to cart**
2. **Use "Test Order" button** (bottom-left)
   - Should place a real order
   - Should trigger backend notifications

3. **Watch console for:**
   ```
   "Placing test order: {...}"
   "Order response: {...}"
   "Socket event received: [event-name] [data]"
   ```

### **Step 4: Test Real-time Notifications**

1. **Place an order** (using test button or normal checkout)
2. **Watch console for:**
   ```
   "Socket event received: new-notification {...}"
   "Received notification data: {...}"
   "Adding notification to context: {...}"
   "NotificationContext: Adding notification: {...}"
   ```

3. **Check notification bell:**
   - Should show unread count
   - Should update in real-time

### **Step 5: Debug Common Issues**

#### **Issue 1: No Socket Connection**
```javascript
// Check console for:
"Socket connected: [socket-id]" // Should appear
"Socket connection error: [error]" // Should NOT appear
```

#### **Issue 2: No User Room Joined**
```javascript
// Check console for:
"useRealtimeNotifications: Setting up notifications for user: [user-id]"
"Joined user room for: [user-id]"
```

#### **Issue 3: No Socket Events**
```javascript
// Check console for:
"Socket event received: [event-name] [data]" // Should appear when order is placed
```

#### **Issue 4: No Notification Context Update**
```javascript
// Check console for:
"Received notification data: {...}"
"Adding notification to context: {...}"
"NotificationContext: Current unread count: [number]"
```

---

## 🔍 **Debug Information**

### **Console Logs to Watch:**

#### **Socket Connection:**
```javascript
"Socket connected: [socket-id]"
"useRealtimeNotifications: Setting up notifications for user: [user-id]"
"Joined user room for: [user-id]"
```

#### **Order Placement:**
```javascript
"Placing test order: {...}"
"Order response: {...}"
```

#### **Socket Events:**
```javascript
"Socket event received: [event-name] [data]"
"Received notification data: {...}"
"Adding notification to context: {...}"
```

#### **Notification Context:**
```javascript
"NotificationContext: Adding notification: {...}"
"NotificationContext: Current unread count: [number]"
```

---

## 🚨 **Troubleshooting**

### **Problem 1: Test notification works but real notifications don't**
- **Check:** Socket connection is established
- **Check:** User room is joined
- **Check:** Backend is sending notifications
- **Check:** Socket events are being received

### **Problem 2: No socket events received**
- **Check:** Backend is running
- **Check:** Backend is sending notifications
- **Check:** Socket connection is stable
- **Check:** User room is properly joined

### **Problem 3: Notifications received but count not updating**
- **Check:** Notification context is working
- **Check:** Reducer is updating unread count
- **Check:** Component is re-rendering

---

## 📋 **Expected Flow:**

### **When Order is Placed:**
1. **Order API call** → Backend receives order
2. **Backend creates notification** → NotificationService.notifyOrderPlaced()
3. **Backend emits socket event** → `io.to('user-${userId}').emit('new-notification', data)`
4. **Frontend receives event** → Socket event listener
5. **Notification context updated** → addNotification() called
6. **Unread count updated** → Reducer updates state
7. **UI updates** → Bell shows count, toast appears

### **Debug Components:**
- **NotificationTest** (bottom-right): Test notification system
- **OrderTest** (bottom-left): Test order placement
- **Console logs**: Track entire flow

---

## 🎯 **Result:**
Real-time notifications should work when orders are placed, showing up immediately without requiring page refresh!
