import React, { useState } from 'react';
import {
  CheckCircle2,
  QrCode,
  Share2,
  Download,
  Leaf,
  CreditCard,
  Check,
  ShieldCheck,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Language, WeighedItem } from '../../types';
import confetti from 'canvas-confetti';

interface DigitalReceiptProps {
  lang: Language;
  items?: WeighedItem[];
  customerName?: string;
  collectorName?: string;
  onPaymentSuccess?: () => void;
}

export const DigitalReceipt: React.FC<DigitalReceiptProps> = ({
  lang,
  items,
  customerName = 'Anand Deshmukh',
  collectorName = 'Ramesh Shinde (Authorized Partner)',
  onPaymentSuccess,
}) => {
  const defaultItems: WeighedItem[] = [
    {
      id: 'i-1',
      materialName: 'Old Newspaper (Raddi)',
      weightKg: 15.2,
      ratePerKg: 14,
      subtotal: 212.8,
    },
    {
      id: 'i-2',
      materialName: 'Iron grills & rods (Loha)',
      weightKg: 13.2,
      ratePerKg: 30,
      subtotal: 396.0,
    },
  ];

  const receiptItems = items && items.length > 0 ? items : defaultItems;
  const totalWeight = receiptItems.reduce((acc, i) => acc + i.weightKg, 0);
  const totalAmount = Math.round(
    receiptItems.reduce((acc, i) => acc + (i.subtotal ?? i.weightKg * i.ratePerKg), 0)
  );

  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Cash'>('UPI');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const content = {
    mr: {
      title: 'सत्यापित डिजिटल ग्रीन पावती',
      sub: 'शासकीय ईपीआर आणि चक्रीय अर्थव्यवस्था प्रमाणित',
      receiptNo: 'पावती क्रमांक',
      customer: 'विक्रेता नागरिक',
      collector: 'कबाडीवाला संकलक',
      itemCol: 'साहित्य',
      weightCol: 'वजन',
      rateCol: 'दर',
      totalCol: 'रक्कम',
      grandTotal: 'एकूण देय रक्कम',
      payNow: 'यूपीआय द्वारे तात्काळ पैसे ट्रान्सफर करा',
      paidNotice: 'पेमेंट यशस्वी! (UPI Ref: 9812498210)',
      ecoImpact: 'पर्यावरणीय योगदान: ३८ किलो कार्बन उत्सर्जन बचत',
      share: 'शेअर करा',
      print: 'प्रिंट / डाऊनलोड',
    },
    hi: {
      title: 'सत्यापित डिजिटल ग्रीन रसीद',
      sub: 'सरकारी ईपीआर एवं चक्रीय अर्थव्यवस्था प्रमाणित',
      receiptNo: 'रसीद संख्या',
      customer: 'नागरिक',
      collector: 'कबाड़ीवाला संकलनकर्ता',
      itemCol: 'सामग्री',
      weightCol: 'वजन',
      rateCol: 'दर',
      totalCol: 'रकम',
      grandTotal: 'कुल देय राशि',
      payNow: 'यूपीआई द्वारा तुरंत भुगतान करें',
      paidNotice: 'भुगतान सफल! (UPI Ref: 9812498210)',
      ecoImpact: 'पर्यावरण योगदान: ३८ किलो कार्बन उत्सर्जन बचत',
      share: 'शेयर करें',
      print: 'प्रिंट / डाउनलोड',
    },
    en: {
      title: 'Certified Digital Green Receipt',
      sub: 'Tamper-proof circular economy transaction & EPR audit pass',
      receiptNo: 'Receipt #',
      customer: 'Citizen Seller',
      collector: 'Authorized Collector',
      itemCol: 'Material',
      weightCol: 'Weight',
      rateCol: 'Rate',
      totalCol: 'Subtotal',
      grandTotal: 'Grand Total Payable',
      payNow: 'Instant UPI Payout Transfer',
      paidNotice: 'Payout Settled! (UPI Ref: 9812498210)',
      ecoImpact: 'Eco-Impact: 38 kg CO₂e averted · 0.2 trees protected',
      share: 'Share',
      print: 'Save PDF',
    },
  }[lang];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
      if (onPaymentSuccess) onPaymentSuccess();
    }, 700);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      {/* Header with verified badge */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-900 text-base">{content.title}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{content.sub}</p>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          #KAB-2026-8942
        </span>
      </div>

      {/* Parties & Timestamp */}
      <div className="grid grid-cols-2 gap-2 text-xs py-3 border-b border-slate-100">
        <div>
          <span className="text-slate-500 block">{content.customer}:</span>
          <span className="font-semibold text-slate-900">{customerName}</span>
          <span className="text-[11px] text-slate-500 block">Pune (Aundh)</span>
        </div>
        <div className="text-right">
          <span className="text-slate-500 block">{content.collector}:</span>
          <span className="font-semibold text-slate-900">{collectorName}</span>
          <span className="text-[11px] text-slate-500 block">
            ID: MH-KAB-PUN-042
          </span>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="py-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-500 border-b border-slate-200 text-left">
              <th className="pb-1.5 font-medium">{content.itemCol}</th>
              <th className="pb-1.5 font-medium text-right">{content.weightCol}</th>
              <th className="pb-1.5 font-medium text-right">{content.rateCol}</th>
              <th className="pb-1.5 font-medium text-right">{content.totalCol}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {receiptItems.map((item) => (
              <tr key={item.id} className="text-slate-800">
                <td className="py-2 font-medium">{item.materialName}</td>
                <td className="py-2 text-right font-mono">
                  {item.weightKg.toFixed(1)} kg
                </td>
                <td className="py-2 text-right font-mono">₹{item.ratePerKg}</td>
                <td className="py-2 text-right font-mono font-semibold">
                  ₹{(item.subtotal ?? item.weightKg * item.ratePerKg).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grand Total Strip */}
      <div className="bg-slate-900 text-white rounded-xl p-3.5 flex items-center justify-between mb-3">
        <div>
          <span className="text-xs text-slate-300 block">
            {content.grandTotal} ({totalWeight.toFixed(1)} kg)
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            ₹{totalAmount}
          </span>
        </div>

        {/* QR Code Icon / Verification */}
        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
          <QrCode className="w-8 h-8 text-white" />
          <div className="text-[10px] text-slate-300 font-mono leading-tight">
            <span>Scan to</span>
            <br />
            <span className="text-emerald-400 font-bold">Verify</span>
          </div>
        </div>
      </div>

      {/* Eco Impact Note */}
      <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 mb-3">
        <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="font-medium">{content.ecoImpact}</span>
      </div>

      {/* Payment Action */}
      {isPaid ? (
        <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-center font-medium text-xs flex items-center justify-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{content.paidNotice}</span>
        </div>
      ) : (
        <div className="space-y-2 mb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMode('UPI')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border ${
                paymentMode === 'UPI'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              UPI (Instant)
            </button>
            <button
              onClick={() => setPaymentMode('Cash')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border ${
                paymentMode === 'Cash'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              Cash (हस्तगत)
            </button>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {isProcessing ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>{content.payNow}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Share / Save buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
        <button
          onClick={() => alert('Receipt link copied to clipboard!')}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 font-medium"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{content.share}</span>
        </button>
        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 font-medium"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{content.print}</span>
        </button>
      </div>
    </div>
  );
};
