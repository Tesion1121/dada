# 📱 Tugas2 Mahasiswa App

Sebelum menjalankan aplikasi, pastikan Anda memiliki:

- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- Android Studio (untuk emulator Android)
- Akun Firebase dengan project yang sudah dikonfigurasi

## 🛠️ Installation

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/username/tugas2-mahasiswa-app.git
   cd tugas2-mahasiswa-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Konfigurasi Firebase:**
   - Pastikan file `google-services.json` sudah ada di root folder
   - File ini berisi konfigurasi Firebase project `tugas2-128ff`

## ▶️ Menjalankan Aplikasi

### Development Mode (dengan Expo Go)

```bash
npx expo start
```

Kemudian scan QR code dengan aplikasi Expo Go di smartphone, atau tekan:
- `a` untuk Android emulator
- `w` untuk web browser

### Build untuk Android

```bash
npx expo run:android
```

### Build APK untuk Production

```bash
npx expo build:android
```

## 📱 Fitur Aplikasi

- 🔐 **Autentikasi**: Login dan register dengan Firebase Auth
- 👥 **Manajemen Mahasiswa**: CRUD data mahasiswa
- 📊 **Dashboard**: Tampilan data mahasiswa dengan pagination
- 🎨 **UI Modern**: Desain responsif dengan tema hijau
- 🔄 **Real-time Sync**: Sinkronisasi data dengan Firestore

## 🗂️ Struktur Project

```
tugas2-mahasiswa-app/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── constants/             # App constants
├── hooks/                 # Custom hooks
├── utils/                 # Utility functions
├── google-services.json   # Firebase config
└── package.json           # Dependencies
```

## 🔧 Troubleshooting

### Error: "No emulator found"
- Pastikan Android Studio terinstall
- Buat AVD (Android Virtual Device) di Android Studio
- Jalankan emulator sebelum menjalankan `npx expo run:android`

### Error: "Firebase config not found"
- Pastikan file `google-services.json` ada di root folder
- File ini didapat dari Firebase Console > Project Settings > General > Your apps

### Error: "Metro bundler error"
```bash
npx expo install --fix
```

## 📝 Catatan

- Aplikasi ini menggunakan Firebase project `tugas2-128ff`
- Data mahasiswa disimpan di collection `tugas2`
- Pastikan Firebase rules sudah dikonfigurasi untuk akses data

## 🤝 Contributing

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
