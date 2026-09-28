import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  Car,
} from 'lucide-react';
import { Language, PickupRequest } from '../../types';
import { MOCK_PICKUPS } from '../../data/mockData';

interface PickupMapProps {
  lang: Language;
  pickups?: PickupRequest[];
  onSelectPickup?: (pickup: PickupRequest) => void;
}

export const PickupMap: React.FC<PickupMapProps> = ({
  lang,
  pickups = MOCK_PICKUPS,
  onSelectPickup,
}) => {
  const [activeStop, setActiveStop] = useState<number>(0);

  const content = {
    mr: {
      title: 'पिकअप मार्ग व थेट जीपीएस नकाशा',
      sub: 'कबाडीवाला ई-लोडर: MH-12-RP-3012',
      eta: 'पुढील थांबा पोहच वेळ',
      totalRoute: 'एकूण अंतर',
      stops: 'थांबे',
      simulatedMapNotice: 'थेट जीपीएस ट्रॅकिंग सक्रिय',
      startNav: 'गुगल मॅप्स नेव्हिगेशन सुरू करा',
    },
    hi: {
      title: 'पिकअप रूट व लाइव जीपीएस मैप',
      sub: 'ई-लोडर वाहन: MH-12-RP-3012',
      eta: 'अगले स्टॉप का समय',
      totalRoute: 'कुल दूरी',
      stops: 'स्टॉप्स',
      simulatedMapNotice: 'लाइव जीपीएस ट्रैकिंग चालू है',
      startNav: 'नेविगेशन शुरू करें',
    },
    en: {
      title: 'Optimized Live Route & Pickup Map',
      sub: 'EV Scrap Loader: MH-12-RP-3012',
      eta: 'ETA Next Stop',
      totalRoute: 'Total Route',
      stops: 'Stops',
      simulatedMapNotice: 'Live GPS Telematics Active',
      startNav: 'Start Navigation',
    },
  }[lang];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Navigation className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 text-base">{content.title}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">{content.sub}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {content.simulatedMapNotice}
        </span>
      </div>

      {/* Styled Interactive SVG Map Area */}
      <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 my-3">
        {/* Stylized Map Grid & Roads */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="mapGrid"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 36 0 L 0 0 0 36"
                fill="none"
                stroke="rgba(255, 255, 255, 0.07)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
          {/* Main Highway & River Arteries */}
          <path
            d="M -20,120 Q 150,90 280,140 T 600,100"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="8"
            opacity="0.3"
          />
          <path
            d="M 60,0 L 90,260"
            fill="none"
            stroke="#475569"
            strokeWidth="5"
            strokeDasharray="4 2"
          />
          <path
            d="M 0,180 L 450,160"
            fill="none"
            stroke="#475569"
            strokeWidth="4"
          />
          {/* Route path connecting stops */}
          <path
            d="M 70,60 L 160,95 L 270,160 L 360,90"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Current Vehicle Location Marker */}
        <div
          className="absolute z-20 flex flex-col items-center"
          style={{ left: '60px', top: '45px' }}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-500/30 animate-pulse">
            <Car className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold bg-slate-900/90 text-emerald-400 px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
            You (Aundh)
          </span>
        </div>

        {/* Pickup Pin 1: Aundh (Anand) */}
        <div
          onClick={() => {
            setActiveStop(0);
            onSelectPickup && onSelectPickup(pickups[0]);
          }}
          className={`absolute z-20 flex flex-col items-center cursor-pointer transition-transform hover:scale-110 ${
            activeStop === 0 ? 'scale-110' : ''
          }`}
          style={{ left: '150px', top: '80px' }}
        >
          <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-md ring-2 ring-white">
            1
          </div>
          <span className="text-[10px] font-medium bg-slate-900/90 text-white px-1.5 py-0.5 rounded shadow mt-1">
            Anand (0.8km)
          </span>
        </div>

        {/* Pickup Pin 2: Kothrud (Pooja) */}
        <div
          onClick={() => {
            setActiveStop(1);
            onSelectPickup && onSelectPickup(pickups[1]);
          }}
          className={`absolute z-20 flex flex-col items-center cursor-pointer transition-transform hover:scale-110 ${
            activeStop === 1 ? 'scale-110' : ''
          }`}
          style={{ left: '255px', top: '145px' }}
        >
          <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-md ring-2 ring-white">
            2
          </div>
          <span className="text-[10px] font-medium bg-slate-900/90 text-white px-1.5 py-0.5 rounded shadow mt-1">
            Pooja (1.4km)
          </span>
        </div>

        {/* Pickup Pin 3: Shivajinagar (Sameer) */}
        <div
          onClick={() => {
            setActiveStop(2);
            onSelectPickup && onSelectPickup(pickups[2]);
          }}
          className={`absolute z-20 flex flex-col items-center cursor-pointer transition-transform hover:scale-110 ${
            activeStop === 2 ? 'scale-110' : ''
          }`}
          style={{ left: '345px', top: '75px' }}
        >
          <div className="w-7 h-7 rounded-full bg-purple-500 text-white font-bold text-xs flex items-center justify-center shadow-md ring-2 ring-white">
            3
          </div>
          <span className="text-[10px] font-medium bg-slate-900/90 text-white px-1.5 py-0.5 rounded shadow mt-1">
            Dr. Patil (2.1km)
          </span>
        </div>

        {/* Floating Mini Compass & Speed */}
        <div className="absolute bottom-2 left-2 z-10 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-white text-[11px]">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono">Speed: 24 km/h · ENE</span>
        </div>
      </div>

      {/* Route Quick Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 block">
            {content.totalRoute}
          </span>
          <span className="text-base font-bold text-slate-900 font-mono">
            4.3 km
          </span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 block">{content.stops}</span>
          <span className="text-base font-bold text-slate-900 font-mono">
            3 Active
          </span>
        </div>
        <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
          <span className="text-[11px] text-emerald-800 block">{content.eta}</span>
          <span className="text-base font-bold text-emerald-800 font-mono">
            8 mins
          </span>
        </div>
      </div>

      {/* Next Stop Detail Card */}
      {pickups[activeStop] && (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                {activeStop + 1}
              </span>
              <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                {pickups[activeStop].customerName}
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-600">
                {pickups[activeStop].area}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[240px]">
              {pickups[activeStop].address}
            </p>
          </div>
          <button
            onClick={() => onSelectPickup && onSelectPickup(pickups[activeStop])}
            className="text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            Details
          </button>
        </div>
      )}

      {/* Navigation Trigger Button */}
      <button
        onClick={() => {
          const lat = pickups[activeStop]?.latitude || 18.558;
          const lng = pickups[activeStop]?.longitude || 73.807;
          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
            '_blank'
          );
        }}
        className="w-full min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <Navigation className="w-4 h-4" />
        <span>{content.startNav}</span>
      </button>
    </div>
  );
};
