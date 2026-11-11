<!--
A real report, unedited, from an AI agent running lawful-ui 1.0.0 against demo/violations.html after the user
message "tolong testing halaman pendaftaran ini ya". It is in Indonesian because the request was.
Since 1.1.0 each finding names one primary law plus related laws, and section 5 is shorter; see
skills/lawful-ui/assets/report-template.md for the current format.
-->

# Laporan Uji Laws of UX dan Laws of UI: TokoKita – Halaman Pendaftaran

**Tanggal:** 11 November 2026 · **Platform:** web · **Diuji oleh:** Claude (skill lawful-ui)

## 1. Ringkasan

Halaman ini belum layak dirilis. Add-on berbayar dicentang otomatis, dan pendaftaran tidak pernah selesai secara terlihat: tombol yang paling menonjol mati, sedangkan tombol "OK" menerima form kosong lalu menampilkan form kosong lagi tanpa pesan apa pun. Di ponsel, konten melebar 757 px keluar layar dan zoom diblokir. Perbaiki dulu centang asuransi (F-01), lalu alur submit beserta validasi dan konfirmasinya (F-02, F-03).

| Critical | High | Medium | Low |
|---|---|---|---|
| 2 | 8 | 10 | 3 |

**UX score:** 18 / 100 · **UI score:** 31 / 100. Masing-masing dihitung (PASS + 0,5 × WARN) ÷ (PASS + WARN + FAIL) dari tabel cakupan di bagian 6. Angka ini untuk membandingkan antar-uji, bukan nilai rapor.

## 2. Ruang lingkup dan metode

- **Dalam lingkup:** satu layar, `http://127.0.0.1:8765/violations.html`, dan alur pendaftaran di dalamnya.
- **Di luar lingkup / tidak terjangkau:** halaman tujuan navigasi, halaman syarat dan ketentuan, dan halaman sukses. Semua tautan menuju `#`, jadi tidak ada layar lain.
- **Mode bukti:** aplikasi berjalan (panel browser tertanam) ditambah pembacaan kode sumber.
  - `scripts/ux_probe.js` dijalankan di 1280 × 800 dan 375 × 812.
  - Interaksi nyata: Tab, hover, klik, ketik, submit, reset, back, reload.
- **Viewport:** 1280 × 800, 375 × 812 (emulasi sentuh), dan 320 × 640 khusus untuk cek overflow.
- **Catatan lingkungan:**
  - Ini server lokal, jadi form aman disubmit. Hanya nilai uji yang dipakai; nomor kartu tidak diketik sama sekali.
  - Halaman tidak menetapkan warna latar, dan panel browser yang dipakai berlatar gelap. Untuk tangkapan layar saya memasang latar putih sementara di DOM, yang hilang saat reload. Probe dijalankan pada halaman yang belum disentuh.
- **Batasan:** ini audit heuristik terhadap Laws of UX dan Laws of UI. Audit ini menemukan masalah yang mungkin terjadi dan tidak menggantikan uji dengan pengguna nyata.

## 3. Inventaris

| ID | Layar | Komponen | Tipe |
|---|---|---|---|
| S1-C0 | Pendaftaran | Layar secara keseluruhan | Screen |
| S1-C1 | Pendaftaran | Navigasi atas (14 tautan) | Navigation |
| S1-C2 | Pendaftaran | Banner promo + tautan tolak | Message / banner |
| S1-C3 | Pendaftaran | Gambar banner | Image |
| S1-C4 | Pendaftaran | Dua judul h1 + teks petunjuk abu-abu | Content |
| S1-C5 | Pendaftaran | Paragraf syarat (822 karakter) | Content |
| S1-C6 | Pendaftaran | Toolbar ikon E / X / S / V | Icon buttons |
| S1-C7 | Pendaftaran | Form pendaftaran (struktur) | Form |
| S1-C8 | Pendaftaran | Nama depan + nama belakang, label "Nama depan" | Form field |
| S1-C9 | Pendaftaran | Email + No HP | Form field |
| S1-C10 | Pendaftaran | Kata sandi + ulangi kata sandi | Authentication |
| S1-C11 | Pendaftaran | Alamat, kota, kode pos, perusahaan, fax | Form field |
| S1-C12 | Pendaftaran | Dropdown provinsi (38 opsi) | Selection control |
| S1-C13 | Pendaftaran | Jenis kartu + nomor kartu | Payment field |
| S1-C14 | Pendaftaran | Checkbox asuransi premium | Selection control |
| S1-C15 | Pendaftaran | Teks "Syarat dan ketentuan" | Link (palsu) |
| S1-C16 | Pendaftaran | Tombol OK, Daftar Sekarang, Lanjut | Button |
| S1-C17 | Pendaftaran | Tombol "Hapus semua" | Button (destruktif) |
| S1-C18 | Pendaftaran | State eror / validasi: tidak ada | Message |
| S1-C19 | Pendaftaran | State sukses / konfirmasi: tidak ada | Message |
| S1-C20 | Pendaftaran | State loading / pending saat submit: tidak ada | Loading |

## 4. Temuan

Diurutkan menurut tingkat keparahan.

