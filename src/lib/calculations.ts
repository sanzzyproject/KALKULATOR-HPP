import type { BahanBaku, BiayaPengolahan, ProdukTurunan, HasilPerhitungan, HPPPerProduk } from "@/types";

export function hitungHPP(
  bahanBaku: BahanBaku[],
  biayaPengolahan: BiayaPengolahan[],
  produkTurunan: ProdukTurunan[],
  batchPerMonth: number
): HasilPerhitungan {
  // Total bahan baku
  const totalBahanBaku = bahanBaku.reduce((sum, b) => sum + b.hargaTotal, 0);

  // Total biaya pengolahan per batch
  const totalBiayaPengolahan = biayaPengolahan.reduce((sum, b) => {
    if (b.periode === "per_bulan") {
      return sum + (batchPerMonth > 0 ? b.harga / batchPerMonth : 0);
    }
    return sum + b.harga;
  }, 0);

  const totalBiayaProduksi = totalBahanBaku + totalBiayaPengolahan;

  // Total nilai jual semua produk
  const totalNilaiJual = produkTurunan.reduce((sum, p) => sum + p.qty * p.hargaJual, 0);

  // Total potensi penjualan
  const totalPotensiPenjualan = totalNilaiJual;

  // Alokasi biaya ke setiap produk berdasarkan proporsi nilai jual
  const hppPerProduk: HPPPerProduk[] = produkTurunan.map((p) => {
    const nilaiJualProduk = p.qty * p.hargaJual;
    const proporsi = totalNilaiJual > 0 ? nilaiJualProduk / totalNilaiJual : 0;
    const alokasiBiaya = totalBiayaProduksi * proporsi;
    const hppPerUnit = p.qty > 0 ? alokasiBiaya / p.qty : 0;

    return {
      nama: p.nama,
      qty: p.qty,
      alokasiBiaya,
      hppPerUnit,
    };
  });

  const proyeksiLaba = totalPotensiPenjualan - totalBiayaProduksi;

  return {
    totalBiayaProduksi,
    totalPotensiPenjualan,
    proyeksiLaba,
    hppPerProduk,
  };
}

export function hitungBundling(
  selectedProducts: { nama: string; hppPerUnit: number; hargaJual: number; qty: number }[]
) {
  const totalHPP = selectedProducts.reduce((sum, p) => sum + p.hppPerUnit, 0);
  const hargaNormal = selectedProducts.reduce((sum, p) => sum + p.hargaJual, 0);

  return {
    totalHPP,
    hargaNormal,
    hargaHemat: Math.round(hargaNormal * 0.8),
    hargaSeimbang: Math.round(hargaNormal * 0.87),
    hargaMaksimal: Math.round(hargaNormal * 0.935),
  };
}
