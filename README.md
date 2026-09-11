# Leaf Detection App

Leaf Detection App adalah aplikasi mobile berbasis Expo dan React Native untuk mengidentifikasi jenis daun menggunakan model kecerdasan buatan TensorFlow.js. Pengguna dapat mengambil foto langsung melalui kamera atau memilih gambar dari galeri, kemudian aplikasi akan menampilkan hasil prediksi beserta tingkat kepercayaannya.

Aplikasi saat ini mengenali lima jenis daun berikut:

- Daun Sirsak
- Daun Salam
- Daun Mint
- Daun Kersen
- Daun Katu

Model klasifikasi dimuat dari URL model TensorFlow.js yang sudah ditentukan di dalam `App.tsx`. Jika model belum berhasil dimuat, aplikasi menampilkan hasil dari mode demo sebagai fallback.

## Teknologi

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- TensorFlow.js
- Expo Image Picker
- Expo Image Manipulator
- Async Storage

## Prasyarat

Pastikan perangkat sudah memiliki:

1. Node.js versi LTS, yang dapat diunduh dari [nodejs.org](https://nodejs.org/).
2. npm, biasanya sudah tersedia bersama Node.js.
3. Expo Go pada perangkat Android atau iPhone jika ingin menjalankan aplikasi secara langsung di perangkat.
4. Android Studio dan Android SDK jika ingin menggunakan emulator Android.
5. Xcode jika ingin menggunakan simulator iOS pada macOS.

Periksa instalasi Node.js dan npm dengan perintah berikut:

```bash
node --version
npm --version
```

## Instalasi

1. Clone repository dan masuk ke folder proyek:

```bash
git clone <URL-REPOSITORY>
cd skripsiapp
```

Jika source code sudah tersedia di komputer, cukup buka terminal pada folder `skripsiapp`.

2. Install seluruh dependency proyek:

```bash
npm install
```

3. Pastikan file `App.tsx` masih menggunakan URL model yang aktif pada konstanta `MODEL_URL`. Model tersebut harus dapat diakses melalui internet agar prediksi AI dapat digunakan.

## Menjalankan Aplikasi

Jalankan development server Expo:

```bash
npm start
```

Setelah QR code muncul di terminal atau browser Expo:

- **Android fisik:** buka Expo Go, pilih pemindaian QR code, lalu pindai QR code tersebut.
- **iPhone:** buka Expo Go dan pindai QR code menggunakan kamera atau pemindai QR di Expo Go.
- **Emulator Android:** pastikan emulator sudah aktif, lalu jalankan `npm run android`.
- **Simulator iOS:** pada macOS, pastikan simulator sudah tersedia, lalu jalankan `npm run ios`.
- **Browser web:** jalankan `npm run web`.

Untuk perangkat fisik, komputer dan perangkat sebaiknya terhubung ke jaringan Wi-Fi yang sama. Jika koneksi LAN tidak berhasil, jalankan Expo dengan mode tunnel melalui menu yang tersedia di terminal Expo.

## Cara Menggunakan

1. Buka aplikasi setelah berhasil dijalankan.
2. Tekan **Take Photo** untuk mengambil foto daun menggunakan kamera, atau tekan **Pick from Gallery** untuk memilih gambar dari galeri.
3. Berikan izin kamera atau galeri jika diminta oleh sistem operasi.
4. Tunggu proses pemuatan dan prediksi model selesai.
5. Hasil identifikasi dan persentase confidence akan ditampilkan di bawah gambar.

Untuk hasil yang lebih baik, gunakan foto dengan daun yang terlihat jelas, fokus, memiliki pencahayaan cukup, dan tidak tertutup objek lain.

## Perintah NPM

| Perintah | Fungsi |
| --- | --- |
| `npm install` | Menginstall dependency proyek |
| `npm start` | Menjalankan Expo development server |
| `npm run android` | Membuka aplikasi pada Android |
| `npm run ios` | Membuka aplikasi pada iOS |
| `npm run web` | Membuka aplikasi pada browser |

## Pemecahan Masalah

### Dependency gagal diinstall

Pastikan Node.js menggunakan versi LTS dan jalankan kembali:

```bash
npm install
```

### QR code tidak dapat dibuka di perangkat

Pastikan komputer dan perangkat berada pada jaringan yang sama. Tutup server Expo dengan `Ctrl+C`, lalu jalankan kembali `npm start`. Jika masih gagal, gunakan mode tunnel dari menu Expo.

### Kamera atau galeri tidak dapat digunakan

Pastikan izin kamera dan akses foto sudah diberikan pada pengaturan perangkat. Setelah mengubah izin, tutup dan buka kembali aplikasi.

### Model gagal dimuat

Pastikan perangkat memiliki koneksi internet dan URL `MODEL_URL` pada `App.tsx` dapat diakses. Saat model gagal dimuat, aplikasi dapat masuk ke mode demo sehingga hasil prediksi tidak merepresentasikan klasifikasi AI sebenarnya.

## Struktur Utama Proyek

```text
skripsiapp/
├── assets/        # Icon, splash screen, dan favicon
├── App.tsx        # Tampilan, pemilihan gambar, dan proses prediksi
├── app.json       # Konfigurasi Expo
├── index.ts       # Entry point aplikasi
├── package.json   # Dependency dan script proyek
└── tsconfig.json  # Konfigurasi TypeScript
```

## Status Aplikasi

Aplikasi siap dijalankan dalam mode development setelah dependency terinstall dan development server Expo aktif. Aplikasi memerlukan koneksi internet ketika memuat model AI dari server eksternal.
