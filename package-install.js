// Simple Node.js script to install dependencies
const { execSync } = require('child_process');

console.log('Installing react-leaflet...');
try {
  execSync('npm install react-leaflet --legacy-peer-deps', { stdio: 'inherit' });
} catch (e) {
  console.error('Failed to install react-leaflet');
  process.exit(1);
}

console.log('Installing leaflet...');
try {
  execSync('npm install leaflet --legacy-peer-deps', { stdio: 'inherit' });
} catch (e) {
  console.error('Failed to install leaflet');
  process.exit(1);
}

console.log('Installing leaflet.markercluster...');
try {
  execSync('npm install leaflet.markercluster --legacy-peer-deps', { stdio: 'inherit' });
} catch (e) {
  console.error('Failed to install leaflet.markercluster');
  process.exit(1);
}

console.log('\n✅ All packages installed successfully!');
console.log('Please restart your dev server (npm run dev)');




