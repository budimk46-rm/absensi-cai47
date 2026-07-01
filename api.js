// ============================================================
// api.js — Layer komunikasi ke Apps Script API
//
// PENTING soal CORS: Apps Script Web App tidak bisa merespons
// permintaan "preflight" (OPTIONS) yang otomatis dikirim browser
// kalau fetch() memakai Content-Type: application/json. Supaya
// preflight itu tidak pernah terjadi, kita kirim body sebagai
// text/plain (isinya tetap teks JSON, hanya label content-type-nya
// yang berbeda) -- ini dianggap "permintaan sederhana" oleh browser
// sehingga tidak memicu preflight, dan diterima Apps Script lewat
// e.postData.contents seperti biasa.
//
// Ganti APPS_SCRIPT_URL di bawah ini dengan URL Web App Anda
// (yang diakhiri /exec), didapat dari Apps Script: Deploy > Manage
// deployments.
// ============================================================

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbypJlVyCGhaWyMe584iDOh2nrsSb2iwL8eUGvcBix0hTet_PoTcSznrjqd7EKsOCCiQ/exec";";

/**
 * Memanggil 1 fungsi backend lewat Apps Script API.
 * @param {string} action - nama fungsi backend, misal "getDaftarSesi"
 * @param {Array} params - daftar argumen untuk fungsi itu, sesuai urutan
 * @returns {Promise<any>} - isi `data` dari respons jika berhasil
 * @throws {Error} - jika server mengembalikan ok:false atau request gagal
 */
async function callApi(action, params = []) {
  let response;
  try {
    response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, params }),
    });
  } catch (networkErr) {
    throw new Error("Tidak bisa terhubung ke server. Periksa koneksi internet, lalu coba lagi.");
  }

  if (!response.ok) {
    throw new Error("Server merespons dengan error (HTTP " + response.status + ").");
  }

  let json;
  try {
    json = await response.json();
  } catch (parseErr) {
    throw new Error("Respons server tidak bisa dibaca. Coba lagi.");
  }

  if (!json.ok) {
    throw new Error(json.message || "Terjadi kesalahan di server.");
  }

  return json.data;
}
