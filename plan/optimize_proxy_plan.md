# 1. Kurangi Decoding JWT Berulang
- Aksi: Ubah resolveSession mengembalikan { jwt, refreshed, exp }. Decode token sekali, gunakan exp untuk validasi dan set cookie.
- Manfaat: Hemat CPU, hapus decodeJwt ganda.

# 2. Cache Hasil Dekripsi Appwrite Session
- Aksi: Tambah Map dengan TTL 5 detik untuk hasil compactDecrypt. Simpan nilai appwriteCookie hasil dekripsi.
- Manfaat: Kurangi beban kriptografi pada request beruntun.

# 3. Optimasi Headers Proxy
- Aksi: Buat Headers baru dengan iterasi, hanya salin header yang aman (!== 'host' && !== 'accept-encoding'). Tambah Authorization jika ada JWT.
- Manfaat: Hindari kloning besar dan penghapusan.

# 4. Timeout Fetch Proxy
- Aksi: Gunakan AbortController dengan timeout 10 detik di handleProxyApi. Tangkap AbortError, kembalikan 504.
- Manfaat: Cegah middleware menggantung akibat backend lambat.

# 5. Simplify Return API Proxy
- Aksi: Jika tidak ada refresh cookie, langsung kembalikan Response dari fetch. Jika refresh, bungkus dengan NextResponse dan set cookie.
- Manfaat: Kurangi alokasi objek NextResponse saat tidak perlu.

# 6. Early Returns & Cleaner Structure
- Aksi: Gunakan if/return tanpa else. Pisahkan logika per jenis path (API, login, protected).
- Manfaat: Kode lebih linear, mudah di-maintain.

# 7. Validasi Environment Variables
- Aksi: Gunakan zod atau pengecekan manual di awal modul. Lempar error jika SESSION_SECRET, APPWRITE_PROJECT_ID, API_BASE_URL tidak ada.
- Manfaat: Hindari runtime error samar, deteksi konfigurasi dini.

# 8. Konfigurasi Matcher di next.config.js
- Aksi: Pindahkan matcher dari file middleware ke experimental.middlewareMatcher di next.config.js.
- Manfaat: Pisahkan konfigurasi routing dari logika.

# 9. Logging Terstruktur
- Aksi: Tambah console.warn/error di titik gagal refresh, dekripsi, timeout. Gunakan format sederhana.
- Manfaat: Debugging lebih mudah tanpa mengganggu performa.