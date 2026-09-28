import React, { useState } from 'react';
import {
  Check,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Language, ScrapRate } from '../../types';
import { SCRAP_RATES } from '../../data/mockData';
import { createPickupRequest } from '../../services/firebaseService';
import confetti from 'canvas-confetti';

interface SellScrapWorkflowProps {
  lang: Language;
  initialCategory?: string;
  onBookingComplete?: (bookingData: any) => void;
}

export const SellScrapWorkflow: React.FC<SellScrapWorkflowProps> = ({
  lang,
  initialCategory,
  onBookingComplete,
}) => {
  const [step, setStep] = useState<'select_items' | 'schedule' | 'confirmed'>(
    'select_items'
  );
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { rate: ScrapRate; approxKg: number }>
  >(() => {
    // Default select e-waste if laptop query, or newspaper if general
    if (initialCategory === 'ewaste') {
      const laptopRate = SCRAP_RATES.find((r) => r.id === 'rate-9') || SCRAP_RATES[0];
      return { [laptopRate.id]: { rate: laptopRate, approxKg: 3 } };
    }
    const raddi = SCRAP_RATES[0];
    return { [raddi.id]: { rate: raddi, approxKg: 10 } };
  });

  const [dateSlot, setDateSlot] = useState<string>('Today');
  const [timeSlot, setTimeSlot] = useState<string>('Morning (10 AM - 1 PM)');
  const [address, setAddress] = useState<string>(
    'B-402, Rohan Nilay, Aundh, Pune - 411007'
  );
  const [phone, setPhone] = useState<string>('+91 98220 14829');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const content = {
    mr: {
      title: 'घरबसल्या कबाड विका',
      sub: 'वाजवी हमीभाव व विनामूल्य दारात पिकअप',
      step1: '१. भंगार निवडा',
      step2: '२. वेळ व पत्ता',
      step3: '३. बुकिंग पुष्टी',
      estPayout: 'अंदाजे मिळणारे पैसे',
      totalEstWeight: 'अंदाजे एकूण वजन',
      kgLabel: 'किग्रॅ',
      nextBtn: 'वेळ व पत्ता निवडा',
      confirmBtn: 'पिकअप बुक करा',
      addressLabel: 'पिकअप पत्ता',
      phoneLabel: 'मोबाईल क्रमांक',
      slotLabel: 'पिकअप स्लॉट',
      successTitle: 'पिकअप यशस्वीरित्या बुक झाला!',
      successSub: 'जवळचा प्रमाणित कबाडीवाला (Ramesh Shinde) लवकरच तुमच्या घरी पोहोचेल.',
      bookingId: 'बुकिंग आयडी',
      trackBtn: 'पिकअप ट्रॅक करा',
    },
    hi: {
      title: 'घर बैठे कबाड़ बेचें',
      sub: 'सटीक दाम और मुफ्त डोरस्टेप पिकअप',
      step1: '१. कबाड़ चुनें',
      step2: '२. समय व पता',
      step3: '३. बुकिंग पुष्टि',
      estPayout: 'अनुमानित मिलने वाली राशि',
      totalEstWeight: 'कुल अनुमानित वजन',
      kgLabel: 'किलो',
      nextBtn: 'समय व पता चुनें',
      confirmBtn: 'पिकअप बुक करें',
      addressLabel: 'पिकअप पता',
      phoneLabel: 'मोबाइल नंबर',
      slotLabel: 'पिकअप स्लॉट',
      successTitle: 'पिकअप सफलतापूर्वक बुक हुआ!',
      successSub: 'सत्यापित कबाड़ीवाला जल्द आपके पते पर पहुँचेगा।',
      bookingId: 'बुकिंग आईडी',
      trackBtn: 'पिकअप ट्रैक करें',
    },
    en: {
      title: 'Sell Scrap from Doorstep',
      sub: 'Guaranteed spot rates with certified digital weighing',
      step1: '1. Select Items',
      step2: '2. Time & Address',
      step3: '3. Booking Confirmed',
      estPayout: 'Est. Total Payout',
      totalEstWeight: 'Est. Total Weight',
      kgLabel: 'kg',
      nextBtn: 'Proceed to Time & Address',
      confirmBtn: 'Confirm Pickup Booking',
      addressLabel: 'Pickup Address',
      phoneLabel: 'Contact Mobile',
      slotLabel: 'Preferred Slot',
      successTitle: 'Pickup Successfully Booked!',
      successSub: 'Verified neighborhood collector (Ramesh Shinde) is assigned.',
      bookingId: 'Booking Reference',
      trackBtn: 'Track Pickup Status',
    },
  }[lang];

  const toggleItem = (rate: ScrapRate) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      if (copy[rate.id]) {
        delete copy[rate.id];
      } else {
        copy[rate.id] = { rate, approxKg: 5 };
      }
      return copy;
    });
  };

  const updateWeight = (id: string, kg: number) => {
    setSelectedItems((prev) => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], approxKg: Math.max(1, kg) },
      };
    });
  };

  const selectedList = Object.values(selectedItems);
  const totalWeight = selectedList.reduce((acc, curr) => acc + curr.approxKg, 0);
  const totalPayout = selectedList.reduce(
    (acc, curr) => acc + curr.approxKg * curr.rate.ratePerKg,
    0
  );

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await createPickupRequest({
        materialTypes: selectedList.map((item) => item.rate.name),
        estimatedWeight: `${totalWeight} kg`,
        address: address,
        preferredPickupTime: `${dateSlot}, ${timeSlot}`,
        customerName: 'Anand Deshmukh',
        phone: phone || '+91 98220 14829',
        estimatedPayout: totalPayout,
      });
    } catch (e) {
      console.warn('Persisted pickup request error/offline:', e);
    }
    setIsSubmitting(false);
    setStep('confirmed');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {}
    if (onBookingComplete) {
      onBookingComplete({
        items: selectedList,
        totalWeight,
        totalPayout,
        address,
        phone,
        slot: `${dateSlot}, ${timeSlot}`,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      {/* Title Bar */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              {content.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{content.sub}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Rates
        </span>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-4 px-1 border-b border-slate-100 pb-2">
        <span
          className={
            step === 'select_items' ? 'text-emerald-700 font-bold' : 'text-slate-400'
          }
        >
          {content.step1}
        </span>
        <span>→</span>
        <span
          className={
            step === 'schedule' ? 'text-emerald-700 font-bold' : 'text-slate-400'
          }
        >
          {content.step2}
        </span>
        <span>→</span>
        <span
          className={
            step === 'confirmed' ? 'text-emerald-700 font-bold' : 'text-slate-400'
          }
        >
          {content.step3}
        </span>
      </div>

      {/* STEP 1: SELECT ITEMS */}
      {step === 'select_items' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SCRAP_RATES.map((rate) => {
              const isSelected = !!selectedItems[rate.id];
              const nameDisplay =
                lang === 'mr'
                  ? rate.nameMr
                  : lang === 'hi'
                  ? rate.nameHi
                  : rate.name;
              return (
                <div
                  key={rate.id}
                  onClick={() => toggleItem(rate)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{rate.icon}</span>
                      <div>
                        <span className="font-semibold text-xs sm:text-sm text-slate-900 block leading-tight">
                          {nameDisplay}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 font-mono">
                          ₹{rate.ratePerKg} / kg
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {/* Weight slider if selected */}
                  {isSelected && (
                    <div
                      className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[11px] text-slate-600 font-medium">
                        Qty:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateWeight(
                              rate.id,
                              selectedItems[rate.id].approxKg - 5
                            )
                          }
                          className="w-6 h-6 rounded bg-white border border-slate-300 text-xs font-bold flex items-center justify-center hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-xs px-1 text-slate-900">
                          {selectedItems[rate.id].approxKg} kg
                        </span>
                        <button
                          onClick={() =>
                            updateWeight(
                              rate.id,
                              selectedItems[rate.id].approxKg + 5
                            )
                          }
                          className="w-6 h-6 rounded bg-white border border-slate-300 text-xs font-bold flex items-center justify-center hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Calculator summary strip */}
          <div className="bg-slate-900 text-white rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300 block">
                {content.estPayout}
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                ₹{totalPayout}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-300 block">
                {content.totalEstWeight}
              </span>
              <span className="text-xl font-bold font-mono text-white">
                {totalWeight} {content.kgLabel}
              </span>
            </div>
          </div>

          <button
            disabled={selectedList.length === 0}
            onClick={() => setStep('schedule')}
            className="w-full min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>{content.nextBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: SCHEDULE & ADDRESS */}
      {step === 'schedule' && (
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {content.slotLabel}
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {['Today', 'Tomorrow'].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setDateSlot(day)}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${
                    dateSlot === day
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {day}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Morning (10 AM - 1 PM)', 'Afternoon (2 PM - 6 PM)'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setTimeSlot(time)}
                  className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${
                    timeSlot === time
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {content.addressLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs p-2.5 pl-8 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {content.phoneLabel}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setStep('select_items')}
              className="min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {isSubmitting ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{content.confirmBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRMED */}
      {step === 'confirmed' && (
        <div className="text-center py-3 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              {content.successTitle}
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
              {content.successSub}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 max-w-xs mx-auto text-left text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">{content.bookingId}:</span>
              <span className="font-mono font-bold text-slate-900">
                #KAB-PUN-9021
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Slot:</span>
              <span className="font-medium text-slate-900">
                {dateSlot}, {timeSlot.split(' ')[0]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Est. Payout:</span>
              <span className="font-mono font-bold text-emerald-700">
                ₹{totalPayout}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
