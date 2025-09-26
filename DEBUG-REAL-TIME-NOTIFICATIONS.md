# 🔔 Debug Real-time Notifications

## 🐛 **Current Issues:**
1. **Real-time notifications not working** - Need to refresh page
2. **No sound playing** - Sound not triggering on new notifications

## 🔧 **Debugging Steps:**

### **1. Check Socket Connection:**
1. **Open browser console**
2. **Look for these logs:**
   ```
   🔔 Socket connecting to: http://localhost:5000
   🔔 VITE_API_URL: http://localhost:5000/api
   🔔 Socket connected: [socket-id]
   ```
3. **If no connection:** Check if backend is running on port 5000

### **2. Check User Room Joining:**
1. **Login as user**
2. **Look for these logs:**
   ```
   🔔 Joining user room for: [user-id]
   🔔 Joined user room for: [user-id]
   ```
3. **If no room joining:** Check user authentication

### **3. Test Socket Connection:**
1. **Use test component** - Click "Test Socket" button
2. **Check result** - Should show socket status
3. **Verify** socket is connected and has ID

### **4. Test Sound:**
1. **Click "Test Sound" button**
2. **Should hear** notification chime
3. **Check result** - Should show "Sound test played successfully"

### **5. Test Notification:**
1. **Click "Test Notification" button**
2. **Check console** for notification events
3. **Should see:**
   ```
   🔔 Received notification data: {...}
   🔔 Adding notification to context: {...}
   ```
4. **Should hear** notification sound
5. **Bell icon** should update with unread count

### **6. Test Order:**
1. **Click "Test Order" button**
2. **Creates real order** - Should trigger notification
3. **Check for** real-time notification and sound

## 🔍 **Common Issues:**

### **Issue 1: Socket Not Connecting**
- **Check:** Backend server running on port 5000
- **Check:** CORS settings in backend
- **Check:** Frontend API URL in .env file

### **Issue 2: No Sound**
- **Check:** Browser audio permissions
- **Check:** Web Audio API support
- **Test:** Use "Test Sound" button

### **Issue 3: No Real-time Updates**
- **Check:** Socket connection status
- **Check:** User room joining
- **Check:** Backend notification emission
- **Check:** Frontend event listeners

## 📋 **Test Component Features:**

### **Debug Information:**
- **User details** - Name and ID
- **Unread count** - Current notification count
- **Socket status** - Connection state and ID
- **API URL** - Current backend URL

### **Test Buttons:**
- **Test Socket** - Check socket connection
- **Test Sound** - Play notification sound
- **Test Notification** - Send test notification via API
- **Test Order** - Create real order to trigger notification

## 🎯 **Expected Results:**

### **When Working Correctly:**
1. **Socket connects** to `http://localhost:5000`
2. **User joins room** successfully
3. **Test notification** triggers sound and updates
4. **Real-time updates** work without refresh
5. **Bell icon** shows correct unread count

### **Console Logs to Watch:**
```
🔔 Socket connecting to: http://localhost:5000
🔔 Socket connected: [socket-id]
🔔 Joining user room for: [user-id]
🔔 Event listeners attached for user: [user-id]
🔔 Received notification data: {...}
🔔 Adding notification to context: {...}
```

## 🚨 **Troubleshooting:**

### **If Socket Not Connecting:**
1. **Check backend** - Is it running on port 5000?
2. **Check CORS** - Backend CORS settings
3. **Check URL** - Frontend connecting to correct URL

### **If No Sound:**
1. **Check browser** - Audio permissions
2. **Test sound** - Use test button
3. **Check console** - Any audio errors

### **If No Real-time:**
1. **Check socket** - Connection status
2. **Check room** - User room joining
3. **Check events** - Backend emitting events
4. **Check listeners** - Frontend listening for events

The test component provides comprehensive debugging tools to identify and fix the real-time notification issues!
