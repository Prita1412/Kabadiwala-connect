import React from 'react';
import {
  Recycle,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Users,
  ShieldCheck,
  Home,
  LogOut,
} from 'lucide-react';
import { Language, UserRole, KycStatus } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  currentLang: Language;
  soundEnabled: boolean;
  kycStatus?: KycStatus;
  userPhone?: string;
  onRoleChange: (role: UserRole) => void;
  onLangChange: (lang: Language) => void;
  onToggleSound: () => void;
  onResetChat: () => void;
  onGoToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentLang,
  soundEnabled,
  kycStatus,
  userPhone,
  onRoleChange,
  onLangChange,
  onToggleSound,
  onResetChat,
  onGoToLanding,
}) => {
  const roles: { id: UserRole; labelEn: string; labelMr: string; labelHi: string }[] = [
    { id: 'household', labelEn: 'Household', labelMr: 'घरगुती', labelHi: 'नागरिक' },
    { id: 'kabadiwala', labelEn: 'Kabadiwala', labelMr: 'कबाडीवाला', labelHi: 'कबाड़ीवाला' },
    { id: 'recycler', labelEn: 'Recycler', labelMr: 'रिसायकलर', labelHi: 'रीसाइक्लर' },
    { id: 'regulator', labelEn: 'Regulator', labelMr: 'नियामक', labelHi: 'नियामक' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
        {/* Zone 1: Wordmark & Home button */}
        <div className="flex items-center gap-2">
          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              title="Landing Screen"
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Recycle className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 hidden sm:inline">
              Kabadi<span className="text-emerald-600">Gpt</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Role Switcher & KYC Badge & Language Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Persona selector dropdown */}
          <div className="relative">
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="text-xs font-semibold py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Select Target User Role"
            >
              {roles.map((r) => {
                const label =
                  currentLang === 'mr'
                    ? r.labelMr
                    : currentLang === 'hi'
                    ? r.labelHi
                    : r.labelEn;
                return (
                  <option key={r.id} value={r.id}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* KYC Status Prototype Tag */}
          {kycStatus && (
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              <span>{kycStatus}</span>
            </span>
          )}

          {/* Language Selector pills */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            {(['mr', 'hi', 'en'] as Language[]).map((langCode) => {
              const labelMap: Record<Language, string> = {
                mr: 'मराठी',
                hi: 'हिंदी',
                en: 'EN',
              };
              const active = currentLang === langCode;
              return (
                <button
                  key={langCode}
                  onClick={() => onLangChange(langCode)}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {labelMap[langCode]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zone 3: Voice audio toggle & Reset */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleSound}
            className={`min-h-[36px] min-w-[36px] p-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              soundEnabled
                ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={soundEnabled ? 'Speech Output Active' : 'Enable Speech Output'}
            aria-label="Toggle voice output"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onResetChat}
            className="min-h-[36px] min-w-[36px] p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
            title="Start New Conversation"
            aria-label="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
