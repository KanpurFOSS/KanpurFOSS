const fs = require('fs');
const path = require('path');

const vendorDir = path.join(__dirname, '..', 'assets', 'js', 'vendor');

const filesToCopy = [
    {
        src: path.join(__dirname, '..', 'node_modules', 'jquery', 'dist', 'jquery.min.js'),
        dest: 'jquery.min.js'
    },
    {
        src: path.join(__dirname, '..', 'node_modules', 'gsap', 'dist', 'gsap.min.js'),
        dest: 'gsap.min.js'
    },
    {
        src: path.join(__dirname, '..', 'node_modules', 'gsap', 'dist', 'ScrollTrigger.min.js'),
        dest: 'ScrollTrigger.min.js'
    }
];

if (!fs.existsSync(vendorDir)) {
    fs.mkdirSync(vendorDir, { recursive: true });
}

filesToCopy.forEach(file => {
    if (fs.existsSync(file.src)) {
        fs.copyFileSync(file.src, path.join(vendorDir, file.dest));
        console.log(`Copied ${file.dest}`);
    } else {
        console.error(`Source file not found: ${file.src}`);
    }
});
