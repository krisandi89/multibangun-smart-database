/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT (GAS) - SYSTEM LOGIN MULTIBANGUN SMART DATABASE
 * ==============================================================================
 * Petunjuk Penggunaan:
 * 1. Buka Google Sheets baru di Google Drive (atau gunakan Spreadsheet yang sudah ada).
 * 2. Klik menu Ekstensi -> Apps Script.
 * 3. Hapus semua kode default dan Paste (tempel) seluruh isi file ini ke Code.gs.
 * 4. Klik tombol "Deploy" (Terapkan) -> "Deployment Baru" (New Deployment).
 * 5. Pilih Jenis: "Web app" (Aplikasi Web).
 * 6. Pengaturan Deployment:
 *    - Deskripsi: Login System Multibangun
 *    - Jalankan sebagai (Execute as): "Saya" (Me / email anda)
 *    - Yang memiliki akses (Who has access): "Siapa saja" (Anyone)
 * 7. Klik "Deploy", berikan izin akses (Authorize access), lalu COPY URL Web App yang dihasilkan.
 * 8. Tempelkan URL Web App tersebut ke menu Pengaturan GAS Login di Web App Multibangun!
 * ==============================================================================
 */

// Nama Sheet untuk menyimpan database pengguna
const SHEET_USERS = "Users";

/**
 * Endpoint HTTP POST (Handling Login Request)
 */
function doPost(e) {
  try {
    var params = {};
    if (e && e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch(err) {
        params = e.parameter || {};
      }
    } else if (e && e.parameter) {
      params = e.parameter || {};
    }

    var action = params.action || "login";
    var username = (params.username || "").toString().trim();
    var password = (params.password || "").toString().trim();

    if (action === "login") {
      var result = checkLogin(username, password);
      return createJsonResponse(result);
    }

    return createJsonResponse({ success: false, message: "Aksi tidak dikenal." });

  } catch (error) {
    return createJsonResponse({ success: false, message: "Error Server: " + error.toString() });
  }
}

/**
 * Endpoint HTTP GET (Support CORS & Query Parameters)
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action || "login";
    var username = (params.username || "").toString().trim();
    var password = (params.password || "").toString().trim();

    if (action === "login") {
      var result = checkLogin(username, password);
      return createJsonResponse(result);
    } else if (action === "ping") {
      return createJsonResponse({ success: true, message: "GAS Web App Login System Aktif!" });
    }

    return createJsonResponse({ success: false, message: "Gunakan metode POST atau masukan parameter action=login" });
  } catch (error) {
    return createJsonResponse({ success: false, message: "Error Server: " + error.toString() });
  }
}

/**
 * Fungsi untuk memeriksa kredensial login di Google Sheet
 */
function checkLogin(username, password) {
  if (!username || !password) {
    return { success: false, message: "Username dan password tidak boleh kosong!" };
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_USERS);

  // Jika Sheet Users belum ada, buatkan otomatis beserta data awal (Default Admin & User)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_USERS);
    sheet.appendRow(["Username", "Password", "Nama", "Role", "Status"]);

    // Tambah akun default awal
    sheet.appendRow(["admin", "multibangun123", "Administrator Utama", "Admin", "Aktif"]);
    sheet.appendRow(["user", "multibangun", "Staf Patria", "User", "Aktif"]);

    // Format header
    sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#dc2626").setFontColor("#ffffff");
  }

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return { success: false, message: "Database pengguna masih kosong!" };
  }

  // Iterasi baris sheet untuk mencari matching user
  for (var i = 1; i < data.length; i++) {
    var uName = data[i][0].toString().trim();
    var uPass = data[i][1].toString().trim();
    var uRealName = data[i][2].toString().trim() || uName;
    var uRole = data[i][3].toString().trim() || "User";
    var uStatus = data[i][4].toString().trim() || "Aktif";

    // Cek username (case-insensitive) dan password (exact match)
    if (uName.toLowerCase() === username.toLowerCase()) {
      if (uStatus.toLowerCase() !== "aktif") {
        return { success: false, message: "Akun Anda sedang dinonaktifkan!" };
      }

      if (uPass === password) {
        return {
          success: true,
          message: "Login Berhasil!",
          user: {
            username: uName,
            name: uRealName,
            role: uRole,
            loginTime: new Date().toISOString()
          },
          token: "gas_token_" + new Date().getTime()
        };
      } else {
        return { success: false, message: "Password yang Anda masukkan salah!" };
      }
    }
  }

  return { success: false, message: "Username tidak ditemukan!" };
}

/**
 * Utility untuk membuat Output JSON dengan MimeType JSON
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
