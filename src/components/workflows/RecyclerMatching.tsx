import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Star,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Database,
} from 'lucide-react';
import { Language, RecyclerOffer } from '../../types';
import { getRecyclers } from '../../services/firebaseService';
import confetti from 'canvas-confetti';

interface RecyclerMatchingProps {
  lang: Language;
  batchWeightKg?: number;
  onOfferAccepted?: (offer: RecyclerOffer) => void;
}

export const RecyclerMatching: React.FC<RecyclerMatchingProps> = ({
  lang,
  batchWeightKg = 420,
  onOfferAccepted,
}) => {
  const [offers, setOffers] = useState<RecyclerOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRecyclers();
        setOffers(data);
      } catch (e) {
        console.warn('Error loading recyclers from Firebase:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const content = {
    mr: {
      title: 'अधिकृत रिसायकलर स्मार्ट मॅचिंग (Firestore Data)',
      sub: 'बॅच #PUN-BAL-801 (420 किग्रॅ PET) साठी थेट खरेदीदार',
      offeredRate: 'खरेदी दर',
      distance: 'अंतर',
      settlement: 'पेमेंट कालावधी',
      acceptBid: 'ऑफर स्वीकारा व गाडी बुक करा',
      acceptedNotice: 'करारावर स्वाक्षरी झाली! लॉजिस्टिक पाठवले जात आहे.',
      eprVerified: 'CPCB EPR अधिकृत',
    },
    hi: {
      title: 'अधिकृत रिसाइकलर स्मार्ट मैचिंग (Firestore Data)',
      sub: 'बैच #PUN-BAL-801 (420 किग्रा PET) के लिए लाइव बोलियां',
      offeredRate: 'बोली दर',
      distance: 'दूरी',
      settlement: 'भुगतान अवधि',
      acceptBid: 'ऑफर स्वीकारें व वाहन बुक करें',
      acceptedNotice: 'सौदा पक्का हुआ! वाहन भेजा जा रहा है।',
      eprVerified: 'CPCB EPR अधिकृत',
    },
    en: {
      title: 'Authorized Recycler B2B Smart Matching (Firestore Data)',
      sub: 'Live spot bids for Batch #PUN-BAL-801 (420 kg PET Bales)',
      offeredRate: 'Spot Bid Rate',
      distance: 'Distance',
      settlement: 'Settlement Terms',
      acceptBid: 'Accept Bid & Dispatch EV Loader',
      acceptedNotice: 'Contract Locked! Transport dispatched to Hub #4.',
      eprVerified: 'CPCB EPR Certified',
    },
  }[lang];

  const handleAccept = (offer: RecyclerOffer) => {
    setAcceptedId(offer.id);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
    if (onOfferAccepted) onOfferAccepted(offer);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-base">{content.title}</h3>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Database className="w-3 h-3 text-emerald-600" />
                  <span>LIVE</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{content.sub}</p>
            </div>
          </div>
        </div>
      </div>

      {loading && offers.length === 0 ? (
        <div className="py-6 flex items-center justify-center text-xs text-slate-500 gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
          <span>Loading authorized recyclers...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => {
            const isAccepted = acceptedId === offer.id;
            const grossVal = (offer.bidRatePerKg || 25.5) * batchWeightKg;

            return (
              <div
                key={offer.id}
                className={`p-4 rounded-xl border transition-all ${
                  isAccepted
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-emerald-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {offer.companyName || (offer as any).name || (offer as any).recyclerName || 'EcoPlast Polymers'}
                      </h4>
                      <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {offer.rating || 4.9}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {offer.facilityLocation || (offer as any).location || 'Bhosari MIDC, Pune'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-700">
                      ₹{offer.bidRatePerKg || 25.5}
                    </span>
                    <span className="text-[11px] text-slate-500 block">/ kg spot</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100 mb-3">
                  <span className="text-slate-600">
                    Gross Payout ({batchWeightKg} kg):{' '}
                    <strong className="text-slate-900 font-mono">₹{grossVal.toLocaleString()}</strong>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    <ShieldCheck className="w-3 h-3 text-teal-600" />
                    {content.eprVerified}
                  </span>
                </div>

                {isAccepted ? (
                  <div className="p-2.5 rounded-lg bg-emerald-100/80 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{content.acceptedNotice}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAccept(offer)}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>{content.acceptBid}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
