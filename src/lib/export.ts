import * as XLSX from "xlsx";
import type { CalculationRecord } from "@/types";

export function exportToExcel(record: CalculationRecord) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Info Bisnis
  const infoData = [
    ["Nama Bisnis", record.businessName],
    ["Mode Bisnis", record.businessMode],
    ["Batch per Bulan", record.batchPerMonth],
    ["Tanggal", new Date(record.createdAt).toLocaleDateString("id-ID")],
  ];
  const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
  XLSX.utils.book_append_sheet(wb, wsInfo, "Info Bisnis");

  // Sheet 2: Bahan Baku
  const bahanData = [["Nama", "Harga Total", "Jumlah", "Satuan"]];
  record.bahanBaku.forEach((b) => bahanData.push([b.nama, String(b.hargaTotal), String(b.jumlah), b.satuan]));
  const wsBahan = XLSX.utils.aoa_to_sheet(bahanData);
  XLSX.utils.book_append_sheet(wb, wsBahan, "Bahan Baku");

  // Sheet 3: Biaya Pengolahan
  const biayaData = [["Nama", "Harga", "Periode"]];
  record.biayaPengolahan.forEach((b) =>
    biayaData.push([b.nama, String(b.harga), b.periode === "per_batch" ? "Per Batch" : "Per Bulan"])
  );
  const wsBiaya = XLSX.utils.aoa_to_sheet(biayaData);
  XLSX.utils.book_append_sheet(wb, wsBiaya, "Biaya Pengolahan");

  // Sheet 4: Produk Turunan
  const produkData = [["Nama", "Qty", "Satuan", "Harga Jual"]];
  record.produkTurunan.forEach((p) =>
    produkData.push([p.nama, String(p.qty), p.satuan, String(p.hargaJual)])
  );
  const wsProduk = XLSX.utils.aoa_to_sheet(produkData);
  XLSX.utils.book_append_sheet(wb, wsProduk, "Produk Turunan");

  // Sheet 5: Hasil HPP
  const hasilData = [
    ["Total Biaya Produksi", record.hasilPerhitungan.totalBiayaProduksi],
    ["Total Potensi Penjualan", record.hasilPerhitungan.totalPotensiPenjualan],
    ["Proyeksi Laba", record.hasilPerhitungan.proyeksiLaba],
    [],
    ["Nama Produk", "Qty", "Alokasi Biaya", "HPP per Unit"],
  ];
  record.hasilPerhitungan.hppPerProduk.forEach((h) =>
    hasilData.push([h.nama, h.qty as any, h.alokasiBiaya as any, h.hppPerUnit as any])
  );
  const wsHasil = XLSX.utils.aoa_to_sheet(hasilData);
  XLSX.utils.book_append_sheet(wb, wsHasil, "Hasil HPP");

  XLSX.writeFile(wb, `HPP_${record.businessName || "Export"}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
