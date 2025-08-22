const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const axios = require('axios');

// Fungsi untuk membuat direktori downloads jika belum ada
const ensureDownloadDir = () => {
    const downloadDir = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
    }
    return downloadDir;
};

// Fungsi untuk membersihkan nama file
const sanitizeFilename = (filename) => {
    return filename
        .replace(/[<>:"/\\|?*]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200);
};

// Fungsi untuk download gambar thumbnail
const downloadThumbnail = async (url, filepath) => {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });
        
        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading thumbnail:', error);
        throw error;
    }
};

// Fungsi untuk cleanup file temporary
const cleanupFiles = async (files) => {
    for (const file of files) {
        try {
            if (fs.existsSync(file)) {
                await fs.unlink(file);
                console.log(`Cleaned up: ${file}`);
            }
        } catch (error) {
            console.error(`Error cleaning up ${file}:`, error);
        }
    }
};

// Fungsi untuk mendapatkan info video YouTube menggunakan yt-dlp
const getYouTubeInfo = async (url) => {
    try {
        const command = `yt-dlp --dump-json "${url}"`;
        const output = execSync(command, { encoding: 'utf8' });
        return JSON.parse(output);
    } catch (error) {
        console.error('Error getting YouTube info:', error);
        throw new Error('Gagal mendapatkan informasi video YouTube');
    }
};

// Fungsi untuk search YouTube berdasarkan judul
const searchYouTube = async (query) => {
    try {
        const command = `yt-dlp "ytsearch:${query}" --dump-json --playlist-end 1`;
        const output = execSync(command, { encoding: 'utf8' });
        return JSON.parse(output);
    } catch (error) {
        console.error('Error searching YouTube:', error);
        throw new Error('Gagal mencari video di YouTube');
    }
};

// Fungsi untuk download audio dari YouTube dengan kualitas terbaik
const downloadYouTubeAudio = async (url, outputPath) => {
    try {
        const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 --embed-thumbnail --add-metadata -o "${outputPath}" "${url}"`;
        execSync(command, { stdio: 'inherit' });
        return outputPath;
    } catch (error) {
        console.error('Error downloading YouTube audio:', error);
        throw new Error('Gagal mendownload audio dari YouTube');
    }
};

// Fungsi untuk download video TikTok
const downloadTikTokVideo = async (url, outputPath) => {
    try {
        const command = `yt-dlp -f "best[height<=1080]" --add-metadata -o "${outputPath}" "${url}"`;
        execSync(command, { stdio: 'inherit' });
        return outputPath;
    } catch (error) {
        console.error('Error downloading TikTok video:', error);
        throw new Error('Gagal mendownload video dari TikTok');
    }
};

// Fungsi untuk embed thumbnail ke MP3 menggunakan ffmpeg
const embedThumbnailToMp3 = async (audioPath, thumbnailPath, outputPath) => {
    try {
        const command = `ffmpeg -i "${audioPath}" -i "${thumbnailPath}" -map 0:0 -map 1:0 -c copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" "${outputPath}" -y`;
        execSync(command, { stdio: 'inherit' });
        return outputPath;
    } catch (error) {
        console.error('Error embedding thumbnail:', error);
        // Jika gagal embed thumbnail, return audio asli
        return audioPath;
    }
};

// Fungsi untuk mengecek apakah URL adalah YouTube
const isYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
};

// Fungsi untuk mengecek apakah URL adalah TikTok
const isTikTokUrl = (url) => {
    const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com)\/.+/;
    return tiktokRegex.test(url);
};

module.exports = {
    ensureDownloadDir,
    sanitizeFilename,
    downloadThumbnail,
    cleanupFiles,
    getYouTubeInfo,
    searchYouTube,
    downloadYouTubeAudio,
    downloadTikTokVideo,
    embedThumbnailToMp3,
    isYouTubeUrl,
    isTikTokUrl
};