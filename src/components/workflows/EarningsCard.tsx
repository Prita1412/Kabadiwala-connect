import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Building,
  CreditCard,
  Download,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Language } from '../../types';
import confetti from 'canvas-confetti';

interface EarningsCardProps {
  lang: Language;
  onViewDashboard?: () => void;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({
  lang,
  onViewDashboard,
}) => {
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [withdrawn, setWithdrawn] = useState<boolean>(false);

  const content = {
    mr: {
      title: 'कमाई व तात्काळ बँक सेटलमेंट',
      sub: 'बँक ऑफ महाराष्ट्र खाते: ****4892 शी संलग्न',
      todayEarnings: 'आजची एकूण कमाई',
      weekEarnings: 'या आठवड्याची कमाई',
      availablePayout: 'तात्काळ काढण्यायोग्य शिल्लक',
      withdrawBtn: 'बँक खात्यात UPI ट्रान्सफर करा',
      withdrawnMsg: '₹४,६२० थेट बँक खात्यात जमा झाले!',
      historyTitle: 'अलीकडील सेटलमेंट्स',
      viewDashboard: 'संपूर्ण डॅशबोर्ड पहा',
    },
    hi: {
      title: 'कमाई व तुरंत बैंक सेटलमेंट',
      sub: 'बैंक ऑफ महाराष्ट्र खाता: ****4892 से जुड़ा',
      todayEarnings: 'आज की कुल कमाई',
      weekEarnings: 'इस सप्ताह की कमाई',
      availablePayout: 'तुरंत निकालने योग्य शेष',
      withdrawBtn: 'बैंक खाते में ट्रांसफर करें',
      withdrawnMsg: '₹४,६२० सीधे बैंक खाते में जमा!',
      historyTitle: 'हाल के सेटलमेंट',
      viewDashboard: 'पूरा डैशबोर्ड देखें',
    },
    en: {
      title: 'Daily Earnings & Direct Payout',
      sub: 'Linked to Bank of Maharashtra: ****4892 (NPCI Verified)',
      todayEarnings: "Today's Gross Earnings",
      weekEarnings: 'Weekly Total (7 Days)',
      availablePayout: 'Available for Immediate Transfer',
      withdrawBtn: 'Withdraw Instantly via UPI',
      withdrawnMsg: '₹4,620 successfully transferred to your bank account!',
      historyTitle: 'Recent Settlements',
      viewDashboard: 'View Full Dashboard',
    },
  }[lang];

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawn(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Wallet className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              {content.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            {content.sub}
          </p>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Auto-Settlement Ready
        </span>
      </div>

      {/* Main Big Earnings Display */}
      <div className="bg-slate-950 text-white rounded-xl p-4 mb-4 border border-slate-800">
        <span className="text-xs text-slate-400 block mb-1">
          {content.availablePayout}
        </span>
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-400">
            ₹4,620.00
          </span>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +22% Today
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block">{content.todayEarnings}</span>
            <span className="font-mono font-bold text-white text-sm">
              ₹4,620 (342 kg)
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block">{content.weekEarnings}</span>
            <span className="font-mono font-bold text-white text-sm">
              ₹27,450 (1,840 kg)
            </span>
          </div>
        </div>
      </div>

      {/* Instant Bank Transfer Button */}
      {withdrawn ? (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{content.withdrawnMsg}</span>
        </div>
      ) : (
        <button
          onClick={handleWithdraw}
          disabled={isWithdrawing}
          className="w-full min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors mb-4 shadow-sm"
        >
          {isWithdrawing ? (
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>{content.withdrawBtn}</span>
            </>
          )}
        </button>
      )}

      {/* Mini Settlements History */}
      <div className="space-y-1.5 text-xs mb-3">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
          {content.historyTitle}
        </span>
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <div>
              <span className="font-semibold text-slate-800">
                UPI Payout · HDFC-UPI-9921
              </span>
              <span className="text-[10px] text-slate-500 block">
                26 Sep 2026, 07:15 PM
              </span>
            </div>
          </div>
          <span className="font-mono font-bold text-slate-900">₹3,890.00</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <div>
              <span className="font-semibold text-slate-800">
                UPI Payout · HDFC-UPI-8841
              </span>
              <span className="text-[10px] text-slate-500 block">
                25 Sep 2026, 06:40 PM
              </span>
            </div>
          </div>
          <span className="font-mono font-bold text-slate-900">₹4,120.00</span>
        </div>
      </div>

      <button
        onClick={onViewDashboard}
        className="w-full text-xs font-semibold text-slate-700 hover:text-emerald-700 py-2 border-t border-slate-100 flex items-center justify-center gap-1 transition-colors"
      >
        <span>{content.viewDashboard}</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
