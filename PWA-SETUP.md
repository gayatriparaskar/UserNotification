# SnakeShop PWA Setup Guide

This guide will help you set up the Progressive Web App (PWA) features for SnakeShop.

## 🚀 Quick Start

1. **Generate PWA Icons**
   ```bash
   npm run pwa:install
   ```

2. **Open the icon generator**
   - Navigate to `public/icons/generate-icons.html`
   - Click "Generate All Icons" 
   - Click "Download All Icons" to get PNG files
   - Place the downloaded PNG files in `public/icons/` directory

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 📱 PWA Features Included

### ✅ Core PWA Features
- **Service Worker** - Offline functionality and caching
- **Web App Manifest** - App metadata and installation
- **Install Prompts** - Native app-like installation
- **Offline Support** - Works without internet connection
- **Background Sync** - Sync data when connection is restored
- **Push Notifications** - Real-time updates
- **Update Notifications** - Automatic update prompts

### 🎨 Visual Features
- **App Icons** - Multiple sizes for all devices
- **Splash Screens** - iOS startup screens
- **Theme Colors** - Consistent branding
- **Standalone Mode** - Full-screen app experience

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
VITE_API_URL=https://notificationbackend-35f6.onrender.com/api
```

### Service Worker Configuration
The service worker is configured in `public/sw.js` with:
- **Static Caching** - Core app files
- **Dynamic Caching** - API responses
- **Network Strategies** - Cache-first for static, network-first for API
- **Background Sync** - Offline data synchronization

### Manifest Configuration
The app manifest is in `public/manifest.json` with:
- **App Information** - Name, description, theme
- **Icons** - Multiple sizes for different devices
- **Shortcuts** - Quick access to key features
- **Display Mode** - Standalone app experience

## 📱 Installation Methods

### Desktop (Chrome/Edge)
1. Visit the website
2. Look for install button in address bar
3. Click "Install SnakeShop"
4. App will be added to desktop

### Mobile (Android)
1. Open in Chrome browser
2. Tap menu (3 dots) → "Add to Home screen"
3. Tap "Add" to confirm
4. App icon appears on home screen

### Mobile (iOS)
1. Open in Safari browser
2. Tap Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm
5. App icon appears on home screen

## 🛠 Development

### Testing PWA Features
1. **Chrome DevTools**
   - Open DevTools → Application tab
   - Check Service Workers, Manifest, Storage
   - Test offline functionality

2. **Lighthouse Audit**
   - Run Lighthouse audit for PWA score
   - Should score 90+ for PWA compliance

3. **Mobile Testing**
   - Test on actual mobile devices
   - Verify installation prompts
   - Check offline functionality

### Debugging
- Check browser console for PWA logs
- Use DevTools → Application → Service Workers
- Monitor network requests in offline mode

## 📦 Build and Deploy

### Production Build
```bash
npm run build
```

### Deploy Requirements
- **HTTPS Required** - PWA features only work over HTTPS
- **Service Worker** - Must be served from root domain
- **Manifest** - Must be accessible at `/manifest.json`

### Deployment Checklist
- [ ] HTTPS enabled
- [ ] Service worker registered
- [ ] Manifest accessible
- [ ] Icons in correct locations
- [ ] Offline functionality tested
- [ ] Installation prompts working

## 🎯 PWA Best Practices

### Performance
- **Fast Loading** - Optimized bundle size
- **Caching Strategy** - Smart cache management
- **Lazy Loading** - Load resources on demand

### User Experience
- **Install Prompts** - Non-intrusive installation
- **Offline Support** - Graceful degradation
- **Update Notifications** - Seamless updates

### Security
- **HTTPS Only** - Secure connections required
- **Content Security Policy** - Prevent XSS attacks
- **Secure Headers** - Additional security measures

## 🔍 Troubleshooting

### Common Issues

1. **Service Worker Not Registering**
   - Check HTTPS requirement
   - Verify file path in registration
   - Check browser console for errors

2. **Install Prompt Not Showing**
   - Ensure PWA criteria are met
   - Check manifest validity
   - Verify service worker is active

3. **Offline Not Working**
   - Check service worker cache strategy
   - Verify static files are cached
   - Test network conditions

4. **Icons Not Displaying**
   - Check icon file paths
   - Verify icon sizes and formats
   - Test on different devices

### Debug Commands
```bash
# Check service worker status
navigator.serviceWorker.getRegistrations()

# Clear all caches
caches.keys().then(names => names.forEach(name => caches.delete(name)))

# Check manifest
fetch('/manifest.json').then(r => r.json()).then(console.log)
```

## 📚 Additional Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Lighthouse PWA Audit](https://developers.google.com/web/tools/lighthouse)

## 🎉 Success Metrics

Your PWA should achieve:
- **Lighthouse PWA Score**: 90+
- **Installation Rate**: High user adoption
- **Offline Usage**: Seamless offline experience
- **Performance**: Fast loading and smooth interactions

---

**Happy PWA Development! 🐍✨**
