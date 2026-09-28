import React, { useState } from 'react';
import {
  Scale,
  Bluetooth,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { Language, WeighedItem } from '../../types';
import { SCRAP_RATES } from '../../data/mockData';

interface DigitalWeighingProps {
  lang: Language;
  onGenerateReceipt?: (items: WeighedItem[]) => void;
}

export const DigitalWeighing: React.FC<DigitalWeighingProps> = ({
  lang,
  onGenerateReceipt,
}) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    SCRAP_RATES[0].id
  );
  const [currentWeight, setCurrentWeight] = useState<number>(14.85);
  const [isStable, setIsStable] = useState<boolean>(true);
  const [weighedItems, setWeighedItems] = useState<WeighedItem[]>([
    {
      id: 'w-1',
      materialName: 'Old Newspaper (Raddi)',
      weightKg: 15.2,
      ratePerKg: 14,
      subtotal: 212.8,
    },
  ]);

  const activeMaterial =
    SCRAP_RATES.find((m) => m.id === selectedMaterialId) || SCRAP_RATES[0];

  const content = {
    mr: {
      title: 'स्मार्ट ब्लूटूथ डिजिटल वजन काटा',
      scaleStatus: 'कनेक्टेड: Tara-Scale Pro BT-402',
      liveReadout: 'काट्यावरील थेट वजन',
      tare: 'Tare (शून्य करा)',
      stabilize: 'स्थिर',
      selectMaterial: 'साहित्य निवडा',
      rate: 'दर',
      addItem: 'वजन लॉक करून यादीत जोडा',
      tally: 'मोजलेली साहित्याची यादी',
      totalWeight: 'एकूण वजन',
      totalAmount: 'एकूण रक्कम',
      genReceipt: 'डिजिटल पावती तयार करा',
      noItems: 'अद्याप कोणतेही साहित्य जोडले नाही',
    },
    hi: {
      title: 'स्मार्ट ब्लूटूथ डिजिटल कांटा',
      scaleStatus: 'कनेक्टेड: Tara-Scale Pro BT-402',
      liveReadout: 'कांटे पर लाइव वजन',
      tare: 'Tare (जीरो करें)',
      stabilize: 'स्थिर',
      selectMaterial: 'सामग्री चुनें',
      rate: 'दर',
      addItem: 'वजन लॉक करके जोड़ें',
      tally: 'तौली गई वस्तुओं की सूची',
      totalWeight: 'कुल वजन',
      totalAmount: 'कुल राशि',
      genReceipt: 'डिजिटल रसीद बनाएं',
      noItems: 'अभी कोई वस्तु नहीं जोड़ी गई',
    },
    en: {
      title: 'Smart IoT Bluetooth Digital Scale',
      scaleStatus: 'Connected: Tara-Scale Pro BT-402',
      liveReadout: 'Live Scale Loadcell Readout',
      tare: 'Tare (Zero)',
      stabilize: 'STABLE',
      selectMaterial: 'Select Material',
      rate: 'Rate',
      addItem: 'Lock Weight & Add to Bill',
      tally: 'Weighed Items Summary',
      totalWeight: 'Gross Weight',
      totalAmount: 'Total Payable',
      genReceipt: 'Generate Digital Receipt',
      noItems: 'No items weighed yet',
    },
  }[lang];

  const handleTare = () => {
    setCurrentWeight(0.0);
  };

  const handleSimulateLoad = () => {
    setIsStable(false);
    setTimeout(() => {
      // Simulate new random weight on scale loadcell
      const weights = [8.4, 12.6, 21.3, 5.7, 18.9, 34.2];
      const random = weights[Math.floor(Math.random() * weights.length)];
      setCurrentWeight(random);
      setIsStable(true);
    }, 400);
  };

  const handleAddWeighed = () => {
    if (currentWeight <= 0) return;
    const materialNameDisplay =
      lang === 'mr'
        ? activeMaterial.nameMr
        : lang === 'hi'
        ? activeMaterial.nameHi
        : activeMaterial.name;

    const newItem: WeighedItem = {
      id: `w-${Date.now()}`,
      materialName: materialNameDisplay,
      weightKg: currentWeight,
      ratePerKg: activeMaterial.ratePerKg,
      subtotal: Math.round(currentWeight * activeMaterial.ratePerKg * 10) / 10,
    };
    setWeighedItems((prev) => [...prev, newItem]);
    setCurrentWeight(0);
  };

  const handleDeleteItem = (id: string) => {
    setWeighedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const grossWeight = weighedItems.reduce((acc, i) => acc + i.weightKg, 0);
  const grossAmount = weighedItems.reduce((acc, i) => acc + (i.subtotal ?? i.weightKg * i.ratePerKg), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      {/* Title & Connection Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Scale className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 text-base">{content.title}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Bluetooth className="w-3.5 h-3.5 text-blue-500" />
            {content.scaleStatus}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {content.stabilize}
        </span>
      </div>

      {/* Digital Scale LED Display */}
      <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl border border-slate-800 mb-3 shadow-inner relative overflow-hidden">
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono mb-1">
          <span>{content.liveReadout}</span>
          <span className="text-emerald-500 font-semibold">TARA-BT · 100KG MAX</span>
        </div>

        <div className="flex items-baseline justify-center gap-2 py-2">
          <span className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight tabular-nums">
            {currentWeight.toFixed(2)}
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-500">
            kg
          </span>
        </div>

        {/* Tare & Simulate Scale Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={handleTare}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-mono flex items-center gap-1 transition-colors"
          >
            {content.tare}
          </button>
          <button
            onClick={handleSimulateLoad}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg font-mono flex items-center gap-1 transition-colors text-xs"
          >
            <RefreshCw className="w-3 h-3" />
            Simulate Load
          </button>
        </div>
      </div>

      {/* Material Selector & Item Add */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-700">
            {content.selectMaterial}
          </label>
          <select
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="text-xs p-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {SCRAP_RATES.map((rate) => (
              <option key={rate.id} value={rate.id}>
                {rate.icon}{' '}
                {lang === 'mr'
                  ? rate.nameMr
                  : lang === 'hi'
                  ? rate.nameHi
                  : rate.name}{' '}
                (₹{rate.ratePerKg}/kg)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-500">
            {content.rate}: ₹{activeMaterial.ratePerKg}/kg · Current Subtotal:
          </span>
          <span className="font-mono font-bold text-slate-900 text-sm">
            ₹{(currentWeight * activeMaterial.ratePerKg).toFixed(1)}
          </span>
        </div>

        <button
          onClick={handleAddWeighed}
          disabled={currentWeight <= 0}
          className="w-full min-h-[40px] px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{content.addItem}</span>
        </button>
      </div>

      {/* Weighed Items Tally */}
      <div className="mb-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {content.tally} ({weighedItems.length})
        </h4>
        {weighedItems.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-2">
            {content.noItems}
          </p>
        ) : (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {weighedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-800 block">
                    {item.materialName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {item.weightKg} kg × ₹{item.ratePerKg}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">
                    ₹{(item.subtotal ?? item.weightKg * item.ratePerKg).toFixed(1)}
                  </span>
                  <button
                    onClick={() => handleDeleteItem(item.id || '')}
                    className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Summary & Trigger Receipt */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between mb-3">
        <div>
          <span className="text-[11px] text-emerald-800 block">
            {content.totalWeight}
          </span>
          <span className="font-mono font-bold text-emerald-950 text-base">
            {grossWeight.toFixed(2)} kg
          </span>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-emerald-800 block">
            {content.totalAmount}
          </span>
          <span className="font-mono font-bold text-emerald-950 text-xl">
            ₹{grossAmount.toFixed(0)}
          </span>
        </div>
      </div>

      <button
        onClick={() => onGenerateReceipt && onGenerateReceipt(weighedItems)}
        disabled={weighedItems.length === 0}
        className="w-full min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <Receipt className="w-4 h-4" />
        <span>{content.genReceipt}</span>
      </button>
    </div>
  );
};
