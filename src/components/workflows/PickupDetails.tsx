import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Scale,
  Navigation,
  Package,
  User,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { Language, PickupRequest } from '../../types';
import { MOCK_PICKUPS } from '../../data/mockData';

interface PickupDetailsProps {
  lang: Language;
  pickup?: PickupRequest;
  onStartWeighing?: (pickup: PickupRequest) => void;
  onOpenMap?: () => void;
}

export const PickupDetails: React.FC<PickupDetailsProps> = ({
  lang,
  pickup = MOCK_PICKUPS[0],
  onStartWeighing,
  onOpenMap,
}) => {
  const content = {
    mr: {
      title: 'पिकअप तपशील व संपर्क',
      customer: 'ग्राहक',
      address: 'पत्ता',
      scheduled: 'वेळ स्लॉट',
      scrapItems: 'विकायचे साहित्य',
      estWeight: 'अंदाजे वजन',
      estAmount: 'अंदाजे किंमत',
      startWeigh: 'डिजिटल वजन सुरू करा',
      navigate: 'मार्गदर्शक नकाशा',
      call: 'कॉल करा',
      verified: 'केवायसी सत्यापित नागरिक',
    },
    hi: {
      title: 'पिकअप विवरण व संपर्क',
      customer: 'ग्राहक',
      address: 'पता',
      scheduled: 'समय स्लॉट',
      scrapItems: 'कबाड़ सामग्री',
      estWeight: 'अनुमानित वजन',
      estAmount: 'अनुमानित मूल्य',
      startWeigh: 'डिजिटल तौल शुरू करें',
      navigate: 'रूट नेविगेशन',
      call: 'कॉल करें',
      verified: 'केवाईसी सत्यापित नागरिक',
    },
    en: {
      title: 'Pickup Details & Dispatch',
      customer: 'Citizen',
      address: 'Address',
      scheduled: 'Time Slot',
      scrapItems: 'Declared Scrap Items',
      estWeight: 'Est. Weight',
      estAmount: 'Est. Payout',
      startWeigh: 'Start Digital Weighing',
      navigate: 'Open Navigation',
      call: 'Call Citizen',
      verified: 'KYC Verified Household',
    },
  }[lang];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
            {pickup.id}
          </span>
          <h3 className="font-bold text-slate-900 text-lg mt-1">
            {content.title}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          {content.verified}
        </span>
      </div>

      {/* Customer Info Card */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 mb-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">
                {pickup.customerName}
              </h4>
              <p className="text-xs text-slate-500">{pickup.phone}</p>
            </div>
          </div>
          <a
            href={`tel:${pickup.phone}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{content.call}</span>
          </a>
        </div>

        <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-700">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{pickup.address}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{pickup.scheduledTime}</span>
          <span className="text-slate-300">·</span>
          <span className="text-emerald-700 font-medium font-mono">
            {pickup.distanceKm} km away
          </span>
        </div>
      </div>

      {/* Declared Materials */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {content.scrapItems}
        </h4>
        <div className="space-y-1.5">
          {(pickup.items || []).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/60"
            >
              <div className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium text-slate-800">{item.material || item.name || 'Scrap Material'}</span>
              </div>
              <span className="font-mono font-semibold text-slate-900">
                ~{item.approxKg} kg
              </span>
            </div>
          ))}
          {(!pickup.items || pickup.items.length === 0) && (pickup.materialTypes || pickup.materials || []).map((mat, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/60"
            >
              <div className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium text-slate-800">{mat}</span>
              </div>
              <span className="font-mono font-semibold text-slate-900">
                ~{pickup.estimatedWeight}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Metric strip */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">
            {content.estWeight}
          </span>
          <span className="text-lg font-bold text-slate-900 font-mono">
            {pickup.estimatedWeightKg} kg
          </span>
        </div>
        <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200 text-center">
          <span className="text-[11px] text-emerald-800 block">
            {content.estAmount}
          </span>
          <span className="text-lg font-bold text-emerald-900 font-mono">
            ₹{pickup.estimatedEarnings}
          </span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <button
          onClick={() => onStartWeighing && onStartWeighing(pickup)}
          className="w-full sm:flex-1 min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Scale className="w-4 h-4" />
          <span>{content.startWeigh}</span>
        </button>
        <button
          onClick={onOpenMap}
          className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Navigation className="w-4 h-4 text-slate-600" />
          <span>{content.navigate}</span>
        </button>
      </div>
    </div>
  );
};
