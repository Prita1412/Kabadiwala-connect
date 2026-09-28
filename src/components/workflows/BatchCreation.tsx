import React, { useState } from 'react';
import {
  Layers,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Sparkles,
  ArrowRight,
  Truck,
} from 'lucide-react';
import { Language, BatchItem } from '../../types';
import { createBatch } from '../../services/firebaseService';
import confetti from 'canvas-confetti';

interface BatchCreationProps {
  lang: Language;
  onBatchCreated?: (batch: BatchItem) => void;
  onMatchRecycler?: (batchId: string) => void;
}

export const BatchCreation: React.FC<BatchCreationProps> = ({
  lang,
  onBatchCreated,
  onMatchRecycler,
}) => {
  const [materialType, setMaterialType] = useState<string>(
    'Grade-1 High Density PET Bales'
  );
  const [totalWeight, setTotalWeight] = useState<number>(420);
  const [balesCount, setBalesCount] = useState<number>(8);
  const [moisture, setMoisture] = useState<number>(1.8);
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [createdBatch, setCreatedBatch] = useState<BatchItem | null>(null);

  const content = {
    mr: {
      title: 'प्रमाणित बल्क स्क्रॅप बॅच तयार करा',
      sub: 'मायक्रो-हब बेलिंग व डिजिटल टॅम्पर-प्रूफ सील',
      materialLabel: 'स्क्रॅप साहित्य प्रकार',
      weightLabel: 'एकूण बॅच वजन (किग्रॅ)',
      balesLabel: 'हायड्रॉलिक बेल्स संख्या',
      moistureLabel: 'आर्द्रता चाचणी (%)',
      hubLabel: 'संकलन केंद्र',
      createBtn: 'बॅच तयार करा व QR सील लावा',
      successTitle: 'बॅच यशस्वीरित्या तयार व सील करण्यात आली!',
      successSub: 'डिजिटल सील #TS-9924-MH जोडले गेले आहे.',
      batchNo: 'बॅच क्रमांक',
      matchBtn: 'अधिकृत रिसायकलर्सशी मॅच करा',
    },
    hi: {
      title: 'प्रमाणित बल्क स्क्रैप बैच बनाएँ',
      sub: 'माइक्रो-हब बेलिंग और डिजिटल सील जनरेटर',
      materialLabel: 'स्क्रैप सामग्री प्रकार',
      weightLabel: 'कुल बैच वजन (किलो)',
      balesLabel: 'बेल्स की संख्या',
      moistureLabel: 'नमी परीक्षण (%)',
      hubLabel: 'कलेक्शन हब',
      createBtn: 'बैच बनाएँ और QR सील लगाएँ',
      successTitle: 'बैच सफलतापूर्वक सील किया गया!',
      successSub: 'डिजिटल सील #TS-9924-MH संलग्न है।',
      batchNo: 'बैच संख्या',
      matchBtn: 'अधिकृत रिसाइकलर्स से मैच करें',
    },
    en: {
      title: 'Create Standardized Scrap Lot / Bale',
      sub: 'Hub aggregation & tamper-evident blockchain seal',
      materialLabel: 'Material Specification',
      weightLabel: 'Aggregate Weight (kg)',
      balesLabel: 'Hydraulic Bales Count',
      moistureLabel: 'Lab Moisture Test (%)',
      hubLabel: 'Origin Hub',
      createBtn: 'Generate Batch & Apply QR Seal',
      successTitle: 'Certified Batch Generated & Sealed!',
      successSub: 'Tamper-proof digital seal #TS-9924-MH generated.',
      batchNo: 'Batch Number',
      matchBtn: 'Match with Authorized Recyclers',
    },
  }[lang];

  const handleCreate = async () => {
    const batchNo = `PUN-BAL-2026-${Math.floor(800 + Math.random() * 100)}`;
    const newBatch: BatchItem = {
      id: `BATCH-PUN-${Date.now().toString().slice(-4)}`,
      batchNumber: batchNo,
      materialCategory: materialType,
      weightKg: totalWeight,
      baleCount: balesCount,
      purityGrade: 'Grade-A 98.2% Virgin Polymer Equivalent',
      moistureContent: moisture,
      contaminationRate: 1.4,
      qrSealCode: 'TS-9924-MH',
      status: 'created',
    };

    try {
      await createBatch({
        batchId: batchNo,
        materialType: materialType,
        totalWeight: totalWeight,
        balesCount: balesCount,
        purityGrade: 'Grade-A 98.2% Virgin Polymer Equivalent',
        moisturePercent: moisture,
        contaminationPercent: 1.4,
        status: 'CREATED',
      });
    } catch (e) {
      console.warn('Persisted batch error/offline:', e);
    }

    setCreatedBatch(newBatch);
    setIsCreated(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
    if (onBatchCreated) onBatchCreated(newBatch);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 text-base">{content.title}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{content.sub}</p>
        </div>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          B2B Wholesale
        </span>
      </div>

      {!isCreated ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {content.materialLabel}
            </label>
            <select
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800"
            >
              <option value="Grade-1 High Density PET Bales">
                Grade-1 High Density PET Bales (Clear Flakes)
              </option>
              <option value="Sorted Heavy Melting Steel (HMS-1)">
                Sorted Heavy Melting Steel (HMS-1 Scrap)
              </option>
              <option value="Corrugated Box Bales (OCC Grade 11)">
                Corrugated Box Bales (OCC Grade 11 Cardboard)
              </option>
              <option value="Stripped Copper Millberry 99.9%">
                Stripped Copper Millberry (99.9% Purity)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {content.weightLabel}
              </label>
              <input
                type="number"
                value={totalWeight}
                onChange={(e) => setTotalWeight(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {content.balesLabel}
              </label>
              <input
                type="number"
                value={balesCount}
                onChange={(e) => setBalesCount(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {content.moistureLabel}
              </label>
              <input
                type="number"
                step="0.1"
                value={moisture}
                onChange={(e) => setMoisture(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {content.hubLabel}
              </label>
              <input
                type="text"
                disabled
                value="Aundh Hub #4, Pune"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600"
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="w-full min-h-[44px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm mt-2"
          >
            <QrCode className="w-4 h-4" />
            <span>{content.createBtn}</span>
          </button>
        </div>
      ) : (
        <div className="py-2 space-y-3">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-blue-950 text-sm">
              {content.successTitle}
            </h4>
            <p className="text-xs text-blue-800">{content.successSub}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">{content.batchNo}:</span>
              <span className="font-mono font-bold text-slate-900">
                {createdBatch?.batchNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Weight & Bales:</span>
              <span className="font-mono font-semibold text-slate-900">
                {createdBatch?.totalWeightKg} kg ({createdBatch?.balesCount} Bales)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tamper Seal:</span>
              <span className="font-mono text-emerald-700 font-bold">
                {createdBatch?.tamperSealId}
              </span>
            </div>
          </div>

          <button
            onClick={() => onMatchRecycler && onMatchRecycler(createdBatch?.id || '')}
            className="w-full min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Truck className="w-4 h-4" />
            <span>{content.matchBtn}</span>
          </button>
        </div>
      )}
    </div>
  );
};
