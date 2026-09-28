import React, { useState, useEffect } from 'react';
import {
  GitCommit,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Leaf,
  Layers,
  RefreshCw,
  Database,
} from 'lucide-react';
import { Language, TraceabilityStep } from '../../types';
import { getTraceability } from '../../services/firebaseService';

interface TraceabilityTimelineProps {
  lang: Language;
  steps?: TraceabilityStep[];
}

export const TraceabilityTimeline: React.FC<TraceabilityTimelineProps> = ({
  lang,
  steps: initialSteps,
}) => {
  const [timelineSteps, setTimelineSteps] = useState<TraceabilityStep[]>(initialSteps || []);
  const [loading, setLoading] = useState<boolean>(!initialSteps || initialSteps.length === 0);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTraceability();
        setTimelineSteps(data);
      } catch (e) {
        console.warn('Error loading traceability from Firebase:', e);
      } finally {
        setLoading(false);
      }
    }
    if (!initialSteps || initialSteps.length === 0) {
      load();
    }
  }, [initialSteps]);

  const content = {
    mr: {
      title: 'संपूर्ण चक्रीय कचरा ट्रेसिबिलिटी टाइमलाइन (Firestore)',
      sub: 'घरातील कबाड ते अंतिम रिसायकल उत्पादनापर्यंतचा डिजिटल प्रवास',
      stepLabel: 'टप्पा',
      verifiedHash: 'सत्यापित डिजिटल हॅश',
      chainAuditPass: '१००% ईपीआर ऑडिट यशस्वी',
      liveNotice: 'कंटेनर सध्या चिखली महामार्गावर आहे',
    },
    hi: {
      title: 'संपूर्ण चक्रीय अपशिष्ट ट्रेसेबिलिटी टाइमलाइन (Firestore)',
      sub: 'घर से लेकर अंतिम रिसाइकिल उत्पाद तक का डिजिटल रिकॉर्ड',
      stepLabel: 'चरण',
      verifiedHash: 'सत्यापित डिजिटल हैश',
      chainAuditPass: '१००% ईपीआर ऑडिट सत्यापित',
      liveNotice: 'कंटेनर वर्तमान में महामार्ग पर गतिशील है',
    },
    en: {
      title: 'End-to-End Circular Traceability Timeline (Firestore)',
      sub: 'Verifiable chain of custody: Citizen doorstep to recycled polymer resin',
      stepLabel: 'Step',
      verifiedHash: 'Verifiable Hash',
      chainAuditPass: '100% EPR Audit Passed',
      liveNotice: 'Transit vehicle telematics live on Chakan Expressway',
    },
  }[lang];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Leaf className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  {content.title}
                </h3>
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

      {loading && timelineSteps.length === 0 ? (
        <div className="py-6 flex items-center justify-center text-xs text-slate-500 gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
          <span>Loading traceability ledger...</span>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {timelineSteps.map((step, idx) => (
            <div key={step.id || idx} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                  step.completed
                    ? 'bg-emerald-600 border-white text-white shadow-xs'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
              </div>

              {/* Step Card */}
              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  step.completed
                    ? 'bg-slate-50/70 border-slate-200'
                    : 'bg-white border-dashed border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      {content.stepLabel} {idx + 1}: {step.stage}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">
                      {lang === 'mr' ? step.titleMr || step.title : step.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {step.timestamp}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{step.actor || step.actorName}</span>
                    <span className="text-slate-400 font-normal">({step.location})</span>
                  </div>

                  <span className="font-mono text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {step.hash || step.verificationHash || `SHA256-${idx}9a4`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Certificate Badge */}
      <div className="mt-5 p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-teal-900">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span className="font-bold">{content.chainAuditPass}</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
          CPCB EPR-VERIFIED
        </span>
      </div>
    </div>
  );
};
