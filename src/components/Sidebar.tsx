import React from 'react';
import { ChevronLeft, ChevronRight, Clock3, Leaf, MessageSquarePlus, Settings2, Store, Truck, LayoutDashboard } from 'lucide-react';
import { ChatMessage, Language, UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  lang: Language;
  messages: ChatMessage[];
  collapsed: boolean;
  mobileOpen: boolean;
  activeComponent?: string | null;
  onToggle: () => void;
  onNewChat: () => void;
  onNewRequest: () => void;
  onNavigate: (command: string) => void;
  onSelectHistory: (messageId: string) => void;
}

const copy = {
  mr: { newChat: 'नवीन चॅट', newRequest: 'नवीन विनंती', history: 'अलीकडील संभाषणे', dashboard: 'डॅशबोर्ड', pickups: 'पिकअप इतिहास', store: 'इ-स्टोअर', settings: 'सेटिंग्ज', collapse: 'साइडबार बंद करा', expand: 'साइडबार उघडा', empty: 'अलीकडील संदेश नाहीत' },
  hi: { newChat: 'नई चैट', newRequest: 'नई रिक्वेस्ट', history: 'हाल की गतिविधि', dashboard: 'डैशबोर्ड', pickups: 'पिकअप इतिहास', store: 'ई-स्टोर', settings: 'सेटिंग्स', collapse: 'साइडबार समेटें', expand: 'साइडबार खोलें', empty: 'अभी कोई गतिविधि नहीं' },
  en: { newChat: 'New chat', newRequest: 'New request', history: 'Recent activity', dashboard: 'Dashboard', pickups: 'Pickup history', store: 'E-Store', settings: 'Settings', collapse: 'Collapse sidebar', expand: 'Expand sidebar', empty: 'No recent messages' },
};

export const Sidebar: React.FC<SidebarProps> = ({ role, lang, messages, collapsed, mobileOpen, activeComponent, onToggle, onNewChat, onNewRequest, onNavigate, onSelectHistory }) => {
  const t = copy[lang];
  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, command: 'Show my full dashboard', views: ['FULL_DASHBOARD', 'VIEW_FULL_DASHBOARD'] },
    { id: 'pickups', label: t.pickups, icon: Truck, command: 'Show pickup history', views: ['PICKUP_HISTORY'] },
    { id: 'store', label: t.store, icon: Store, command: 'Open NGO Eco-Store', views: ['ECO_STORE'] },
    { id: 'settings', label: t.settings, icon: Settings2, command: 'Open settings', views: ['SETTINGS'] },
  ];
  const recentMessages = messages.filter((message) => message.sender === 'user').slice(-8).reverse();

  return (
    <aside className={`fixed inset-y-14 left-0 z-40 h-[calc(100vh-56px)] flex-col border-r border-slate-200 bg-white shadow-xl transition-[width,transform] duration-200 md:sticky md:top-14 md:z-auto md:h-[calc(100vh-56px)] md:shadow-none ${mobileOpen ? 'flex' : 'hidden'} md:flex ${collapsed ? 'md:w-[68px] w-64' : 'w-64'}`}>
      <div className={`p-3 ${collapsed ? 'px-2' : ''}`}>
        <button onClick={onNewChat} title={t.newChat} className={`w-full flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors ${collapsed ? 'justify-center px-2' : ''}`}>
          <MessageSquarePlus className="w-4 h-4 shrink-0 text-emerald-700" /> {!collapsed && t.newChat}
        </button>
        <button onClick={onNewRequest} title={t.newRequest} className={`w-full mt-2 flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors ${collapsed ? 'justify-center px-2' : ''}`}>
          <Leaf className="w-4 h-4 shrink-0" /> {!collapsed && t.newRequest}
        </button>
      </div>

      <nav className="px-2 space-y-1" aria-label="Main navigation">
        {navItems.map(({ id, label, icon: Icon, command, views }) => {
          const isActive = !!activeComponent && views.includes(activeComponent.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase());
          return <button key={id} onClick={() => onNavigate(command)} aria-current={isActive ? 'page' : undefined} title={collapsed ? label : undefined} className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-violet-100 font-semibold text-violet-800 ring-1 ring-inset ring-violet-200' : 'text-slate-600 hover:bg-violet-50 hover:text-violet-900'} ${collapsed ? 'justify-center px-2' : ''}`}>
            <Icon className="w-4 h-4 shrink-0" /> {!collapsed && <span className="truncate">{label}</span>}
          </button>;
        })}
      </nav>

      {!collapsed && <div className="mt-5 px-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400"><Clock3 className="w-3.5 h-3.5" />{t.history}</div>}
      <div className="mt-2 px-2 flex-1 overflow-y-auto">
        {recentMessages.length ? recentMessages.map((message) => (
          <button key={message.id} onClick={() => onSelectHistory(message.id)} title={collapsed ? message.text : undefined} className={`w-full rounded-lg px-2.5 py-2 text-left text-xs text-slate-600 hover:bg-slate-100 transition-colors ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> : <span className="block truncate">{message.text}</span>}
          </button>
        )) : !collapsed && <p className="px-2.5 py-2 text-xs text-slate-400">{t.empty}</p>}
      </div>
      <div className="border-t border-slate-100 p-2">
        <button onClick={onToggle} title={collapsed ? t.expand : t.collapse} aria-label={collapsed ? t.expand : t.collapse} className="w-full flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span className="ml-2 text-xs">{t.collapse}</span></>}
        </button>
      </div>
    </aside>
  );
};
