import React, { useEffect, useState } from 'react';
import { Clock3, MapPin, PackageCheck } from 'lucide-react';
import { Language, PickupRequest, UserRole } from '../../types';
import { MOCK_PICKUPS } from '../../data/mockData';
import { getPickupRequests } from '../../services/firebaseService';

const copy = {
  mr: { title: 'पिकअप इतिहास', subtitle: 'तुमच्या अलीकडील पिकअप विनंत्या आणि त्यांची स्थिती.', empty: 'अजून पिकअप विनंत्या नाहीत.', status: 'स्थिती', weight: 'अंदाजे वजन' },
  hi: { title: 'पिकअप इतिहास', subtitle: 'आपके हाल के पिकअप अनुरोध और उनकी स्थिति।', empty: 'अभी कोई पिकअप अनुरोध नहीं है।', status: 'स्थिति', weight: 'अनुमानित वजन' },
  en: { title: 'Pickup history', subtitle: 'Recent pickup requests and their latest status.', empty: 'No pickup requests yet.', status: 'Status', weight: 'Estimated weight' },
};

export const PickupHistory: React.FC<{ lang: Language; role: UserRole; userId?: string }> = ({ lang, role, userId }) => {
  const t = copy[lang];
  const [requests, setRequests] = useState<PickupRequest[]>(MOCK_PICKUPS);
  useEffect(() => {
    let active = true;
    const filters = role === 'household' && userId ? { householdId: userId } : role === 'kabadiwala' && userId ? { assignedKabadiwalaId: userId } : undefined;
    getPickupRequests(filters).then((result) => { if (active && (result.length || filters)) setRequests(result); });
    return () => { active = false; };
  }, [role, userId]);
  return (
    <section className="my-2 max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <header className="mb-4 flex items-start gap-3 border-b border-slate-100 pb-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Clock3 className="h-4 w-4" /></span>
        <div><h3 className="font-extrabold text-slate-900">{t.title}</h3><p className="mt-1 text-xs text-slate-500">{t.subtitle}</p></div>
      </header>
      {requests.length === 0 ? <p className="text-sm text-slate-500">{t.empty}</p> : <div className="space-y-2">
        {requests.map((request) => <article key={request.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="flex items-start justify-between gap-3"><div><h4 className="text-sm font-bold text-slate-900">{request.id} · {request.customerName || 'Pickup request'}</h4><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{request.area || request.address}</p></div><span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase text-emerald-800"><PackageCheck className="mr-1 inline h-3 w-3" />{request.status}</span></div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-500"><span>{t.weight}: {request.estimatedWeightKg || '—'} kg</span><span>{request.scheduledTime || request.preferredPickupTime || ''}</span></div>
        </article>)}
      </div>}
    </section>
  );
};
