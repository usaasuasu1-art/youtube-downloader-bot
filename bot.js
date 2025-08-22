const { Telegraf } = require('telegraf');
const path = require('path');
const fs = require('fs-extra');
const {
    ensureDownloadDir,
    sanitizeFilename,
    cleanupFiles,
    getYouTubeInfo,
    searchYouTube,
    downloadYouTubeAudio,
    downloadTikTokVideo,
    isYouTubeUrl,
    isTikTokUrl
} = require('./utils');

// Ganti dengan token bot Telegram Anda
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';

if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
    console.error('❌ Mohon set BOT_TOKEN di environment variables atau ganti di kode');
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Pastikan direktori downloads ada
ensureDownloadDir();

// Command /start
bot.start((ctx) => {
    const welcomeMessage = `
🎵 **Bot YouTube & TikTok Downloader** 🎵

Selamat datang! Bot ini bisa mendownload:

📹 **YouTube ke MP3** (dengan thumbnail):
• \`/yt [URL YouTube]\` - Download dari URL
• \`/yt [judul lagu]\` - Cari dan download

🎬 **TikTok Video**:
• \`/tt [URL TikTok]\` - Download video HD

**Contoh penggunaan:**
• \`/yt https://youtube.com/watch?v=...\`
• \`/yt risalah hati\`
• \`/yt cukup\`
• \`/tt https://tiktok.com/@user/video/...\`

Kualitas audio: 320kbps+ dengan thumbnail original 🎨
Kualitas video: HD++ 📱

Selamat menggunakan! 🚀
    `;
    
    ctx.replyWithMarkdown(welcomeMessage);
});

// Command /help
bot.help((ctx) => {
    ctx.replyWithMarkdown(`
📖 **Bantuan Bot YouTube & TikTok Downloader**

**Perintah yang tersedia:**

🎵 **YouTube ke MP3:**
• \`/yt [URL]\` - Download MP3 dari URL YouTube
• \`/yt [judul]\` - Cari lagu berdasarkan judul

🎬 **TikTok Video:**
• \`/tt [URL]\` - Download video dari TikTok

**Tips:**
• Audio akan memiliki kualitas terbaik (320kbps+)
• Thumbnail original akan tertanam di file MP3
• Video TikTok akan didownload dalam kualitas HD terbaik
• Proses download mungkin membutuhkan waktu beberapa menit

**Contoh:**
\`/yt https://youtu.be/dQw4w9WgXcQ\`
\`/yt never gonna give you up\`
\`/tt https://tiktok.com/@username/video/1234567890\`
    `);
});

// Command /yt untuk YouTube
bot.command('yt', async (ctx) => {
    const input = ctx.message.text.split(' ').slice(1).join(' ').trim();
    
    if (!input) {
        return ctx.reply('❌ Mohon masukkan URL YouTube atau judul lagu!\n\nContoh:\n/yt https://youtube.com/watch?v=...\n/yt risalah hati');
    }

    const statusMessage = await ctx.reply('🔍 Memproses permintaan Anda...');
    
    try {
        let videoInfo;
        let videoUrl;
        
        // Cek apakah input adalah URL atau judul
        if (isYouTubeUrl(input)) {
            await ctx.telegram.editMessageText(
                ctx.chat.id, 
                statusMessage.message_id, 
                null, 
                '📥 Mendapatkan informasi video...'
            );
            videoInfo = await getYouTubeInfo(input);
            videoUrl = input;
        } else {
            await ctx.telegram.editMessageText(
                ctx.chat.id, 
                statusMessage.message_id, 
                null, 
                `🔍 Mencari "${input}" di YouTube...`
            );
            videoInfo = await searchYouTube(input);
            videoUrl = videoInfo.webpage_url;
        }

        const title = sanitizeFilename(videoInfo.title || 'Unknown');
        const uploader = sanitizeFilename(videoInfo.uploader || 'Unknown');
        const duration = videoInfo.duration ? `${Math.floor(videoInfo.duration / 60)}:${(videoInfo.duration % 60).toString().padStart(2, '0')}` : 'Unknown';
        
        await ctx.telegram.editMessageText(
            ctx.chat.id, 
            statusMessage.message_id, 
            null, 
            `🎵 **${title}**\n👤 ${uploader}\n⏱️ ${duration}\n\n⬇️ Mendownload audio...`
        );

        // Setup paths
        const downloadDir = ensureDownloadDir();
        const tempFileName = `${Date.now()}_${title}`;
        const outputTemplate = path.join(downloadDir, `${tempFileName}.%(ext)s`);
        
        // Download audio
        const audioPath = await downloadYouTubeAudio(videoUrl, outputTemplate);
        
        // Cari file MP3 yang sudah didownload
        const files = fs.readdirSync(downloadDir);
        const mp3File = files.find(file => file.startsWith(tempFileName) && file.endsWith('.mp3'));
        
        if (!mp3File) {
            throw new Error('File MP3 tidak ditemukan setelah download');
        }
        
        const finalMp3Path = path.join(downloadDir, mp3File);
        
        await ctx.telegram.editMessageText(
            ctx.chat.id, 
            statusMessage.message_id, 
            null, 
            `🎵 **${title}**\n👤 ${uploader}\n⏱️ ${duration}\n\n📤 Mengirim file...`
        );

        // Kirim file MP3
        await ctx.replyWithAudio({
            source: finalMp3Path,
            filename: `${title}.mp3`
        }, {
            title: title,
            performer: uploader,
            caption: `🎵 **${title}**\n👤 ${uploader}\n⏱️ ${duration}\n\n✅ Download selesai dengan thumbnail!`
        });

        // Cleanup
        await cleanupFiles([finalMp3Path]);
        
        // Hapus status message
        await ctx.telegram.deleteMessage(ctx.chat.id, statusMessage.message_id);

    } catch (error) {
        console.error('Error in /yt command:', error);
        
        await ctx.telegram.editMessageText(
            ctx.chat.id, 
            statusMessage.message_id, 
            null, 
            `❌ **Error:** ${error.message}\n\nSilakan coba lagi atau gunakan URL yang berbeda.`
        );
    }
});