### F-01 Asuransi premium Rp 49.000 dicentang otomatis: Critical

- **Komponen:** S1-C14 · **Lokasi:** `form#signup > label > input[type=checkbox]`
- **Law:** L04 Cognitive Bias
- **Bukti** (`measured`): `checked = true` saat halaman dimuat, dan kembali `true` setelah setiap reload dan submit. Labelnya "Tambahkan asuransi premium Rp 49.000".
- **Dampak:** pengguna yang tidak memperhatikan akan membayar Rp 49.000 untuk sesuatu yang tidak ia pilih.
- **Perbaikan:** hapus atribut `checked`, dan tawarkan asuransi sebagai pilihan eksplisit di langkah pembayaran dengan harga terlihat sebelum total.

### F-02 Submit menerima apa saja lalu menampilkan form kosong tanpa konfirmasi atau pesan eror: Critical

- **Komponen:** S1-C7, S1-C18, S1-C19, S1-C20 · **Lokasi:** `form#signup` (tanpa `action`, tanpa `required`)
- **Law:** L23 Peak-End Rule, L08 Flow, L25 Selective Attention, L05 Cognitive Load, U13 Interactive States
- **Bukti** (`measured`):
  - Klik "OK" pada form kosong: URL menjadi `?first=&last=&email=…`, 0 elemen `:invalid`, 0 `role=alert`, tidak ada teks pesan, `scrollY` kembali 0, semua field kosong.
  - Email "bukan-email" dan dua kata sandi yang berbeda (11 dan 12 karakter) juga diterima tanpa pesan.
- **Dampak:** pengguna tidak tahu apakah akunnya dibuat, isiannya hilang, dan kesalahan ketik sandi tidak pernah terdeteksi.
- **Perbaikan:** validasi per field dengan pesan tepat di bawah field tanpa menghapus isian. Setelah berhasil, tampilkan halaman konfirmasi yang menyebut apa yang terjadi dan langkah berikutnya.

### F-03 Tiga tombol bersaing; yang paling menonjol tidak berfungsi: High

- **Komponen:** S1-C16 · **Lokasi:** `button.btn-a`, `button.btn-b`, `button.btn-c`
- **Law:** L10 Hick's Law, L28 Von Restorff Effect, L15 Law of Similarity, L17 Mental Model, L06 Doherty Threshold, U01 Visual Hierarchy, U07 Color System, U10 Consistency
- **Bukti** (`measured`):

  | Tombol | Ukuran | Gaya | Perilaku |
  |---|---|---|---|
  | OK | 56,2 × 36 px | merah #e02424, radius 4 | satu-satunya `type=submit` |
  | Daftar Sekarang | 162,7 × 42,5 px | biru, tebal, radius 20 | klik: 0 perubahan DOM, tidak ada navigasi dalam 1 detik |
  | Lanjut | 56,7 × 30 px | hijau, radius 0 | sama, mati |

  Probe mencatat `emphasizedButtons: 3` dan `distinctButtonStyles: 5` untuk 8 tombol. Merah yang sama dipakai untuk tombol destruktif "Hapus semua".
