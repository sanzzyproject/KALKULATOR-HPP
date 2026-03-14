export interface BahanBaku {
  nama: string;
  hargaTotal: number;
  jumlah: number;
  satuan: string;
}

export interface BiayaPengolahan {
  nama: string;
  harga: number;
  periode: "per_batch" | "per_bulan";
}

export interface ProdukTurunan {
  nama: string;
  qty: number;
  satuan: string;
  hargaJual: number;
}

export interface HPPPerProduk {
  nama: string;
  qty: number;
  alokasiBiaya: number;
  hppPerUnit: number;
}

export interface HasilPerhitungan {
  totalBiayaProduksi: number;
  totalPotensiPenjualan: number;
  proyeksiLaba: number;
  hppPerProduk: HPPPerProduk[];
}

export interface BundlingItem {
  produkIds: number[];
  totalHPP: number;
  hargaNormal: number;
  hargaHemat: number;
  hargaSeimbang: number;
  hargaMaksimal: number;
}

export interface CalculationRecord {
  id?: number;
  businessName: string;
  businessMode: string;
  batchPerMonth: number;
  bahanBaku: BahanBaku[];
  biayaPengolahan: BiayaPengolahan[];
  produkTurunan: ProdukTurunan[];
  hasilPerhitungan: HasilPerhitungan;
  bundling: BundlingItem[];
  createdAt: number;
}

export type BusinessMode =
  | "iklan_cod"
  | "marketplace"
  | "ritel_fnb"
  | "manufaktur"
  | "produksi_turunan"
  | "produk_jasa";

export const BUSINESS_MODES: { id: BusinessMode; label: string; icon: string }[] = [
  { id: "iklan_cod", label: "Iklan & COD", icon: "Megaphone" },
  { id: "marketplace", label: "Marketplace", icon: "ShoppingBag" },
  { id: "ritel_fnb", label: "Bisnis Ritel / F&B", icon: "Store" },
  { id: "manufaktur", label: "Manufaktur / Pabrik", icon: "Factory" },
  { id: "produksi_turunan", label: "Produksi Turunan", icon: "Layers" },
  { id: "produk_jasa", label: "Produk Jasa", icon: "Briefcase" },
];
