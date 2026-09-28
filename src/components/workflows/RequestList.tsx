import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Eye,
  Package,
  Navigation,
  ChevronRight,
  RefreshCw,
  Database,
} from 'lucide-react';
import { Language, PickupRequest } from '../../types';
import { getPickupRequests, acceptPickup } from '../../services/firebaseService';

interface RequestListProps {
  lang: Language;
  onSelectPickup?: (pickup: PickupRequest) => void;
  onOpenMap?: () => void;
  onStartWeighing?: (pickup: PickupRequest) => void;
}

export const RequestList: React.FC<RequestListProps> = ({
  lang,
  onSelectPickup,
  onOpenMap,
  onStartWeighing,
}) => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [acceptedIds, setAcceptedIds] = useState<Record<string, boolean>>({
    'REQ-104': true,
  });

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getPickupRequests();
      setPickups(data);
    } catch (e) {
      console.warn('Error fetching requests from Firebase:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const content = {
    mr: {
      title: 'स्थानिक पिकअप यादी (Firestore Data)',
      sub: 'जवळच्या अंतराप्रमाणे थेट क्लाउड डेटाबेसवरून',
      distance: 'किमी',
      accept: 'स्वीकारा',
      accepted: 'स्वीकारले',
      details: 'तपशील',
      call: 'कॉल करा',
      weigh: 'वजन करा',
      routeMap: 'संपूर्ण मार्ग पहा',
      refresh: 'रिफ्रेश करा',
    },
    hi: {
      title: 'स्थानीय पिकअप सूची (Firestore Data)',
      sub: 'दूरी के अनुसार लाइव क्लाउड डेटाबेस से',
      distance: 'किमी',
      accept: 'स्वीकारें',
      accepted: 'स्वीकृत',
      details: 'विवरण',
      call: 'कॉल करें',
      weigh: 'तौलें',
      routeMap: 'रूट मैप देखें',
      refresh: 'रिफ्रेश करें',
    },
    en: {
      title: 'Local Pickup Requests (Firestore Data)',
      sub: 'Live requests queried from Cloud Firestore',
      distance: 'km away',
      accept: 'Accept',
      accepted: 'Accepted',
      details: 'Details',
      call: 'Call',
      weigh: 'Weigh',
      routeMap: 'View Route Map',
      refresh: 'Refresh',
    },
  }[lang];

  const handleAccept = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAcceptedIds((prev) => ({ ...prev, [id]: true }));
    try {
      await acceptPickup(id, 'COL-001', 'Ramesh Shinde');
    } catch (err) {
      console.warn('Error accepting pickup in Firebase:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              {content.title}
            </h3>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>LIVE</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{content.sub}</p>
        </div>
        <button
          onClick={loadRequests}
          disabled={loading}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Refresh from Firebase"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && pickups.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
          <span className="text-xs">Firestore requests loading...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {pickups.map((pickup) => {
            const isAccepted = acceptedIds[pickup.id] || pickup.status === 'accepted';

            return (
              <div
                key={pickup.id}
                onClick={() => onSelectPickup && onSelectPickup(pickup)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isAccepted
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {pickup.customerName}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                        {pickup.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[200px] sm:max-w-xs">{pickup.address}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Navigation className="w-3 h-3" />
                      {pickup.distance || '0.8'} {content.distance}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{pickup.slot}</span>
                    </div>
                  </div>
                </div>

                {/* Materials & Estimated Weight */}
                <div className="flex flex-wrap items-center gap-1.5 py-1.5 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">साहित्य:</span>
                  {(pickup.materials || ['Newspaper', 'Cardboard', 'Plastics']).map((mat, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {mat}
                    </span>
                  ))}
                  <span className="ml-auto text-xs font-extrabold text-slate-900">
                    ~{pickup.estimatedWeight} (₹{pickup.estimatedPayout})
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
                  <a
                    href={`tel:${pickup.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium py-1 px-2 rounded-lg hover:bg-slate-100"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{content.call}</span>
                  </a>

                  <div className="flex items-center gap-2">
                    {isAccepted ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onStartWeighing) onStartWeighing(pickup);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>{content.weigh}</span>
                        </button>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-100 px-2 py-1 rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{content.accepted}</span>
                        </span>
                      </>
                    ) : (
                      <button
                        onClick={(e) => handleAccept(pickup.id, e)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                      >
                        {content.accept}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {onOpenMap && (
        <button
          onClick={onOpenMap}
          className="mt-4 w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-emerald-700" />
          <span>{content.routeMap}</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      )}
    </div>
  );
};
