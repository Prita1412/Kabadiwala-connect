import React from 'react';
import { Truck, AlertCircle, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { Language } from '../../types';

interface RequestCountCardProps {
  lang: Language;
  onViewRequests?: () => void;
  onOpenMap?: () => void;
}

export const RequestCountCard: React.FC<RequestCountCardProps> = ({
  lang,
  onViewRequests,
  onOpenMap,
}) => {
  const content = {
    mr: {
      title: 'आजच्या पिकअप विनंत्या',
      sub: 'औंध व कोथरूड क्षेत्रामध्ये उपलब्ध',
      totalLabel: 'एकूण विनंत्या',
      urgentLabel: 'तातडीचे पिकअप (१ तासात)',
      estWeight: 'अंदाजे वजन',
      estEarnings: 'अंदाजे खरेदी मूल्य',
      btnView: 'पिकअप यादी पहा',
      btnMap: 'मार्ग नकाशा उघडा',
    },
    hi: {
      title: 'आज के पिकअप अनुरोध',
      sub: 'औंध व कोथरूड क्षेत्र में उपलब्ध',
      totalLabel: 'कुल अनुरोध',
      urgentLabel: 'अति आवश्यक (१ घंटे में)',
      estWeight: 'अनुमानित वजन',
      estEarnings: 'अनुमानित खरीद मूल्य',
      btnView: 'पिकअप सूची देखें',
      btnMap: 'रूट मैप खोलें',
    },
    en: {
      title: "Today's Pickup Requests",
      sub: 'Live in Aundh & Kothrud territory',
      totalLabel: 'Total Requests',
      urgentLabel: 'Urgent (Within 1 hr)',
      estWeight: 'Est. Weight',
      estEarnings: 'Est. Buy Value',
      btnView: 'View All Pickups',
      btnMap: 'Open Route Map',
    },
  }[lang];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Truck className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              {content.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {content.sub}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5" />
          3 {content.urgentLabel.split(' ')[0]}
        </span>
      </div>

      {/* Numerical Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 block truncate">
            {content.totalLabel}
          </span>
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            7
          </span>
        </div>
        <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100">
          <span className="text-[11px] font-medium text-amber-800 block truncate">
            {content.urgentLabel.split(' ')[0]}
          </span>
          <span className="text-2xl font-bold text-amber-900 font-mono tabular-nums">
            3
          </span>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 block truncate">
            {content.estWeight}
          </span>
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            153 <span className="text-xs font-normal text-slate-500">kg</span>
          </span>
        </div>
        <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100">
          <span className="text-[11px] font-medium text-emerald-800 block truncate">
            {content.estEarnings}
          </span>
          <span className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">
            ₹4,460
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={onViewRequests}
          className="flex-1 min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <span>{content.btnView}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenMap}
          className="min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <MapPin className="w-4 h-4 text-slate-600" />
          <span>{content.btnMap}</span>
        </button>
      </div>
    </div>
  );
};
