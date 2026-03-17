const fs = require('fs');
const path = require('path');
const dir = 'd:\\new themes\\youtube';
const files = ['index2.html', 'blog.html', 'trending.html'];

const geminiImages = [
    'images/pexels-a-darmel-9040607.webp',
    'images/pexels-benjamin-dominguez-3363409-28332700.webp',
    'images/pexels-benjamin-dominguez-3363409-28336275.webp',
    'images/pexels-fotios-photos-1266302.webp'
];

files.forEach(f => {
    let content = fs.readFileSync(path.join(dir, f), 'utf8');
    let imgIdx = 0;
    
    // Replace pexels images
    content = content.replace(/images\/pexels-[^"']*\.webp/g, (match) => {
        const replacement = geminiImages[imgIdx % geminiImages.length];
        imgIdx++;
        return replacement;
    });
    
    fs.writeFileSync(path.join(dir, f), content, 'utf8');
});
console.log('Images replaced!');