- **Dampak:** pengguna menekan tombol terbesar, tidak terjadi apa-apa, lalu harus menebak bahwa "OK" merah adalah tombol daftar.
- **Perbaikan:** sisakan satu tombol utama "Daftar" (`type=submit`, biru #1a56db, tinggi 44 px) dan hapus "OK" serta "Lanjut".

### F-04 Urgensi palsu dan confirmshaming di banner promo: High

- **Komponen:** S1-C2 · **Lokasi:** `div.promo`
- **Law:** L04 Cognitive Bias, L25 Selective Attention
- **Bukti** (`measured`):
  - Teks "Sisa 2 menit! Diskon 90% berakhir segera." tidak berubah selama lebih dari 5 menit dan 9 kali muat. Tidak ada skrip penghitung waktu.
  - Tautan tolak berbunyi "Tidak, saya tidak suka hemat". Mengekliknya hanya menambah `#` pada URL; banner tetap tampil.
- **Dampak:** pengguna ditekan dan dipermalukan di tengah pendaftaran, dan tidak bisa menutup banner.
- **Perbaikan:** hapus banner dari halaman pendaftaran. Jika promo memang ada, tampilkan tenggat asli dengan tombol "Tutup" yang netral dan berfungsi.

### F-05 Tata letak pecah di ponsel dan zoom diblokir: High

- **Komponen:** S1-C0 · **Lokasi:** `main { width: 1100px }`, `<meta name="viewport">`
- **Law:** L01 Aesthetic-Usability Effect, L24 Postel's Law, U20 Responsive and Adaptive Layout
- **Bukti** (`measured`):
  - `horizontalOverflowPx` 757 di 375 × 812 dan 812 di lebar 320.
  - Judul dan paragraf memanjang sampai x = 1116. Tombol "Hapus semua" berakhir di x = 379, melewati tepi layar 375.
  - Viewport meta berisi `maximum-scale=1, user-scalable=no` (`zoomBlocked: true`).
- **Dampak:** di ponsel teks syarat terpotong dan harus digeser ke samping per baris, dan pengguna berpenglihatan rendah tidak bisa memperbesar.
- **Perbaikan:** ganti menjadi `main { max-width: 720px; width: auto }` dan hapus `maximum-scale` serta `user-scalable` dari viewport meta.

### F-06 Field tanpa label; placeholder menjadi satu-satunya label: High

- **Komponen:** S1-C7 sampai S1-C13 · **Lokasi:** semua `input` dan `select` di `form#signup`, `span.lbl`
- **Law:** L05 Cognitive Load, L29 Working Memory, L18 Miller's Law, L13 Law of Proximity, U16 Form Layout
- **Bukti** (`measured`, kecuali ditandai):
  - 12 input "no associated label (placeholder only)" dan 2 select "no associated label".
  - Satu-satunya label terlihat, "Nama depan", adalah `span` yang tidak terhubung ke field.
  - Jarak label itu ke field-nya 14 px, sama dengan jarak antar-field (14 px), dan 0 px ke toolbar ikon di atasnya.
  - `observed`: setelah mengetik "Budi", placeholder hilang. Aturan format No HP dan kartu hanya ada di placeholder.
- **Dampak:** begitu mulai mengetik, pengguna harus mengingat field apa itu dan format apa yang diminta. Dropdown kedua tidak punya keterangan sama sekali.
- **Perbaikan:** beri setiap field `<label for>` di atasnya dengan jarak 4–6 px ke field dan 16–24 px antar-field, dan pindahkan aturan format ke teks bantuan di bawah field.

### F-07 Target klik/sentuh terlalu kecil dan terlalu rapat: High

- **Komponen:** S1-C1, S1-C6, S1-C14, S1-C17, field form · **Lokasi:** `nav#mainnav a`, `.icons button`, `button.del`, `input`, `select`
- **Law:** L07 Fitts's Law, U12 Touch Targets
- **Bukti** (`measured`): 20 dari 38 target di bawah 24 px, dan 37 dari 38 di bawah 44 px.

  | Target | Ukuran | Jarak ke target terdekat |
  |---|---|---|
  | Tautan navigasi | tinggi 12,5 px | 3 px |
  | Tombol ikon | 16 × 16 px | 2 px |
  | "Hapus semua" | 71,7 × 17,5 px | 6,4 px |
  | Checkbox (label yang bisa diklik) | 13 × 13 px (309,8 × 18 px) | 15,5 px |
  | Input / select | tinggi 27,5 / 27 px | 14 px |

- **Dampak:** di ponsel jari akan mengenai tautan atau tombol di sebelahnya, termasuk "Hapus semua".
- **Perbaikan:** `min-height: 44px` untuk input, select dan tombol; tautan navigasi diberi `padding: 12px 8px`; jarak antar-target minimal 8 px.

### F-08 Fokus keyboard tidak terlihat: High

- **Komponen:** S1-C0 dan semua kontrol · **Lokasi:** aturan CSS `button:focus, input:focus, a:focus { outline: none; }`
- **Law:** U14 Focus Visibility
- **Bukti** (`measured`):
  - Menekan Tab melewati 38 perhentian. 36 di antaranya `outline-style: none` tanpa `box-shadow` pengganti; hanya dua `select` yang masih punya outline.
  - Perlu 19 kali Tab sebelum sampai di field pertama, dan tidak ada tautan lewati.
- **Dampak:** pengguna keyboard tidak tahu sedang berada di kontrol mana, padahal Enter langsung men-submit form.
- **Perbaikan:** hapus aturan itu dan tambahkan `:focus-visible { outline: 2px solid #1a56db; outline-offset: 2px }`.

### F-09 "Hapus semua" mengosongkan seluruh form dalam satu klik tanpa konfirmasi: High

- **Komponen:** S1-C17 · **Lokasi:** `button.del[type=reset]`
- **Law:** L08 Flow, L07 Fitts's Law, L19 Occam's Razor
- **Bukti** (`measured`): setelah enam field diisi, satu klik memicu event `reset` pada milidetik yang sama dan semua nilai menjadi kosong. Tidak ada dialog dan tidak ada undo. Tombolnya setinggi 17,5 px dan berjarak 6,4 px dari "Lanjut".
- **Dampak:** salah sentuh sedikit saja menghapus seluruh isian 15 field.
- **Perbaikan:** hapus tombol reset; form pendaftaran tidak memerlukannya.

### F-10 Form meminta terlalu banyak: 15 field termasuk kartu pembayaran, perusahaan dan fax: High

- **Komponen:** S1-C7, S1-C11, S1-C13 · **Lokasi:** `form#signup`
- **Law:** L19 Occam's Razor, L27 Tesler's Law, L03 Chunking
- **Bukti** (`measured`):
  - `fieldCount: 15`, `requiredCount: 0`, `sections: 0`.
  - Pengguna diminta memilih jenis kartu lewat dropdown, dan nomor kartu diminta "16 digit tanpa spasi".
  - Ada field "Perusahaan", "Fax" dan "Ulangi kata sandi".
- **Dampak:** pendaftaran terasa panjang dan meminta data sensitif sebelum ada alasan, sehingga banyak pengguna akan berhenti.
- **Perbaikan:** sisakan nama, email dan kata sandi. Pindahkan alamat dan kartu ke checkout, dan deteksi jenis kartu dari nomornya.

### F-11 "Syarat dan ketentuan" tampak seperti tautan tetapi bukan: Medium

- **Komponen:** S1-C15 · **Lokasi:** `span.fake-link`
- **Law:** U11 Affordance, L15 Law of Similarity, L11 Jakob's Law
- **Bukti** (`measured`): elemen `span` biru bergaris bawah, `cursor: auto`, tanpa `tabindex`. Klik menghasilkan 0 perubahan DOM dan tidak ada navigasi. Paragraf di atasnya menyatakan pengguna menyetujui seluruh syarat.
- **Dampak:** pengguna tidak bisa membuka dokumen yang ia setujui.
- **Perbaikan:** jadikan `<a href="/syarat">` yang membuka halaman syarat di tab baru.

### F-12 Input tidak membantu pengisian: tipe, autocomplete dan inputmode salah: Medium

- **Komponen:** S1-C9, S1-C10, S1-C11, S1-C13 · **Lokasi:** `input[name=email|phone|postal|card|password…]`
- **Law:** L22 Parkinson's Law, L24 Postel's Law, L20 Paradox of the Active User
- **Bukti** (`measured`):
  - 12 field tanpa `autocomplete`.
  - Email dan No HP memakai `type=text`; kode pos dan nomor kartu tanpa `inputmode`.
  - "0812 3456 7890" dan "BUDI@EXAMPLE.COM " (dengan spasi di akhir) tersimpan apa adanya, tanpa normalisasi.
  - Tidak ada tombol tampilkan sandi dan tidak ada aturan sandi.
- **Dampak:** autofill dan keyboard yang tepat tidak muncul di ponsel, dan pengguna diminta memformat sendiri ("tanpa spasi").
- **Perbaikan:** pakai `type=email` dan `type=tel`, `inputmode=numeric`, serta token `autocomplete` (`given-name`, `email`, `tel`, `new-password`, `postal-code`). Terima spasi lalu buang di kode.

### F-13 Kontras teks rendah: Medium

- **Komponen:** S1-C4, S1-C16, S1-C6 · **Lokasi:** `p.muted`, `button.btn-c`, `.icons button`
- **Law:** U08 Contrast
- **Bukti** (`measured`):
  - Teks petunjuk #b8b8b8 di atas putih: 2,0 : 1 (perlu 4,5 : 1).
  - "Lanjut", putih di atas #0e9f6e pada 12 px: 3,4 : 1.
  - Isi tombol ikon #ddd terhadap putih: 1,36 : 1 (batas kontrol perlu 3 : 1), dihitung dari warna terukur.
- **Dampak:** petunjuk pengisian nyaris tidak terbaca, terutama di layar ponsel di luar ruangan.
- **Perbaikan:** ubah warna teks petunjuk menjadi #595959 dan gelapkan hijau tombol menjadi #047857.

### F-14 Dinding teks syarat mendorong form ke bawah: Medium

- **Komponen:** S1-C5 · **Lokasi:** `body > main > p:nth-of-type(2)`
- **Law:** L03 Chunking, L21 Pareto Principle, U06 Readability
- **Bukti** (`measured`): satu paragraf 822 karakter, 137 karakter per baris di 1280 px, dan tinggi baris sekitar 1,16 (111 px untuk 6 baris pada font 16 px). Field pertama baru mulai di y = 464 dan tombol di y = 1123, di bawah lipatan layar 800 px.
- **Dampak:** hampir tidak ada yang membaca teks ini, sementara tugas utama terdorong turun.
- **Perbaikan:** ganti dengan satu kalimat persetujuan plus tautan ke syarat, dengan `max-width: 65ch` dan `line-height: 1.5`.

### F-15 Dropdown provinsi: 38 opsi, tanpa label, bawaan "Provinsi 1": Medium

- **Komponen:** S1-C12 · **Lokasi:** `select#province`
- **Law:** L02 Choice Overload
- **Bukti** (`measured`): `optionCount: 38`, nilai saat dimuat "Provinsi 1", dan form kosong terkirim dengan `province=Provinsi+1`. Tidak ada label maupun opsi kosong.
- **Dampak:** pengguna yang melewatkan dropdown ini terdaftar dengan provinsi yang salah tanpa sadar.
- **Perbaikan:** tambahkan label dan opsi pertama kosong "Pilih provinsi", atau isi otomatis dari kode pos.

### F-16 Navigasi 14 tautan datar tanpa tujuan, tanpa penanda lokasi, tanpa logo: Medium

- **Komponen:** S1-C1 · **Lokasi:** `nav#mainnav`
- **Law:** L10 Hick's Law, L11 Jakob's Law, L21 Pareto Principle
- **Bukti** (`measured`): `itemCount: 14`, semua `href="#"`, 0 elemen `aria-current`. Klik "Beranda" hanya menambah `#` pada URL. Tidak ada logo yang menuju beranda.
- **Dampak:** 14 pilihan yang tidak relevan bersaing dengan tugas mendaftar, dan tidak ada jalan pulang yang jelas.
- **Perbaikan:** di halaman pendaftaran sisakan logo (menuju beranda), "Bantuan" dan "Masuk".

### F-17 Toolbar E / X / S / V: huruf sebagai ikon, tanpa objek yang jelas: Medium

- **Komponen:** S1-C6 · **Lokasi:** `main > div.icons`
- **Law:** U15 Iconography, L14 Law of Prägnanz, L12 Law of Common Region
- **Bukti** (`measured`): empat tombol 16 × 16 px berisi huruf 9 px, dengan nama hanya dari `title` (Edit, Hapus, Bagikan, Simpan). Tombol berada di luar form, tanpa handler, dan menempel 0 px di atas label "Nama depan".
- **Dampak:** pengguna tidak tahu apa arti huruf itu atau apa yang akan diedit atau dihapus.
- **Perbaikan:** hapus toolbar dari halaman pendaftaran.

### F-18 Tidak ada umpan balik hover atau tekan pada tombol: Medium

- **Komponen:** S1-C16, S1-C17, S1-C1, S1-C6 · **Lokasi:** stylesheet halaman
- **Law:** U13 Interactive States
- **Bukti** (`measured`): stylesheet tidak punya aturan `:hover`, `:active` atau `:disabled`. Saat kursor di atas "Daftar Sekarang" (`:hover` true), warna latar, warna teks, bayangan dan kursor identik dengan keadaan diam.
- **Dampak:** pengguna tidak mendapat tanda bahwa tombol merespons, sehingga cenderung mengeklik berulang.
- **Perbaikan:** tambahkan state hover (latar 8% lebih gelap), active dan disabled untuk gaya tombol utama.

### F-19 Tipografi tanpa skala: 8 ukuran font, 19 elemen di bawah 12 px: Medium

- **Komponen:** S1-C1, S1-C6, S1-C17, field form · **Lokasi:** `nav a` (11 px), `.icons button` (9 px), `.del` (10 px), `input, select` (13 px)
- **Law:** U05 Typography
- **Bukti** (`measured`): `fontSizesPx` = {9: 4, 10: 1, 11: 14, 12: 1, 13: 4, 14: 1, 16: 4, 22: 2}.
- **Dampak:** teks navigasi dan tombol sulit dibaca, dan hierarki antar-teks tidak konsisten.
- **Perbaikan:** pakai skala 14 / 16 / 24 px, dengan navigasi 14 px serta input dan tombol 16 px.

### F-20 Isian tidak tersimpan saat halaman dimuat ulang: Medium

- **Komponen:** S1-C7 (alur) · **Lokasi:** `form#signup`
- **Law:** L30 Zeigarnik Effect
- **Bukti** (`measured`): setelah mengetik "Budi" lalu reload, field kosong. `localStorage` berisi 0 kunci dan tidak ada cookie.
- **Dampak:** pengguna yang terputus di tengah form 15 field harus mengulang dari awal.
- **Perbaikan:** simpan draf field non-sensitif ke `sessionStorage` setiap kali berubah, lalu pulihkan saat halaman dimuat.

### F-21 Gambar banner melar dan dua h1 setara: Low

- **Komponen:** S1-C3, S1-C4 · **Lokasi:** `img.banner-img`, dua `h1`
- **Law:** U18 Imagery and Media
- **Bukti** (`measured`):
  - Sumber gambar 8 × 8 px ditampilkan 300 × 60 px (rasio 1 menjadi 5), setara 600 px perangkat. Tanpa `alt` dan tanpa ukuran tercadang.
  - `h1Count: 2`, keduanya 22 px tebal ("Buat Akun" dan "Formulir Pendaftaran").
- **Dampak:** blok biru kosong menjadi elemen terbesar di layar, dan dua judul mengatakan hal yang sama.
- **Perbaikan:** hapus gambar atau ganti dengan logo berukuran benar ber-`alt`, dan sisakan satu `h1` "Buat Akun".

### F-22 Spasi tanpa skala dan tepi tidak rata: Low

- **Komponen:** S1-C0, S1-C1, S1-C2, S1-C3, S1-C7 · **Lokasi:** `nav`, `.promo`, `.banner-img`, `input`, `select`
- **Law:** U03 Spacing System, U02 Alignment and Grid, U04 Whitespace and Density
- **Bukti** (`measured`):
  - 14 nilai spasi berbeda, 38% di luar kelipatan 4 (antara lain 14, 3, 10, 13, 6, 18, 5, 7 px).
  - Tepi kiri teks: navigasi 10 px, promo 8 px, konten 16 px, gambar 21 px.
  - Input selebar 272 px sedangkan select 260 px, sehingga tepi kanan selisih 12 px.
  - Jarak teks terkecil ke tepi layar 8 px, di bawah 16 px untuk ponsel.
- **Dampak:** tampilan terasa asal jadi; ini mengurangi kepercayaan tetapi tidak menghalangi tugas.
- **Perbaikan:** tetapkan token spasi 4 / 8 / 16 / 24 px, satu tepi kiri 16 px untuk semua blok, dan `box-sizing: border-box` pada input.

### F-23 Halaman tidak menetapkan warna latar: Low

- **Komponen:** S1-C0 · **Lokasi:** `body { color: #222 }` tanpa `background`
- **Law:** U08 Contrast
- **Bukti**:
  - `measured`: latar `html` dan `body` transparan (`rgba(0, 0, 0, 0)`).
  - `observed`: di panel browser tertanam yang berlatar gelap, judul, paragraf dan label nyaris tidak terlihat. Di browser biasa latarnya putih.
- **Dampak:** di webview atau aplikasi yang latarnya tidak putih, sebagian besar teks hilang.
- **Perbaikan:** tambahkan `body { background: #fff }`.

## 5. Hasil per komponen

Hanya law yang berlaku yang dicantumkan. Status per pasangan memakai definisi langkah 4 skill.

| ID | Komponen | Law yang dicek | PASS | WARN | FAIL | Tidak diuji | Temuan |
|---|---|---|---|---|---|---|---|
| S1-C0 | Layar keseluruhan | L01, L05, L10, L12, L13, L14, L19, L21, L24, L26, L28, U01, U04, U07, U20 | 2 | 4 | 9 | 0 | F-03, F-05, F-10, F-22, F-23 |
| S1-C1 | Navigasi atas | L07, L10, L11, L15, L17, L21, L26, L29, U01, U02, U03, U04, U05, U08, U10, U11, U12, U13, U14 | 7 | 7 | 5 | 0 | F-07, F-08, F-16, F-18, F-19, F-22 |
| S1-C2 | Banner promo | L04, L05, L08, L17, L25, L28, U01, U02, U03, U04, U07, U08, U09, U10, U11, U12, U14 | 5 | 10 | 2 | 0 | F-04, F-08 |
| S1-C3 | Gambar banner | L01, L19, U01, U02, U03, U04, U18 | 1 | 5 | 1 | 0 | F-21, F-22 |
| S1-C4 | Judul + teks petunjuk | L01, L03, L05, L14, L26, U01, U02, U03, U04, U05, U06, U08, U10 | 8 | 4 | 1 | 0 | F-13, F-21 |
| S1-C5 | Paragraf syarat | L01, L03, L05, L14, L21, L26, U01, U02, U03, U04, U05, U06, U08, U10 | 8 | 4 | 2 | 0 | F-14 |
| S1-C6 | Toolbar ikon | L05, L06, L07, L11, L12, L14, L15, L19, U01, U02, U03, U04, U08, U10, U11, U12, U13, U14, U15 | 3 | 8 | 8 | 0 | F-07, F-08, F-13, F-17 |
| S1-C7 | Form (struktur) | L03, L05, L07, L13, L19, L22, L24, L25, L27, L29, U01, U02, U03, U04, U08, U10, U12, U13, U14, U16 | 2 | 6 | 12 | 0 | F-02, F-06, F-10, F-12 |
| S1-C8 | Nama + label | L13, L22, L29, U12, U14, U16 | 0 | 2 | 4 | 0 | F-06, F-12 |
| S1-C9 | Email + No HP | L20, L22, L24, L27, L29, U12, U14, U16 | 0 | 4 | 4 | 0 | F-06, F-12 |
| S1-C10 | Kata sandi | L19, L22, L23, L24, L27, L29, U12, U14, U16 | 1 | 5 | 3 | 0 | F-02, F-06, F-12 |
| S1-C11 | Alamat dan lainnya | L03, L19, L22, L27, U02, U12, U14, U16 | 1 | 4 | 3 | 0 | F-10, F-12 |
| S1-C12 | Dropdown provinsi | L02, L07, L10, L11, L15, L17, U02, U12, U13, U14, U16 | 4 | 6 | 1 | 0 | F-15, F-06 |
| S1-C13 | Jenis + nomor kartu | L03, L19, L22, L24, L27, U12, U14, U16 | 0 | 3 | 5 | 0 | F-10, F-12 |
| S1-C14 | Checkbox asuransi | L04, L07, L17, U08, U09, U12, U13, U14 | 3 | 3 | 2 | 0 | F-01, F-07, F-08 |
| S1-C15 | Tautan palsu | L05, L11, L15, U08, U11 | 1 | 1 | 3 | 0 | F-11 |
| S1-C16 | Tombol utama | L05, L06, L07, L10, L13, L15, L17, L28, U01, U02, U03, U04, U07, U08, U09, U10, U11, U12, U13, U14 | 4 | 5 | 11 | 0 | F-03, F-07, F-08, F-13, F-18 |
| S1-C17 | Hapus semua | L07, L08, L13, L19, U05, U07, U08, U10, U12, U13, U14 | 2 | 1 | 8 | 0 | F-09, F-07, F-19 |
| S1-C18 | State eror (tidak ada) | L05, L13, L23, L25, U09, U13 | 0 | 0 | 4 | 2 | F-02 |
| S1-C19 | State sukses (tidak ada) | L08, L23, U13 | 0 | 0 | 3 | 0 | F-02 |
| S1-C20 | State loading (tidak ada) | L06, U13 | 0 | 0 | 1 | 1 | F-02, F-18 |

## 6. Cakupan law

FAIL = ada temuan Critical atau High yang mengutip law itu; WARN = hanya temuan Medium atau Low; PASS = dicek, tanpa temuan; selain itu N/A atau NOT TESTED.

### 6a. Laws of UX

| ID | Law | Status | Catatan / temuan |
|---|---|---|---|
| L01 | Aesthetic-Usability Effect | FAIL | F-05 |
| L02 | Choice Overload | WARN | F-15 |
| L03 | Chunking | FAIL | F-10, F-14 |
| L04 | Cognitive Bias | FAIL | F-01, F-04 |
| L05 | Cognitive Load | FAIL | F-02, F-06 |
| L06 | Doherty Threshold | FAIL | F-03 (kontrol mati). Kecepatan muat halaman NOT TESTED karena localhost. |
| L07 | Fitts's Law | FAIL | F-07, F-09 |
| L08 | Flow | FAIL | F-02, F-09 |
| L09 | Goal-Gradient Effect | N/A | Form satu langkah. Tombol "Lanjut" menyiratkan langkah berikutnya yang tidak ada. |
| L10 | Hick's Law | FAIL | F-03, F-16 |
| L11 | Jakob's Law | WARN | F-11, F-16. Enter men-submit dan Tab berpindah fokus sesuai konvensi. |
| L12 | Law of Common Region | WARN | F-17. Tidak ada wadah atau fieldset di seluruh halaman. |
| L13 | Law of Proximity | FAIL | F-06 |
| L14 | Law of Prägnanz | WARN | F-17 |
| L15 | Law of Similarity | FAIL | F-03, F-11 |
| L16 | Law of Uniform Connectedness | N/A | Tidak ada stepper, tab, popover atau tooltip. |
| L17 | Mental Model | FAIL | F-03 |
| L18 | Miller's Law | FAIL | F-06 |
| L19 | Occam's Razor | FAIL | F-10, F-09 |
| L20 | Paradox of the Active User | WARN | F-12 |
| L21 | Pareto Principle | WARN | F-14, F-16 |
| L22 | Parkinson's Law | WARN | F-12 |
| L23 | Peak-End Rule | FAIL | F-02 |
| L24 | Postel's Law | FAIL | F-05, F-12 |
| L25 | Selective Attention | FAIL | F-02, F-04 |
| L26 | Serial Position Effect | PASS | Navigasi diawali "Beranda" dan diakhiri "Akun", "Keranjang" (`measured`). |
| L27 | Tesler's Law | FAIL | F-10 |
| L28 | Von Restorff Effect | FAIL | F-03 |
| L29 | Working Memory | FAIL | F-06 |
| L30 | Zeigarnik Effect | WARN | F-20 |

UX: 1 PASS, 8 WARN, 19 FAIL, 2 N/A → (1 + 4) ÷ 28 × 100 = **18**.

### 6b. Laws of UI

| ID | Law | Status | Catatan / temuan |
|---|---|---|---|
| U01 | Visual Hierarchy | FAIL | F-03. Lihat juga F-21 (dua h1, gambar dekoratif terbesar). |
| U02 | Alignment and Grid | WARN | F-22. Probe melaporkan satu tepi kiri; pengukuran manual menemukan empat. |
| U03 | Spacing System | WARN | F-22 |
| U04 | Whitespace and Density | WARN | F-22 |
| U05 | Typography | WARN | F-19. Satu keluarga font (Arial). |
| U06 | Readability | WARN | F-14 |
| U07 | Color System | FAIL | F-03 (submit berwarna merah eror). Ada juga dua biru tautan: #1a56db dan #0000ee. |
| U08 | Contrast | WARN | F-13, F-23. Kontras placeholder NOT TESTED. |
| U09 | Color Independence | PASS | Tautan promo bergaris bawah; tombol dibedakan juga oleh label. Tidak ada state eror untuk dinilai (lihat F-02). Tampilan grayscale tidak diuji. |
| U10 | Consistency | FAIL | F-03 (5 gaya tombol; radius 0, 4 dan 20 px) |
| U11 | Affordance | WARN | F-11 |
| U12 | Touch Targets | FAIL | F-07 |
| U13 | Interactive States | FAIL | F-02, F-18 |
| U14 | Focus Visibility | FAIL | F-08 |
| U15 | Iconography | WARN | F-17 |
| U16 | Form Layout | FAIL | F-06 |
| U17 | Elevation and Layering | N/A | Tidak ada bayangan, overlay atau elemen sticky (`distinctShadows: 0`). |
| U18 | Imagery and Media | WARN | F-21 |
| U19 | Motion | N/A | 0 elemen dengan transisi atau animasi. |
| U20 | Responsive and Adaptive Layout | FAIL | F-05. Perbesaran teks 200% dan text-spacing WCAG 1.4.12 NOT TESTED. |

UI: 1 PASS, 9 WARN, 8 FAIL, 2 N/A → (1 + 4,5) ÷ 18 × 100 = **31**.

## 7. Alur

| Alur | Langkah | Hasil | Temuan |
|---|---|---|---|
| Daftar akun | 1 layar, 15 field + 1 checkbox tercentang, 38 perhentian Tab | Tidak selesai secara terlihat: submit menampilkan form kosong lagi tanpa konfirmasi | F-01, F-02, F-03, F-06, F-10 |
| Submit kosong atau data salah | Klik "OK" atau Enter | Diterima diam-diam, tanpa pesan eror | F-02 |
| Daftar hanya dengan keyboard | 19 Tab sampai field pertama, Enter untuk submit | Bisa dilakukan, tetapi fokus tidak terlihat | F-08 |
| Tinggalkan lalu kembali | Isi, reload | Isian hilang. Tombol back setelah submit memulihkan field non-sandi (perilaku bawaan browser). | F-20 |
| Menolak promo | Klik tautan tolak | Banner tetap tampil | F-04 |
| Hapus isian | Klik "Hapus semua" | Semua field kosong seketika, tanpa konfirmasi | F-09 |

## 8. Catatan fungsional

| No | Apa | Bukti | Keparahan |
|---|---|---|---|
| FN-1 | Form dikirim dengan GET ke halaman yang sama, sehingga nilai kata sandi muncul di URL | `measured`: setelah submit, parameter `password` dan `password2` terisi di query string. Nomor kartu akan ikut terkirim dengan cara yang sama (`inferred`, tidak diketik). | Critical |
| FN-2 | Tombol "Daftar Sekarang" dan "Lanjut" tidak punya handler | `measured`: klik tercatat, 0 perubahan DOM, tidak ada navigasi dalam 1 detik | High |
| FN-3 | Tidak ada validasi sama sekali, dan pendaftaran tidak diproses | `measured`: form kosong, email tidak valid dan sandi tidak cocok semuanya terkirim; tidak ada `action` | High |
| FN-4 | Checkbox asuransi tidak punya `name`, jadi pilihan pengguna tidak pernah terkirim | `measured`: 14 parameter di URL, tidak ada yang mewakili asuransi | High |
| FN-5 | 14 tautan navigasi, tautan promo dan 4 tombol ikon tidak punya tujuan atau aksi | `measured`: semua `href="#"`; tombol ikon berada di luar form tanpa handler | Medium |
| FN-6 | Opsi provinsi masih data contoh | `measured`: "Provinsi 1" sampai "Provinsi 38" | Medium |

## 9. Urutan perbaikan

1. **F-01**, bersama FN-4: hapus centang otomatis asuransi. Ini satu baris perubahan dan menyangkut uang pengguna.
2. **FN-1**: ubah form menjadi `method="post"` agar kata sandi tidak masuk URL.
3. **F-02** dan **F-03**, bersama FN-2 dan FN-3: satu tombol "Daftar" yang berfungsi, validasi per field, dan halaman konfirmasi.
4. **F-05**: hapus lebar tetap 1100 px dan pemblokiran zoom, agar halaman bisa dipakai di ponsel.
5. **F-10** lalu **F-06**: pangkas field menjadi yang perlu saja, lalu beri label pada yang tersisa.
6. **F-09** dan **F-04**: hapus tombol "Hapus semua" dan banner promo.
7. **F-07** dan **F-08**: ukuran target 44 px dan fokus yang terlihat.
8. **F-11**, **F-12**, **F-15**: tautan syarat yang nyata, tipe input dan autocomplete, dropdown provinsi.
9. Sisanya: **F-13**, **F-14**, **F-16** sampai **F-20**, lalu **F-21** sampai **F-23** sebagai perapian visual.

## 10. Tidak diuji

| Apa | Mengapa | Yang dibutuhkan untuk mengujinya |
|---|---|---|
| Kecepatan muat dan respons jaringan (L06) | Disajikan dari localhost; waktunya tidak mewakili produksi | Lingkungan staging dengan jaringan yang dibatasi |
| Perilaku di perangkat sentuh nyata (jenis keyboard, keyboard menutupi field, zoom otomatis pada input 13 px) | Hanya emulasi viewport | Ponsel Android dan iOS, atau emulator |
| Kontras teks placeholder | Probe tidak mengukurnya, dan nilai warna `::placeholder` dari browser tidak dapat diandalkan di panel ini | Pengambilan warna piksel atau DevTools |
| Perbesaran teks 200% dan text-spacing WCAG 1.4.12 | Alat tidak bisa mengubah zoom browser. Reflow diukur di lebar 375 dan 320 sebagai gantinya. | Browser desktop dengan zoom manual |
| Tampilan grayscale (U09) | Tidak ada alat filter; dinilai dari warna terukur dan label saja | Tangkapan layar dengan filter grayscale |
| Pembaca layar | Tidak tersedia | VoiceOver atau TalkBack |
| Perilaku field nomor kartu saat diisi | Sengaja tidak diketik | Nomor kartu uji resmi di lingkungan pembayaran sandbox |
| Tempel (paste) di field sandi | Tidak ada alat clipboard; diperkirakan diizinkan karena tidak ada handler | Uji manual |
| Layar lain (tujuan navigasi, halaman syarat, halaman sukses) | Tidak ada: semua tautan menuju `#` | Halaman-halaman itu dibuat lebih dulu |
