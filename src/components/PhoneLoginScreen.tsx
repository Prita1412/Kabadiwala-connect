import React, { useState } from 'react';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Recycle,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { Language } from '../types';
import { authenticateWithPhoneDev } from '../services/firebaseService';

interface PhoneLoginScreenProps {
  lang: Language;
  onLoginSuccess: (phoneNumber: string) => void;
  onBackToLanding?: () => void;
  onSelectLanguage?: (lang: Language) => void;
}

export const PhoneLoginScreen: React.FC<PhoneLoginScreenProps> = ({
  lang,
  onLoginSuccess,
  onBackToLanding,
  onSelectLanguage,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('9822014829');
  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('123456');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const content = {
    mr: {
      backBtn: 'मागे जा',
      headline: 'KabadiGpt मध्ये स्वागत आहे',
      subHeadline: 'कचरा व्यवस्थापन, चक्रीय अर्थव्यवस्था व पारदर्शक भंगार संकलन प्लॅटफॉर्म',
      phoneLabel: 'तुमचा १० अंकी मोबाईल नंबर टाका',
      sendOtp: 'ओटीपी पाठवा',
      otpLabel: 'मोबाईलवर आलेला OTP टाका',
      verifyBtn: 'सत्यापित करा व पुढे जा',
      devBadge: 'प्रोटोटाइप लॉगिन · Dev OTP: 123456',
      resend: 'पुन्हा पाठवा',
      terms: 'पुढे जाऊन तुम्ही KabadiGpt च्या नियमावलीशी सहमत आहात.',
      invalidOtp: 'अवैध OTP! कृपया चाचणीसाठी 123456 टाका.',
      quickFill: 'चाचणी OTP (123456) भरा',
      changeNumber: 'नंबर बदला',
    },
    hi: {
      backBtn: 'पीछे जाएं',
      headline: 'KabadiGpt में आपका स्वागत है',
      subHeadline: 'अपशिष्ट प्रबंधन, चक्रीय अर्थव्यवस्था और पारदर्शी कबाड़ प्लेटफॉर्म',
      phoneLabel: 'अपना १० अंकों का मोबाइल नंबर दर्ज करें',
      sendOtp: 'ओटीपी भेजें',
      otpLabel: 'मोबाइल पर आया OTP दर्ज करें',
      verifyBtn: 'सत्यापित करें और आगे बढ़ें',
      devBadge: 'प्रोटोटाइप लॉगिन · Dev OTP: 123456',
      resend: 'पुनः भेजें',
      terms: 'आगे बढ़कर आप KabadiGpt की शर्तों से सहमत होते हैं।',
      invalidOtp: 'अमान्य OTP! कृपया परीक्षण के लिए 123456 दर्ज करें।',
      quickFill: 'परीक्षण OTP (123456) भरें',
      changeNumber: 'नंबर बदलें',
    },
    en: {
      backBtn: 'Back',
      headline: 'Welcome to KabadiGpt',
      subHeadline: 'Conversational waste-management, circular recycling & traceability platform',
      phoneLabel: 'Enter your 10-digit mobile number',
      sendOtp: 'Get Verification OTP',
      otpLabel: 'Enter 6-digit OTP code',
      verifyBtn: 'Verify OTP & Continue',
      devBadge: 'Prototype Verification · Dev OTP: 123456',
      resend: 'Resend OTP',
      terms: 'By continuing, you agree to KabadiGpt Circular Waste Terms of Use.',
      invalidOtp: 'Invalid OTP! Please enter 123456 for prototype login.',
      quickFill: 'Auto-fill Dev OTP (123456)',
      changeNumber: 'Change number',
    },
  }[lang];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number');
      return;
    }
    setErrorMsg(null);
    setOtpStep(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Development-only OTP simulation (accepts 123456)
    if (otpCode.trim() !== '123456') {
      setErrorMsg(content.invalidOtp);
      return;
    }

    setIsVerifying(true);
    try {
      const cleanPhone = `+91 ${phoneNumber.replace(/\D/g, '')}`;
      // Authenticate with Firebase Authentication
      await authenticateWithPhoneDev(cleanPhone, otpCode);
      setIsVerifying(false);
      onLoginSuccess(cleanPhone);
    } catch (err: any) {
      console.warn('Firebase authentication notice:', err);
      setIsVerifying(false);
      onLoginSuccess(`+91 ${phoneNumber.replace(/\D/g, '')}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-slate-50 to-slate-100 flex flex-col justify-center items-center px-4 py-8">
      {/* Top action row */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors p-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{content.backBtn}</span>
          </button>
        )}

        {onSelectLanguage && (
          <div className="ml-auto flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => onSelectLanguage('mr')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                lang === 'mr' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => onSelectLanguage('hi')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                lang === 'hi' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onSelectLanguage('en')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                lang === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>
        )}
      </div>

      {/* Main card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 mb-3 animate-bounce-subtle">
            <Recycle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Kabadi<span className="text-emerald-600">Gpt</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs leading-relaxed">
            {content.subHeadline}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>{content.devBadge}</span>
          </div>
        </div>

        {/* Step 1: Phone Number Input */}
        {!otpStep ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {content.phoneLabel}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-mono font-bold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="98220 14829"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 font-mono text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  autoFocus
                />
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <span>{content.sendOtp}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {content.otpLabel}
                </label>
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="text-xs text-emerald-700 hover:underline font-medium cursor-pointer"
                >
                  {content.changeNumber} (+91 {phoneNumber})
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.4em] py-3 px-4 rounded-xl border border-slate-300 font-mono text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  autoFocus
                />
              </div>

              {/* Dev helper to autofill 123456 */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Dev OTP: <strong className="text-emerald-700 font-mono">123456</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode('123456');
                    setErrorMsg(null);
                  }}
                  className="text-emerald-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>{content.quickFill}</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full min-h-[48px] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              {isVerifying ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{content.verifyBtn}</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 leading-normal">
            {content.terms}
          </p>
        </div>
      </div>
    </div>
  );
};
