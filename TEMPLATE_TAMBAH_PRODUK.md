# Template Menambah Produk Baru

## Langkah 1: Upload ke Google Drive

1. Upload file PDF ke folder `Assets/` di Google Drive
2. Klik kanan file → **Get Link** → **Copy link**
3. Ekstrak `gdriveId` dari URL:
   ```
   https://drive.google.com/file/d/ABC123xyz/view
                                   ↑________↑
                                   Ini gdriveId
   ```

---

## Langkah 2: Copy Template Ini

```json
{
    "id": 99,
    "title": "NAMA PRODUK",
    "category": "PILIH_KATEGORI",
    "subcategory": null,
    "tags": ["tag1", "tag2", "tag3"],
    "description": "Deskripsi singkat produk...",
    "highlight": false,
    "files": [
        {
            "name": "Nama File Lengkap.pdf",
            "path": "Assets/XX. Folder/Nama File.pdf",
            "type": "PILIH_TIPE",
            "size": "1.5 MB",
            "gdriveId": "PASTE_GDRIVE_ID_DISINI"
        }
    ]
}
```

---

## Referensi Kategori

| ID Kategori | Label |
|-------------|-------|
| `company-profile` | Company Profile |
| `geogrid` | Geogrid |
| `geomembrane` | Geomembrane |
| `geotextile` | Geotextile |
| `retaining-wall` | Retaining Wall |
| `erosion-control` | Kontrol Erosi |
| `geocell` | Geocell |
| `asphalt` | Asphalt Reinforcement |
| `presentasi` | Presentasi |

---

## Referensi Tipe File

| ID Tipe | Label | Icon |
|---------|-------|------|
| `brosur` | Brosur | 📄 |
| `spesifikasi` | Spesifikasi | 📋 |
| `metode` | Metode Pemasangan | 🔧 |
| `hasil-uji` | Hasil Uji | 🧪 |
| `sertifikasi` | Sertifikasi | ✅ |
| `case-history` | Case History | 📚 |
| `presentasi` | Presentasi | 📊 |

---

## Langkah 3: Tambahkan ke data.json

1. Buka `data.json`
2. Cari array `"items": [`
3. Tambahkan template yang sudah diisi di akhir array (sebelum `]`)
4. Pastikan ada koma setelah item sebelumnya

---

## Langkah 4: Push ke GitHub

```bash
cd "/path/to/Multibangun-smart-database"
git add data.json
git commit -m "Add: Nama Produk Baru"
git push
```

Vercel akan otomatis deploy dalam ~30 detik!

---

## Contoh Lengkap

```json
{
    "id": 20,
    "title": "Tensar GeoDrain",
    "category": "geotextile",
    "subcategory": "Drainage",
    "tags": ["geodrain", "drainage", "drainase", "air", "filter"],
    "description": "Sistem drainase komposit untuk menggantikan aggregat konvensional.",
    "highlight": false,
    "files": [
        {
            "name": "Brosur GeoDrain.pdf",
            "path": "Assets/03. Geotextile/Brosur GeoDrain.pdf",
            "type": "brosur",
            "size": "2.1 MB",
            "gdriveId": "1ABC123xyz456"
        },
        {
            "name": "Spesifikasi GeoDrain.pdf",
            "path": "Assets/03. Geotextile/Spesifikasi GeoDrain.pdf",
            "type": "spesifikasi",
            "size": "0.5 MB",
            "gdriveId": "1DEF789abc123"
        }
    ]
}
```
