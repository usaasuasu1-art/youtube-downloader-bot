#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Mengecek dependencies sistem...\n');

const dependencies = [
    {
        name: 'Node.js',
        command: 'node --version',
        required: true,
        install: 'Install dari https://nodejs.org/'
    },
    {
        name: 'npm',
        command: 'npm --version',
        required: true,
        install: 'Biasanya sudah include dengan Node.js'
    },
    {
        name: 'yt-dlp',
        command: 'yt-dlp --version',
        required: true,
        install: 'pip install yt-dlp atau sudo apt install yt-dlp'
    },
    {
        name: 'ffmpeg',
        command: 'ffmpeg -version',
        required: true,
        install: 'sudo apt install ffmpeg atau brew install ffmpeg'
    }
];

let allGood = true;

for (const dep of dependencies) {
    try {
        const version = execSync(dep.command, { encoding: 'utf8', stdio: 'pipe' });
        const versionLine = version.split('\n')[0];
        console.log(`✅ ${dep.name}: ${versionLine}`);
    } catch (error) {
        console.log(`❌ ${dep.name}: Tidak ditemukan`);
        console.log(`   Install: ${dep.install}`);
        if (dep.required) {
            allGood = false;
        }
    }
}

console.log('\n📁 Mengecek file konfigurasi...');

// Check .env file
if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    if (envContent.includes('your_bot_token_here') || envContent.includes('YOUR_BOT_TOKEN_HERE')) {
        console.log('⚠️  File .env ditemukan tapi BOT_TOKEN belum diset');
        console.log('   Silakan edit file .env dan masukkan token bot Telegram Anda');
        allGood = false;
    } else {
        console.log('✅ File .env: OK');
    }
} else {
    console.log('⚠️  File .env tidak ditemukan');
    console.log('   Jalankan: cp .env.example .env');
    console.log('   Kemudian edit file .env dan masukkan token bot Anda');
    allGood = false;
}

// Check downloads directory
if (!fs.existsSync('downloads')) {
    console.log('📁 Membuat direktori downloads...');
    fs.mkdirSync('downloads', { recursive: true });
    console.log('✅ Direktori downloads dibuat');
} else {
    console.log('✅ Direktori downloads: OK');
}

console.log('\n' + '='.repeat(50));

if (allGood) {
    console.log('🎉 Semua dependencies sudah terpasang!');
    console.log('🚀 Anda bisa menjalankan bot dengan: npm start');
} else {
    console.log('❌ Beberapa dependencies belum terpasang');
    console.log('📋 Silakan install dependencies yang missing terlebih dahulu');
}

console.log('\n💡 Untuk bantuan lebih lanjut, baca README.md');
console.log('='.repeat(50));