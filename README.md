# CachyOS — Desktop Metro UI (Windows Phone-Inspired)

Referensi visual, spesifikasi desain, dan panduan implementasi tampilan desktop **CachyOS** bergaya **Windows Phone / Metro UI** (flat, tajam, hitam pekat, Live Tiles, dan ringan di RAM).

---

## 1. Preview Referensi UI

Buka file `index.html` langsung di browser (tekan **`F11`** untuk fullscreen) untuk melihat referensi tampilan & interaksi:

- `index.html` — Struktur Homescreen (Start Screen), daftar aplikasi A–Z, panel Tema & Sistem, taskbar vertikal kanan, dan Lockscreen.
- `style.css` — Token warna, layout grid 16:9, sudut tajam `0px`, animasi Live Flip, dan tema Gelap/Terang.
- `script.js` — Jam/tanggal live, *type-to-search* (sembunyi sampai tombol ditekan), toggle warna aksen, play/pause musik, dan simulasi Lockscreen.

---

## 2. Target Hardware & Display

- **OS Target:** CachyOS (Arch Linux-based, Wayland).
- **Resolusi Layar:** `1920×1080` (16:9) dengan scaling `125%` (viewport logis `1536×864`).
- **Target Efisiensi RAM:** Ringan (nyaman untuk RAM `4 GB+`, memanfaatkan `zram` bawaan CachyOS, tanpa efek blur/transparansi/shadow berat).

---

## 3. Spesifikasi Desain (Wajib Diikuti)

### A. Prinsip Visual (Metro / Modern UI)
- **Sudut Tajam:** `border-radius: 0px` untuk seluruh elemen (tile, window, panel, tombol, input).
- **Flat Design:** Tanpa blur kaca (*glassmorphism*), tanpa *drop shadow* berat, tanpa gradien mengilap.
- **Tema Default:** Gelap hitam pekat (`#000000` background, `#121212` panel/surface, `#2a2a2a` border) + opsi tema Terang (`#ffffff`).
- **Warna Aksen Dinamis:** Default CachyOS Teal (`#00aba9`), mudah diganti ke warna khas Lumia lainnya (`#1ba1e2`, `#60a917`, `#e51400`, `#fa6800`, `#d80073`, `#6a00ff`, `#f0a30a`).
- **Tipografi:** Font `Selawik` (open-source resmi Microsoft pengganti `Segoe UI`, tersedia di AUR: `ttf-selawik`) atau `Segoe UI`. Header Pivot besar dengan bobot tipis (`font-weight: 300`, huruf kecil seperti `start`, `tema & sistem`).

### B. Layout Desktop (Fokus Desktop 16:9 — Tanpa Mode HP)
- **HANYA SATU Taskbar — di Sisi Kanan (`52px` vertikal, full height):**
  - **TIDAK ADA Top Bar** dan **TIDAK ADA Bottom Bar**.
  - **Bagian Atas Taskbar Kanan:** Tombol Start (`52×52` warna aksen) + pin aplikasi vertikal (`Terminal`, `Firefox`, `File Manager`, `VS Code`).
  - **TIDAK ADA tombol Workspace `1–4` di taskbar** (perpindahan workspace dilakukan murni lewat shortcut keyboard, misalnya `Super + 1/2/3/4`).
  - **Bagian Bawah Taskbar Kanan:** Tombol Tema/Pengaturan, tombol Kunci Layar, ikon tray (Wi-Fi, Volume, Baterai), serta Jam & Tanggal vertikal.
- **Homescreen (Start Screen):**
  - Area kiri/utama: 2 grup Live Tiles berdampingan pas dalam satu layar 16:9 tanpa scroll vertikal:
    1. **Utama & Sistem:** Jam/Kalender, CachyOS Monitor (RAM/zram & CPU/sched-ext), Terminal, File Manager, Browser, VS Code.
    2. **Media & Pintasan:** Cuaca, Musik (PipeWire), Octopi Package Manager, dan cluster 4 tile kecil (Pesan, Galeri, Tema, Kunci Layar).
  - Area kanan (di sebelah kiri taskbar): Daftar **Semua Aplikasi (A–Z)** dengan kotak huruf aksen khas Windows Phone.
