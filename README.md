# TaniPintar: Prototype & PRD

Prototype web clickable untuk TaniPintar (pendamping tanam), beserta PRD dan file sumber desain.

## Isi

- `prototype/`: 9 halaman HTML statis yang saling terhubung dan bisa diklik. Langsung bisa di-deploy.
- `docs/PRD-TaniPintar.md` dan `.docx`: Product Requirements Document.
- `design-source/`: file desain asli dari kanvas (format `.dc.html`).
- `AGENTS.md`: panduan untuk AI coding agent di IDE (struktur, design token, langkah lanjut).

## Jalankan lokal

```bash
cd prototype
npx serve .            # atau: python3 -m http.server 8000
```

Buka `http://localhost:3000` (atau `:8000`). File harus dibuka lewat server, bukan langsung double-click, agar gambar dan script termuat dengan benar di semua browser.

## Bagian yang interaktif

- **Beranda:** centang tugas hari ini (progres & jumlah tugas ikut berubah).
- **Jadwal rawat:** pilih hari, filter Siram/Pupuk/Periksa, centang tugas.
- **Katalog bibit:** filter kategori & "cocok untuk pemula".
- **Tutorial tanam:** langkah 1–6 dengan tombol sebelumnya/berikutnya.
- **Blog:** filter kategori.
- Semua menu, kartu, dan tombol navigasi berpindah halaman.

## Deploy

Folder `prototype/` adalah situs statis. Tidak perlu build.

- **Netlify:** drag & drop folder `prototype/` ke app.netlify.com/drop, atau `npx netlify deploy --dir=prototype --prod`.
- **Vercel:** `npx vercel prototype --prod` (pilih "Other" sebagai framework, tanpa build command).
- **GitHub Pages:** push repo, lalu set Pages ke folder `prototype/` (atau salin isinya ke `docs/`/root).
- **Cloudflare Pages:** output directory `prototype`, build command kosong.

## Catatan

- Data di prototype adalah contoh. Takaran pupuk, lama panen, dan pH perlu ditinjau penyuluh.
- Lihat `prototype/images/sumber.csv`: sebagian foto masih "Perlu verifikasi lisensi" sebelum dipakai publik.
