import { useState } from "react";
import { Calculator, Save, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import BusinessModeSelector from "@/components/BusinessModeSelector";
import InputBahanBaku from "@/components/InputBahanBaku";
import InputBiaya from "@/components/InputBiaya";
import InputProduk from "@/components/InputProduk";
import HPPResult from "@/components/HPPResult";
import ProfitProjection from "@/components/ProfitProjection";
import ChartProfit from "@/components/ChartProfit";
import BundlingCalculator from "@/components/BundlingCalculator";
import HistoryPanel from "@/components/HistoryPanel";
import { hitungHPP } from "@/lib/calculations";
import { saveCalculation } from "@/lib/db";
import { exportToExcel } from "@/lib/export";
import type {
  BusinessMode,
  BahanBaku,
  BiayaPengolahan,
  ProdukTurunan,
  HasilPerhitungan,
  CalculationRecord,
} from "@/types";

const Index = () => {
  const [businessMode, setBusinessMode] = useState<BusinessMode | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [batchPerMonth, setBatchPerMonth] = useState(1);
  const [bahanBaku, setBahanBaku] = useState<BahanBaku[]>([]);
  const [biayaPengolahan, setBiayaPengolahan] = useState<BiayaPengolahan[]>([]);
  const [produkTurunan, setProdukTurunan] = useState<ProdukTurunan[]>([]);
  const [hasil, setHasil] = useState<HasilPerhitungan | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleHitung = () => {
    if (!businessMode) {
      toast({ title: "Pilih mode bisnis terlebih dahulu", variant: "destructive" });
      return;
    }
    if (bahanBaku.length === 0) {
      toast({ title: "Tambahkan minimal 1 bahan baku", variant: "destructive" });
      return;
    }
    if (produkTurunan.length === 0) {
      toast({ title: "Tambahkan minimal 1 produk turunan", variant: "destructive" });
      return;
    }
    const result = hitungHPP(bahanBaku, biayaPengolahan, produkTurunan, batchPerMonth);
    setHasil(result);
    toast({ title: "Perhitungan HPP berhasil!" });
  };

  const handleSave = async () => {
    if (!hasil) return;
    await saveCalculation({
      businessName,
      businessMode: businessMode || "",
      batchPerMonth,
      bahanBaku,
      biayaPengolahan,
      produkTurunan,
      hasilPerhitungan: hasil,
      bundling: [],
      createdAt: Date.now(),
    });
    setRefreshKey((k) => k + 1);
    toast({ title: "Perhitungan berhasil disimpan!" });
  };

  const handleExport = () => {
    if (!hasil) return;
    exportToExcel({
      businessName,
      businessMode: businessMode || "",
      batchPerMonth,
      bahanBaku,
      biayaPengolahan,
      produkTurunan,
      hasilPerhitungan: hasil,
      bundling: [],
      createdAt: Date.now(),
    });
    toast({ title: "File Excel berhasil diunduh!" });
  };

  const handleLoadRecord = (record: CalculationRecord) => {
    setBusinessName(record.businessName);
    setBusinessMode((record.businessMode as BusinessMode) || null);
    setBatchPerMonth(record.batchPerMonth);
    setBahanBaku(record.bahanBaku);
    setBiayaPengolahan(record.biayaPengolahan);
    setProdukTurunan(record.produkTurunan);
    setHasil(record.hasilPerhitungan);
    toast({ title: "Riwayat perhitungan dimuat!" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <h1 className="text-base font-bold text-foreground">Kalkulator HPP</h1>
          </div>
          <HistoryPanel onLoad={handleLoadRecord} refreshKey={refreshKey} />
        </div>
      </header>

      <main className="container py-4 space-y-6 pb-24">
        <BusinessModeSelector selected={businessMode} onSelect={setBusinessMode} />

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Data Produksi</h2>
          <div className="space-y-2">
            <Label className="text-sm">Nama Bisnis / Produk Utama</Label>
            <Input
              placeholder="Contoh: Usaha Kelapa Terpadu"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Jumlah Batch Produksi per Bulan</Label>
            <Input
              type="number"
              placeholder="Contoh: 30"
              value={batchPerMonth || ""}
              onChange={(e) => setBatchPerMonth(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>

        <InputBahanBaku items={bahanBaku} onChange={setBahanBaku} />
        <InputBiaya items={biayaPengolahan} onChange={setBiayaPengolahan} />
        <InputProduk items={produkTurunan} onChange={setProdukTurunan} />

        <Button onClick={handleHitung} className="w-full h-12 text-base font-bold gap-2" size="lg">
          <Calculator className="h-5 w-5" />
          Hitung HPP
        </Button>

        {hasil && (
          <>
            <HPPResult
              hasil={hasil}
              bahanBaku={bahanBaku}
              biayaPengolahan={biayaPengolahan}
              batchPerMonth={batchPerMonth}
            />
            <ProfitProjection hasil={hasil} batchPerMonth={batchPerMonth} />
            <ChartProfit hasil={hasil} batchPerMonth={batchPerMonth} />
            {produkTurunan.length >= 2 && (
              <BundlingCalculator
                produkTurunan={produkTurunan}
                hppPerProduk={hasil.hppPerProduk}
              />
            )}
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleSave} variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                Simpan
              </Button>
              <Button onClick={handleExport} variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
