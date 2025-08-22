# 📋 Contoh Penggunaan Bot

## 🎵 Download YouTube ke MP3

### 1. Download dengan URL YouTube
```
/yt https://www.youtube.com/watch?v=dQw4w9WgXcQ
```
**Output:**
- Bot akan mengirim file MP3 dengan kualitas terbaik (320kbps+)
- Thumbnail original tertanam di file MP3
- Metadata lengkap (judul, artis, durasi)

### 2. Pencarian berdasarkan judul lagu
```
/yt risalah hati
```
**Output:**
- Bot akan mencari lagu "risalah hati" di YouTube
- Mendownload hasil pencarian pertama
- Mengirim MP3 dengan thumbnail dan metadata

### 3. Pencarian lagu populer
```
/yt cukup
/yt never gonna give you up
/yt bohemian rhapsody
```

## 🎬 Download TikTok Video

### 1. Download video TikTok
```
/tt https://www.tiktok.com/@username/video/1234567890123456789
```
**Output:**
- Video TikTok dalam kualitas HD terbaik
- Metadata video (judul, uploader, durasi)

### 2. Download dari link pendek TikTok
```
/tt https://vm.tiktok.com/ZMeqwerty/
```

## 🔧 Perintah Bantuan

### Melihat panduan penggunaan
```
/start
```
**Output:** Pesan selamat datang dengan panduan lengkap

### Melihat bantuan detail
```
/help
```
**Output:** Bantuan lengkap dengan contoh penggunaan

## 📊 Proses Download

### Status yang ditampilkan bot:

1. **🔍 Memproses permintaan Anda...**
   - Bot sedang memvalidasi input

2. **📥 Mendapatkan informasi video...**
   - Bot mengambil metadata dari YouTube/TikTok

3. **🔍 Mencari "judul lagu" di YouTube...**
   - Untuk pencarian berdasarkan judul

4. **⬇️ Mendownload audio/video...**
   - Proses download sedang berjalan

5. **📤 Mengirim file...**
   - Bot sedang mengirim file ke chat

6. **✅ Download selesai!**
   - File berhasil dikirim dan temporary files dibersihkan

## ❌ Pesan Error

### URL tidak valid
```
❌ URL tidak valid! Mohon masukkan URL YouTube/TikTok yang benar.
```

### Video tidak ditemukan
```
❌ Error: Gagal mendapatkan informasi video YouTube
Silakan coba lagi atau gunakan URL yang berbeda.
```

### Video di-restrict
```
❌ Error: Video ini tidak dapat didownload (mungkin di-restrict atau private)
```

## 💡 Tips Penggunaan

### Untuk YouTube:
- Gunakan URL lengkap untuk hasil terbaik
- Pencarian judul lagu akan mengambil hasil pertama
- Bot mendukung berbagai format URL YouTube (youtube.com, youtu.be)

### Untuk TikTok:
- Pastikan video bersifat public
- Bot mendukung URL pendek dan URL lengkap
- Kualitas video disesuaikan dengan yang tersedia (maksimal HD)

### Umum:
- Tunggu hingga proses selesai sebelum mengirim perintah baru
- File akan otomatis dibersihkan setelah dikirim
- Bot memiliki rate limiting untuk mencegah spam

## 🚀 Fitur Khusus

### Audio MP3:
- ✅ Kualitas 320kbps atau lebih tinggi
- ✅ Thumbnail original tertanam
- ✅ Metadata lengkap (ID3 tags)
- ✅ Nama file sesuai judul lagu

### Video TikTok:
- ✅ Kualitas HD terbaik yang tersedia
- ✅ Metadata video lengkap
- ✅ Support berbagai format TikTok URL
- ✅ Tanpa watermark (jika memungkinkan)

## 📝 Catatan Penting

- **Waktu Proses:** Download bisa memakan waktu 1-5 menit tergantung ukuran file
- **Ukuran File:** Maksimal 50MB sesuai batasan Telegram
- **Copyright:** Gunakan hanya untuk konten yang legal dan sesuai hukum
- **Rate Limit:** Jangan spam perintah, tunggu hingga proses selesai