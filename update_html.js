const fs = require('fs');
const path = require('path');

const dir = 'd:\\new themes\\youtube';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
    const filePath = path.join(dir, f);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Update newsletter form novalidate (removing it)
    content = content.replace(/<form class="newsletter-form" novalidate>/g, '<form class="newsletter-form">');

    // 2. Update Notification button
    content = content.replace(/<button class="icon-btn" aria-label="Notifications">/g, '<button class="icon-btn" aria-label="Notifications" onclick="window.location.href=\'404.html\'">');

    // 3. Update Profile picture
    content = content.replace(/<div class="profile-pic" aria-label="User Profile">/g, '<div class="profile-pic" aria-label="User Profile" style="cursor: pointer;" onclick="window.location.href=\'404.html\'">');

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Updated HTML files.');
