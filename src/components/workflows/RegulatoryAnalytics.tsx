import React from 'react';
import {
  BarChart3,
  Landmark,
  ShieldCheck,
  Download,
  AlertTriangle,
  TrendingUp,
  MapPin,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Language } from '../../types';

interface RegulatoryAnalyticsProps {
  lang: Language;
}

export const RegulatoryAnalytics: React.FC<RegulatoryAnalyticsProps> = ({
  lang,
}) => {
  const content = {
    mr: {
      title: 'शासकीय व मनपा नियामक विश्लेषण अहवाल',
      sub: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB) व CPCB पोर्टल समन्वय',
      landfillDiverted: 'लँडफिलपासून वाचवलेला एकूण कचरा',
      eprFulfillment: 'ईपीआर अनुपालन पूर्तता',
      informalWorkers: 'प्रमाणित कबाडीवाला नोंदणी',
      wardAudit: 'वॉर्डनिहाय कचरा संकलन कामगिरी',
      downloadReport: 'MPCB अधिकृत अहवाल (PDF/Excel) डाऊनलोड करा',
      compliancePass: 'PWM नियम २०२६ अंतर्गत सर्व निकष पूर्ण',
    },
    hi: {
      title: 'सरकारी व नगर निगम नियामक विश्लेषण रिपोर्ट',
      sub: 'प्रदूषण नियंत्रण बोर्ड (CPCB/MPCB) समन्वय पोर्टल',
      landfillDiverted: 'लैंडफिल से बचाया गया कुल कचरा',
      eprFulfillment: 'ईपीआर अनुपालन पूर्ति',
      informalWorkers: 'कबाड़ीवाला औपचारिक पंजीकरण',
      wardAudit: 'वार्डवार अपशिष्ट संकलन रिपोर्ट',
      downloadReport: 'MPCB अधिकृत रिपोर्ट (PDF/Excel) डाउनलोड करें',
      compliancePass: 'प्लास्टिक वेस्ट नियम २०२६ अंतर्गत प्रमाणित',
    },
    en: {
      title: 'Regulatory & EPR Compliance Intelligence',
      sub: 'Maharashtra Pollution Control Board & CPCB Municipal Audit Portal',
      landfillDiverted: 'Total Landfill Diverted',
      eprFulfillment: 'EPR Target Fulfilled',
      informalWorkers: 'Informal Pickers Registered',
      wardAudit: 'Ward-Level Scrap Diversion',
      downloadReport: 'Export Official MPCB Compliance Audit',
      compliancePass: 'In full accordance with Plastic Waste Management Rules 2026',
    },
  }[lang];

  const wards = [
    { name: 'Ward 4 (Aundh)', divertedTonnes: 412, targetPct: 96 },
    { name: 'Ward 8 (Kothrud)', divertedTonnes: 384, targetPct: 92 },
    { name: 'Ward 2 (Shivajinagar)', divertedTonnes: 365, targetPct: 88 },
    { name: 'Ward 11 (Baner-Balewadi)', divertedTonnes: 319, targetPct: 94 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      {/* Title */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-slate-900 text-white rounded-xl">
              <Landmark className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 text-base">{content.title}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{content.sub}</p>
        </div>
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
          Audit Ready
        </span>
      </div>

      {/* Top 3 KPI Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 block truncate">
            {content.landfillDiverted}
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
            1,480 <span className="text-xs font-normal">MT</span>
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
            +28% YoY
          </span>
        </div>

        <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
          <span className="text-[10px] text-emerald-800 block truncate">
            {content.eprFulfillment}
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-950">
            94.2%
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
            On Target
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 block truncate">
            {content.informalWorkers}
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
            88.6%
          </span>
          <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
            1,240 KYC
          </span>
        </div>
      </div>

      {/* Ward Audit Table */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          {content.wardAudit}
        </h4>
        <div className="space-y-2">
          {wards.map((w, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">{w.name}</span>
                <span className="font-mono font-bold text-slate-900">
                  {w.divertedTonnes} MT ({w.targetPct}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${w.targetPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance statement & Download */}
      <div className="text-xs text-slate-600 bg-emerald-50/50 border border-emerald-200/60 p-2.5 rounded-xl mb-3 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>{content.compliancePass}</span>
      </div>

      <button
        onClick={() => alert('Official MPCB Compliance Report PDF exported.')}
        className="w-full min-h-[44px] px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>{content.downloadReport}</span>
      </button>
    </div>
  );
};
