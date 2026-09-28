import React from 'react';
import {
  Layers,
  QrCode,
  ShieldCheck,
  CheckCircle,
  FileText,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { Language, BatchItem } from '../../types';
import { MOCK_BATCHES } from '../../data/mockData';

interface BatchDetailsProps {
  lang: Language;
  batch?: BatchItem;
  onMatchRecycler?: (batchId: string) => void;
  onViewTraceability?: () => void;
}

export const BatchDetails: React.FC<BatchDetailsProps> = ({
  lang,
  batch = MOCK_BATCHES[0],
  onMatchRecycler,
  onViewTraceability,
}) => {
  const content = {
    mr: {
      title: 'बॅच गुणवत्ता प्रमाणपत्र व तपशील',
      sub: 'मान्यताप्राप्त लॅब चाचणी व सील पडताळणी',
      batchNo: 'बॅच क्रमांक',
      material: 'साहित्य',
      weight: 'एकूण वजन',
      bales: 'बेल्स संख्या',
      moisture: 'आर्द्रता (Moisture)',
      contamination: 'अशुद्धता (Contamination)',
      seal: 'टॅम्पर सील आयडी',
      origin: 'मूळ संकलन केंद्र',
      status: 'सद्यस्थिती',
      matchRecycler: 'रिसायकलर दर पडताळा',
      traceability: 'चक्रीय टाइमलाइन पहा',
    },
    hi: {
      title: 'बैच गुणवत्ता प्रमाणपत्र व विवरण',
      sub: 'मान्यताप्राप्त लैब टेस्ट व डिजिटल सील',
      batchNo: 'बैच संख्या',
      material: 'सामग्री',
      weight: 'कुल वजन',
      bales: 'बेल्स संख्या',
      moisture: 'नमी (Moisture)',
      contamination: 'अशुद्धता (Contamination)',
      seal: 'टैम्पर सील आईडी',
      origin: 'उत्पत्ति केंद्र',
      status: 'स्थिति',
      matchRecycler: 'रिसाइक्लर रेट देखें',
      traceability: 'ट्रेसेबिलिटी टाइमलाइन',
    },
    en: {
      title: 'Scrap Batch Certificate of Quality',
      sub: 'Accredited test manifest and digital custody seal',
      batchNo: 'Batch No.',
      material: 'Specification',
      weight: 'Gross Weight',
      bales: 'Bale Units',
      moisture: 'Moisture Content',
      contamination: 'Contamination',
      seal: 'Tamper Seal ID',
      origin: 'Origin Micro-Hub',
      status: 'Consignment Status',
      matchRecycler: 'Compare Recycler Bids',
      traceability: 'View Traceability Chain',
    },
  }[lang];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      <div className="flex items-start justify-between pb-3 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            {batch.batchNumber}
          </span>
          <h3 className="font-bold text-slate-900 text-base mt-1.5">
            {batch.materialType}
          </h3>
          <p className="text-xs text-slate-500">{batch.originHub}</p>
        </div>
        <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
          <QrCode className="w-7 h-7" />
        </div>
      </div>

      {/* Lab Quality Test Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 block truncate">
            {content.weight}
          </span>
          <span className="text-base font-bold text-slate-900 font-mono">
            {batch.totalWeightKg} kg
          </span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 block truncate">
            {content.bales}
          </span>
          <span className="text-base font-bold text-slate-900 font-mono">
            {batch.balesCount} Units
          </span>
        </div>
        <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
          <span className="text-[10px] text-emerald-800 block truncate">
            {content.moisture}
          </span>
          <span className="text-base font-bold text-emerald-900 font-mono">
            {batch.moisturePercent}%
          </span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 block truncate">
            {content.contamination}
          </span>
          <span className="text-base font-bold text-slate-900 font-mono">
            {batch.contaminationPercent}%
          </span>
        </div>
      </div>

      {/* Tamper Seal & Manifest */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-500">{content.seal}:</span>
          <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
            {batch.tamperSealId}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">{content.status}:</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Ready for Dispatch (Verified)
          </span>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={() => onMatchRecycler && onMatchRecycler(batch.id)}
          className="w-full sm:flex-1 min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Truck className="w-4 h-4" />
          <span>{content.matchRecycler}</span>
        </button>
        <button
          onClick={onViewTraceability}
          className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <FileText className="w-4 h-4 text-slate-600" />
          <span>{content.traceability}</span>
        </button>
      </div>
    </div>
  );
};
