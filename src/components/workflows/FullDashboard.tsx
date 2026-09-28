import React from 'react';
import {
  TrendingUp,
  Scale,
  TreeDeciduous,
  Leaf,
  Layers,
  ArrowUpRight,
  Wallet,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Language } from '../../types';

interface FullDashboardProps {
  lang: Language;
  onOpenScale?: () => void;
  onOpenBatch?: () => void;
  onViewPickups?: () => void;
}

export const FullDashboard: React.FC<FullDashboardProps> = ({
  lang,
  onOpenScale,
  onOpenBatch,
  onViewPickups,
}) => {
  const content = {
    mr: {
      title: 'दैनिक कबाडी ऑपरेशन्स डॅशबोर्ड',
      sub: 'औंध वार्ड #4 · तारीख: 27 सप्टेंबर 2026',
      todayEarnings: 'आजची एकूण कमाई',
      netMargin: 'अंदाजे निव्वळ नफा',
      scrapCollected: 'गोळा केलेले एकूण कबाड',
      tripsCompleted: 'पूर्ण झालेले पिकअप्स',
      categoryBreakdown: 'साहित्यानुसार वजन विश्लेषण',
      ecoTitle: 'पर्यावरण व कार्बन बचत अहवाल',
      trees: 'झाडांचे संवर्धन',
      co2: 'CO₂ उत्सर्जन प्रतिबंध',
      landfill: 'लँडफिल कचरा घट',
      btnScale: 'डिजिटल काटा',
      btnBatch: 'नवीन बॅच तयार करा',
      btnPickups: 'पिकअप यादी',
    },
    hi: {
      title: 'दैनिक कबाड़ी ऑपरेशन्स डैशबोर्ड',
      sub: 'औंध वार्ड #4 · दिनांक: 27 सितम्बर 2026',
      todayEarnings: 'आज की कुल कमाई',
      netMargin: 'शुद्ध मुनाफा',
      scrapCollected: 'एकत्रित किया गया कबाड़',
      tripsCompleted: 'पूर्ण पिकअप्स',
      categoryBreakdown: 'सामग्री अनुसार वजन विश्लेषण',
      ecoTitle: 'पर्यावरण व कार्बन बचत रिपोर्ट',
      trees: 'पेड़ों का संरक्षण',
      co2: 'CO₂ उत्सर्जन रोक',
      landfill: 'लैंडफिल कचरा बचत',
      btnScale: 'डिजिटल कांटा',
      btnBatch: 'नया बैच बनाएँ',
      btnPickups: 'पिकअप लिस्ट',
    },
    en: {
      title: 'Daily Kabadiwala Operations Command',
      sub: 'Aundh Ward Hub #4 · 27 September 2026',
      todayEarnings: "Today's Gross Value",
      netMargin: 'Estimated Net Profit',
      scrapCollected: 'Total Scrap Collected',
      tripsCompleted: 'Pickups Completed',
      categoryBreakdown: 'Scrap Volume by Category',
      ecoTitle: 'Environmental & Carbon Impact',
      trees: 'Trees Equivalent Saved',
      co2: 'CO₂e Emissions Averted',
      landfill: 'Landfill Diverted',
      btnScale: 'Digital Scale',
      btnBatch: 'Create Lot/Batch',
      btnPickups: 'Pickup Requests',
    },
  }[lang];

  const categories = [
    { label: 'Paper & Cardboard', kg: 140, pct: 41, color: 'bg-amber-500' },
    { label: 'Plastics (PET & HDPE)', kg: 98, pct: 29, color: 'bg-blue-500' },
    { label: 'Metals (Iron & Copper)', kg: 65, pct: 19, color: 'bg-emerald-500' },
    { label: 'E-Waste & Appliances', kg: 39, pct: 11, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">
            {content.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{content.sub}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <Clock className="w-3.5 h-3.5" />
          Live Shift
        </span>
      </div>

      {/* Top 2 Big Hero Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-medium mb-1">
            <span>{content.todayEarnings}</span>
            <Wallet className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-900 font-mono tabular-nums">
            ₹4,620
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            +18% vs yesterday
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-600 text-xs font-medium mb-1">
            <span>{content.scrapCollected}</span>
            <Scale className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            342 <span className="text-sm font-normal text-slate-500">kg</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            4 of 7 pickups completed
          </div>
        </div>
      </div>

      {/* Material Category Distribution */}
      <div className="mb-4 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          {content.categoryBreakdown}
        </h4>

        {/* Multi-segmented visual bar */}
        <div className="h-3 w-full rounded-full overflow-hidden flex mb-3 bg-slate-200">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`${cat.color} h-full`}
              style={{ width: `${cat.pct}%` }}
              title={`${cat.label}: ${cat.kg}kg (${cat.pct}%)`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.color} shrink-0`} />
                <span className="text-slate-700 truncate">{cat.label}</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 ml-1">
                {cat.kg}kg
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Eco Impact Banner */}
      <div className="bg-emerald-900 text-white rounded-xl p-3.5 mb-4 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mb-2">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <span>{content.ecoTitle}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-emerald-800/60 p-2 rounded-lg">
            <span className="text-[11px] text-emerald-200 block truncate">
              {content.trees}
            </span>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              2.8
            </span>
          </div>
          <div className="bg-emerald-800/60 p-2 rounded-lg">
            <span className="text-[11px] text-emerald-200 block truncate">
              {content.co2}
            </span>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              410 <span className="text-[10px]">kg</span>
            </span>
          </div>
          <div className="bg-emerald-800/60 p-2 rounded-lg">
            <span className="text-[11px] text-emerald-200 block truncate">
              {content.landfill}
            </span>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              342 <span className="text-[10px]">kg</span>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={onOpenScale}
          className="min-h-[44px] px-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <Scale className="w-3.5 h-3.5 text-emerald-600" />
          <span className="truncate">{content.btnScale}</span>
        </button>
        <button
          onClick={onOpenBatch}
          className="min-h-[44px] px-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span className="truncate">{content.btnBatch}</span>
        </button>
        <button
          onClick={onViewPickups}
          className="min-h-[44px] px-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="truncate">{content.btnPickups}</span>
        </button>
      </div>
    </div>
  );
};