- **Pencarian Aplikasi (Type-to-Search):**
  - Kotak pencarian **TIDAK tampil terus** (sembunyi secara default agar bersih).
  - Muncul otomatis saat user menekan huruf/angka di Start Screen atau shortcut (`Ctrl + K` / `Super`).
  - `Enter` membuka hasil teratas, `Esc` (atau hapus teks) menyembunyikan kotak pencarian.
- **Lockscreen:**
  - Jam besar tipis + tanggal di pojok kiri bawah dengan latar gelap + aksen halus.

---

## 4. Opsi Implementasi di CachyOS

Pilih salah satu jalur sesuai Desktop Environment / Window Manager yang di-install di CachyOS:

### Opsi 1 (Paling Mirip 1:1 & Paling Irit RAM — Rekomendasi): **Hyprland + Quickshell**
- **Estimasi RAM idle:** `~500 – 800 MB`.
- **Komponen:**
  - Window Manager: `hyprland` (`rounding = 0`, `blur.enabled = false`, `shadow.enabled = false`).
  - Desktop Shell (Taskbar Kanan + Start Screen Live Tiles + App List Type-to-Search): `quickshell` (QML) atau `ags`.
  - Lockscreen: `hyprlock` (jam besar Segoe/Selawik di kiri bawah).
  - Font: `ttf-selawik` (atau `ttf-segoe-ui-variable`).
  - Tema GTK/Qt: Flat dark `#000000` + aksen `#00aba9`, tanpa sudut membulat.

### Opsi 2 (Paling Praktis Harian): **KDE Plasma 6**
- **Estimasi RAM idle:** `~1.0 – 1.4 GB`.
- **Komponen:**
  - Panel tunggal di sisi kanan (`width: 52px`), nonaktifkan efek Blur & Shadow di *System Settings → Desktop Effects*.
  - Window Decoration & Application Style: Flat `0px` radius, skema warna hitam pekat (`#000000`) + aksen `#00aba9`.
  - Launcher: Widget *Tiled Menu* / *Plasmoid* custom QML bergaya Live Tiles + KRunner untuk *type-to-search* (`Alt+Space` / langsung ketik di desktop).
  - Font sistem: `Selawik`.

---

## 5. Aturan Aman Saat Pengerjaan di CachyOS

1. **Backup config lama dulu** (`~/.config/hypr`, `~/.config/quickshell`, atau `~/.config/plasma*`) sebelum menimpa konfigurasi.
2. **Jangan hapus login manager / fallback session** agar jika ada error pada shell custom, tetap bisa masuk ke terminal (`Ctrl+Alt+F3`) atau sesi bawaan.
3. **Pastikan shortcut keyboard dasar langsung aktif:**
   - `Super + 1/2/3/4`: Pindah workspace.
   - `Super`: Buka/tutup Start Screen (Live Tiles + App List).
   - `Super + Return`: Buka Terminal.
   - `Super + L`: Kunci layar (Lockscreen).
   - `Super + Q`: Tutup jendela aktif.
4. **Cek pemakaian RAM** setelah setup (`free -h`) untuk memastikan tetap ringan dan tidak ada animasi yang membebani CPU/GPU.

---

## 6. Prompt Siap Pakai (Saat Sudah di CachyOS)

Clone repo ini di CachyOS, buka folder repo-nya, lalu kirim prompt ini ke AI:

> Baca `README.md`, `index.html`, `style.css`, dan `script.js` di folder ini sebagai referensi desain utama.
> Tolong implementasikan tampilan desktop CachyOS gue (cek dulu DE/WM yang sedang terpasang di sistem ini) agar semirip mungkin dengan referensi UI tersebut:
> - Flat Metro UI (`border-radius: 0`, tanpa blur/shadow, background `#000000`, aksen `#00aba9`, font `Selawik`).
> - Hanya ada **1 taskbar vertikal di sisi kanan (`52px`)**, tanpa top bar dan tanpa tombol workspace (workspace pakai shortcut keyboard `Super + 1–4`).
> - Start Screen berisi Live Tiles + daftar aplikasi A–Z dengan *type-to-search* yang sembunyi sampai tombol ditekan.
> - Lockscreen bergaya Windows Phone.
> - Backup semua config lama sebelum mengubah apa pun, dan pastikan pemakaian RAM tetap irit.