// Command /tt untuk TikTok
bot.command('tt', async (ctx) => {
    const input = ctx.message.text.split(' ').slice(1).join(' ').trim();
    
    if (!input) {
        return ctx.reply('❌ Mohon masukkan URL TikTok!\n\nContoh:\n/tt https://tiktok.com/@username/video/1234567890');
    }

    if (!isTikTokUrl(input)) {
        return ctx.reply('❌ URL tidak valid! Mohon masukkan URL TikTok yang benar.\n\nContoh:\n/tt https://tiktok.com/@username/video/1234567890');
    }

    const statusMessage = await ctx.reply('🔍 Memproses video TikTok...');
    
    try {
        await ctx.telegram.editMessageText(
            ctx.chat.id, 
            statusMessage.message_id, 
            null, 
            '📥 Mendapatkan informasi video TikTok...'
        );

        // Get video info first
        const { execSync } = require('child_process');
        const videoInfoOutput = execSync(`yt-dlp --dump-json "${input}"`, { encoding: 'utf8' });
        const videoInfo = JSON.parse(videoInfoOutput);
        
        const title = sanitizeFilename(videoInfo.title || 'TikTok Video');
        const uploader = sanitizeFilename(videoInfo.uploader || 'Unknown');
        const duration = videoInfo.duration ? `${Math.floor(videoInfo.duration / 60)}:${(videoInfo.duration % 60).toString().padStart(2, '0')}` : 'Unknown';
        
        await ctx.telegram.editMessageText(
            ctx.chat.id, 
            statusMessage.message_id, 
            null, 
            `🎬 **${title}**\n👤 ${uploader}\n⏱️ ${duration}\n\n⬇️ Mendownload video HD...`
        );

        // Setup paths
        const downloadDir = ensureDownloadDir();
        const tempFileName = `${Date.now()}_${title}`;
        const outputTemplate = path.join(downloadDir, `${tempFileName}.%(ext)s`);
        
        // Download video
        await downloadTikTokVideo(input, outputTemplate);
        
        // Cari file video yang sudah didownload
        const files = fs.readdirSync(downloadDir);
        const videoFile = files.find(file => file.startsWith(tempFileName) && (file.endsWith('.mp4') || file.endsWith('.webm')));
        
        if (!videoFile) {
            throw new Error('File video tidak ditemukan setelah download');
        }
        
        const finalVideoPath = path.join(downloadDir, videoFile);
        
        await ctx.telegram.editMessageText(
            ctx.chat.id, 
            statusMessage.message_id, 
            null, 
            `🎬 **${title}**\n👤 ${uploader}\n⏱️ ${duration}\n\n📤 Mengirim video...`
        );

        // Kirim video
        await ctx.replyWithVideo({
            source: finalVideoPath,
            filename: `${title}.mp4`
        }, {
            caption: `🎬 **${title}**\n👤 ${uploader}\n⏱️ ${duration}\n\n✅ Download selesai dalam kualitas HD!`
        });

        // Cleanup
        await cleanupFiles([finalVideoPath]);
        
        // Hapus status message
        await ctx.telegram.deleteMessage(ctx.chat.id, statusMessage.message_id);

    } catch (error) {
        console.error('Error in /tt command:', error);
        
        await ctx.telegram.editMessageText(
            ctx.chat.id, 
            statusMessage.message_id, 
            null, 
            `❌ **Error:** ${error.message}\n\nSilakan coba lagi atau gunakan URL yang berbeda.`
        );
    }
});

// Error handling
bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi nanti.');
});

// Start bot
console.log('🚀 Starting Telegram Bot...');
bot.launch()
    .then(() => {
        console.log('✅ Bot started successfully!');
        console.log('📱 Bot is ready to receive commands');
        console.log('💡 Available commands: /start, /help, /yt, /tt');
    })
    .catch((error) => {
        console.error('❌ Failed to start bot:', error);
        process.exit(1);
    });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));