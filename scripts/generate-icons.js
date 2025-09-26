const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes to generate
const sizes = [16, 32, 57, 60, 72, 76, 96, 114, 120, 128, 144, 152, 180, 192, 384, 512];

// Simple SVG icon generator
function generateSVGIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4a7c59;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2c5530;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.6}" 
          text-anchor="middle" dominant-baseline="middle" fill="#ffd700">🐍</text>
    <rect width="${size}" height="${size}" fill="none" stroke="#ffd700" stroke-width="${size * 0.02}" rx="${size * 0.1}"/>
  </svg>`;
}

// Generate HTML file for manual icon creation
function generateIconHTML() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SnakeShop Icon Generator</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .icon-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-top: 20px; }
        .icon-item { text-align: center; padding: 15px; border: 1px solid #eee; border-radius: 8px; }
        canvas { border: 1px solid #ddd; margin: 10px; }
        button { background: #4a7c59; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; }
        button:hover { background: #2c5530; }
    </style>
</head>
<body>
    <div class="container">
        <h1>SnakeShop PWA Icon Generator</h1>
        <p>This will generate all the required PWA icons for SnakeShop.</p>
        <button onclick="generateAllIcons()">Generate All Icons</button>
        <button onclick="downloadAll()">Download All Icons</button>
        <div class="icon-grid" id="iconGrid"></div>
    </div>
    <script>
        const sizes = [${sizes.join(', ')}];
        const icons = {};
        
        function generateIcon(size) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#4a7c59');
            gradient.addColorStop(1, '#2c5530');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            // Snake emoji
            ctx.font = \`\${size * 0.6}px Arial\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffd700';
            ctx.fillText('🐍', size / 2, size / 2);
            
            // Border
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = size * 0.02;
            ctx.strokeRect(0, 0, size, size);
            
            return canvas;
        }
        
        function generateAllIcons() {
            const grid = document.getElementById('iconGrid');
            grid.innerHTML = '';
            
            sizes.forEach(size => {
                const canvas = generateIcon(size);
                icons[size] = canvas;
                
                const iconItem = document.createElement('div');
                iconItem.className = 'icon-item';
                iconItem.innerHTML = \`
                    <h3>\${size}x\${size}</h3>
                    <div>\${canvas.outerHTML}</div>
                    <button onclick="downloadIcon(\${size})">Download</button>
                \`;
                grid.appendChild(iconItem);
            });
        }
        
        function downloadIcon(size) {
            const canvas = icons[size];
            const link = document.createElement('a');
            link.download = \`icon-\${size}x\${size}.png\`;
            link.href = canvas.toDataURL();
            link.click();
        }
        
        function downloadAll() {
            sizes.forEach(size => {
                setTimeout(() => downloadIcon(size), size * 10);
            });
        }
        
        // Generate icons on load
        window.onload = generateAllIcons;
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(iconsDir, 'generate-icons.html'), html);
  console.log('Icon generator HTML created at:', path.join(iconsDir, 'generate-icons.html'));
}

// Generate placeholder icons
function generatePlaceholderIcons() {
  sizes.forEach(size => {
    const svg = generateSVGIcon(size);
    const filename = `icon-${size}x${size}.png`;
    const filepath = path.join(iconsDir, filename);
    
    // For now, create a simple text file as placeholder
    // In a real implementation, you'd use a library like sharp or canvas to convert SVG to PNG
    fs.writeFileSync(filepath.replace('.png', '.svg'), svg);
    console.log(`Generated placeholder for ${filename}`);
  });
}

// Run the generator
console.log('Generating PWA icons for SnakeShop...');
generateIconHTML();
generatePlaceholderIcons();
console.log('Icon generation complete!');
console.log('Open public/icons/generate-icons.html in your browser to create actual PNG icons.');
