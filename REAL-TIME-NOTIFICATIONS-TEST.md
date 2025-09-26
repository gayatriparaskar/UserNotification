# 🔔 Real-time Notifications Test Guide

## 🐛 **Issue Fixed:**
- Backend emits `'new-notification'` events
- Frontend was listening for `'notification'` events
- **Fixed:** Updated frontend to listen for `'new-notification'` events

## ✅ **Changes Made:**

### **1. Fixed Event Listener (`src/hooks/useRealtimeNotifications.js`):**
```javascript
// Before (WRONG):
onNotification(handleNotification)

// After (CORRECT):
socket.on('new-notification', handleNotification)
```

### **2. Fixed Data Structure Handling:**
```javascript
// Backend sends:
{
  notification: { _id, title, message, data, ... },
  unreadCount: 5
}

// Frontend now correctly extracts:
const notification = data.notification
const unreadCount = data.unreadCount
```

### **3. Fixed Cleanup:**
```javascript
// Before:
offNotification(handleNotification)

// After:
socket.off('new-notification', handleNotification)
```

---

## 🧪 **Testing Real-time Notifications:**

### **Step 1: Start Backend Server**
```bash
cd NotificationBackend
npm start
```

### **Step 2: Start Frontend**
```bash
cd UserNotification
npm run dev
```

### **Step 3: Test Order Placement**
1. **Open browser** → `http://localhost:3000`
2. **Add items to cart**
3. **Go to cart** → Click "Proceed to Checkout"
4. **Fill checkout form** → Click "Place Order"
5. **Watch for notifications** in:
   - Browser console (check for socket events)
   - Toast notifications
   - Browser notification popup
   - Notification bell badge

### **Step 4: Test Admin Notifications**
1. **Open admin dashboard** in another browser tab
2. **Place order** from customer account
3. **Verify** admin receives notification

---

## 🔍 **Debug Steps:**

### **1. Check Socket Connection:**
```javascript
// Open browser console
// Should see: "Socket connected: [socket-id]"
```

### **2. Check User Room Joining:**
```javascript
// Should see: "Joined user room for: [user-id]"
```

### **3. Check Notification Events:**
```javascript
// When order is placed, should see:
// "Received notification data: { notification: {...}, unreadCount: 1 }"
```

### **4. Check Backend Logs:**
```bash
# Backend console should show:
# "Sending order placed notifications for order: [order-id]"
# "NotificationService: Real-time notification sent to user: [user-id]"
```

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
- **Check:** Event listener is attached

### **Issue 3: Notifications Not Showing**
- **Check:** Browser notification permission
- **Check:** Toast notifications are enabled
- **Check:** Notification service is working

---

## 📋 **Expected Flow:**

### **When Order is Placed:**
1. **Backend** → Creates order → Calls `NotificationService.notifyOrderPlaced()`
2. **Backend** → Creates notifications for customer and admin
3. **Backend** → Emits `'new-notification'` to user rooms
4. **Frontend** → Receives notification → Shows toast + browser notification
5. **Frontend** → Updates notification count → Adds to notification center

### **Notification Types:**
- **Customer:** "Order Placed Successfully!"
- **Admin:** "New Order Received!"

---

## ✅ **Verification Checklist:**

- [ ] Socket connects successfully
- [ ] User room is joined on authentication
- [ ] Order placement triggers backend notification
- [ ] Frontend receives `'new-notification'` event
- [ ] Toast notification appears
- [ ] Browser notification appears (if permission granted)
- [ ] Notification count updates
- [ ] Admin receives notification for new orders
- [ ] Customer receives confirmation notification

---

## 🎯 **Result:**
Real-time notifications should now work properly when orders are placed!
