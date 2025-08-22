# 🎵 Bot Telegram YouTube & TikTok Downloader

Bot Telegram yang dapat mendownload MP3 dari YouTube (dengan thumbnail) dan video dari TikTok dalam kualitas HD.

## ✨ Fitur

### 🎵 YouTube ke MP3
- Download MP3 dari URL YouTube dengan kualitas terbaik (320kbps+)
- Thumbnail original tertanam di file MP3
- Pencarian lagu berdasarkan judul
- Metadata lengkap (judul, artis, durasi)

### 🎬 TikTok Video
- Download video TikTok dalam kualitas HD++
- Support berbagai format URL TikTok
- Metadata video lengkap

## 🚀 Instalasi

### Prerequisites
Pastikan sistem Anda sudah memiliki:

1. **Node.js** (versi 16 atau lebih baru)
2. **yt-dlp** 
   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install yt-dlp
   
   # macOS
   brew install yt-dlp
   
   # Atau install via pip
   pip install yt-dlp
   ```

3. **ffmpeg**
   ```bash
   # Ubuntu/Debian  
   sudo apt install ffmpeg
   
   # macOS
   brew install ffmpeg
   ```

### Setup Bot

1. **Clone atau download project ini**
   ```bash
   git clone <repository-url>
   cd telegram-youtube-tiktok-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Buat bot Telegram**
   - Buka [@BotFather](https://t.me/BotFather) di Telegram
   - Kirim `/newbot`
   - Ikuti instruksi untuk membuat bot baru
   - Salin token yang diberikan

4. **Setup environment**
   ```bash
   cp .env.example .env
   ```
   Edit file `.env` dan masukkan token bot Anda:
   ```
   BOT_TOKEN=your_actual_bot_token_here
   ```

5. **Jalankan bot**
   ```bash
   # Mode production
   npm start
   
   # Mode development (auto-restart)
   npm run dev
   ```

## 🎯 Cara Penggunaan

### Perintah Bot

#### `/start`
Menampilkan pesan selamat datang dan panduan penggunaan

#### `/help` 
Menampilkan bantuan lengkap

#### `/yt [URL atau judul]`
Download MP3 dari YouTube

**Contoh:**
```
/yt https://youtube.com/watch?v=dQw4w9WgXcQ
/yt risalah hati
/yt cukup
/yt never gonna give you up
```

#### `/tt [URL TikTok]`
Download video dari TikTok

**Contoh:**
```
/tt https://tiktok.com/@username/video/1234567890
/tt https://vm.tiktok.com/ZMeqwerty/
```

## 🔧 Konfigurasi

### Kualitas Audio (YouTube)
Bot menggunakan `--audio-quality 0` yang memberikan kualitas terbaik yang tersedia (biasanya 320kbps atau lebih tinggi).

### Kualitas Video (TikTok) 
Bot menggunakan `best[height<=1080]` untuk mendapatkan kualitas HD terbaik yang tersedia.

### Direktori Download
File sementara disimpan di folder `downloads/` dan otomatis dibersihkan setelah dikirim.

## 📁 Struktur Project

```
telegram-youtube-tiktok-bot/
├── bot.js              # File utama bot
├── utils.js            # Utility functions
├── package.json        # Dependencies
├── .env.example        # Template environment
├── .env               # Environment variables (buat sendiri)
├── downloads/         # Folder temporary (otomatis dibuat)
└── README.md          # Dokumentasi ini
```

## 🛠️ Troubleshooting

### Error "yt-dlp command not found"
Pastikan yt-dlp sudah terinstall dan ada di PATH:
```bash
which yt-dlp
yt-dlp --version
```

### Error "ffmpeg command not found"
Pastikan ffmpeg sudah terinstall:
```bash
which ffmpeg  
ffmpeg -version
```

### Error "BOT_TOKEN tidak valid"
- Pastikan token di file `.env` sudah benar
- Token harus dari @BotFather tanpa spasi atau karakter tambahan
- Jangan share token ke orang lain

### Bot tidak merespons
- Pastikan bot sudah di-start dengan `/start` di chat
- Cek log console untuk error
- Pastikan internet connection stable

### Download gagal
- Coba URL yang berbeda
- Beberapa video mungkin di-restrict atau private
- Tunggu beberapa saat dan coba lagi

## 🚀 Deployment

### PM2 (Recommended)
```bash
npm install -g pm2
pm2 start bot.js --name "telegram-bot"
pm2 startup
pm2 save
```

### Docker
```dockerfile
FROM node:18-alpine

RUN apk add --no-cache yt-dlp ffmpeg

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["npm", "start"]
```

### Systemd Service
```ini
[Unit]
Description=Telegram YouTube TikTok Bot
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/bot
ExecStart=/usr/bin/node bot.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

## 📝 Catatan Penting

- **Rate Limiting**: Bot memiliki rate limiting untuk mencegah spam
- **File Size**: Telegram memiliki batas ukuran file 50MB untuk bot
- **Copyright**: Hormati hak cipta, gunakan hanya untuk konten yang legal
- **Server Resources**: Download membutuhkan bandwidth dan storage

## 🤝 Kontribusi

Pull requests welcome! Untuk perubahan besar, buka issue terlebih dahulu.

## 📄 Lisensi

MIT License - lihat file LICENSE untuk detail.

## ⚠️ Disclaimer

Bot ini dibuat untuk tujuan edukasi. Pengguna bertanggung jawab atas penggunaan bot ini dan harus mematuhi hukum yang berlaku serta terms of service platform terkait.