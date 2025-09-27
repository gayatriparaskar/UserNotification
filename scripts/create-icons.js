const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed
const sizes = [16, 32, 48, 57, 60, 72, 76, 96, 114, 120, 128, 144, 152, 180, 192, 384, 512];

// Create a simple SVG icon
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#4a7c59" rx="20"/>
  <text x="50" y="60" font-size="60" text-anchor="middle" fill="white">🍟</text>
</svg>`;

// Create PNG placeholder (we'll use a simple approach)
const createPNGPlaceholder = (size) => {
  // For now, we'll create a simple HTML file that can be converted to PNG
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; }
    .icon {
      width: ${size}px;
      height: ${size}px;
      background: #4a7c59;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${size * 0.6}px;
    }
  </style>
</head>
<body>
  <div class="icon">🍟</div>
</body>
</html>`;
  
  return html;
};

// Create icon files
sizes.forEach(size => {
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  const htmlPath = path.join(iconsDir, `icon-${size}x${size}.html`);
  
  // Create SVG
  fs.writeFileSync(svgPath, createSVGIcon(size));
  
  // Create HTML placeholder
  fs.writeFileSync(htmlPath, createPNGPlaceholder(size));
  
  console.log(`Created icon-${size}x${size}.svg and .html`);
});

console.log('✅ Icon files created successfully!');
console.log('📝 Note: You may need to convert the HTML files to PNG using an online converter or image editor.');
console.log('🔗 Recommended: Use a tool like https://convertio.co/html-png/ to convert HTML to PNG');
