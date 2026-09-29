import React, { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Check, Filter, Leaf, LoaderCircle, PackagePlus, Search, ShoppingBag, Star } from 'lucide-react';
import { Language, NGOProduct, NGOProductCategory, UserRole } from '../../types';
import { createNGOProduct, subscribeNGOProducts } from '../../services/firebaseService';

const CATEGORIES: NGOProductCategory[] = ['Upcycled Goods', 'Recycled Crafts', 'Organic Compost', 'Eco Utilities'];
const LOCAL_PRODUCTS_KEY = 'kabadigpt_eco_store_products_v2';
const REWARD_KEY = 'kabadigpt_selected_eco_reward';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80';

const demoProducts: NGOProduct[] = [
  { id: 'demo-planter', title: 'Recycled PET Planter Set', description: 'Hand-finished planters made from recovered plastic bottles.', category: 'Upcycled Goods', price: 180, currency: 'INR', imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80', stock: 18, ownerId: 'demo-green-earth', ownerName: 'Green Earth NGO', ownerVerified: true, rating: 4.8, reviewCount: 126 },
  { id: 'demo-craft', title: 'Handwoven Reuse Tote', description: 'A durable everyday tote crafted from reclaimed textiles.', category: 'Recycled Crafts', price: 95, currency: 'SCRAP_TOKENS', imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', stock: 12, ownerId: 'demo-green-earth', ownerName: 'Green Earth NGO', ownerVerified: true, rating: 4.7, reviewCount: 84 },
  { id: 'demo-compost', title: 'Community Garden Compost', description: 'Nutrient-rich compost produced from local organic waste.', category: 'Organic Compost', price: 140, currency: 'INR', imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80', stock: 32, ownerId: 'demo-aunthub', ownerName: 'Aundh Reuse Hub', ownerVerified: true, rating: 4.9, reviewCount: 203 },
  { id: 'demo-bottle', title: 'Solar Bottle Garden Light', description: 'A bright, low-energy garden light made with reused glass.', category: 'Eco Utilities', price: 240, currency: 'INR', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', stock: 9, ownerId: 'demo-green-earth', ownerName: 'Green Earth NGO', ownerVerified: true, rating: 4.6, reviewCount: 51 },
];

const copy = {
  en: { title: 'NGO Eco-Store', subtitle: 'Shop thoughtfully made goods from verified community partners.', search: 'Search products, categories, NGOs…', all: 'All products', loading: 'Loading products…', offline: 'Showing the offline catalog. Live product service is unavailable.', empty: 'No products match your search.', stock: 'in stock', soldOut: 'Out of stock', listed: 'Listed by', verified: 'Verified NGO', buy: 'Buy now', redeem: 'Redeem', selected: 'Added to your rewards selection', addTitle: 'List a product', titleLabel: 'Product title', description: 'Description', category: 'Category', price: 'Price', currency: 'Price type', image: 'Image URL', stockLabel: 'Stock quantity', submit: 'Publish product', saving: 'Saving…', saved: 'Product published.', localSaved: 'Saved to this device; Firestore was unavailable.', addError: 'Could not publish product. Please check the required fields.', stars: 'reviews', local: 'Offline sample', filter: 'Categories', ownerDefault: 'Your NGO', token: 'Scrap Tokens', rupee: 'Indian Rupees' },
  mr: { title: 'NGO इको-स्टोअर', subtitle: 'पडताळलेल्या समुदाय भागीदारांकडून पर्यावरणपूरक वस्तू खरेदी करा.', search: 'उत्पादन, प्रकार किंवा NGO शोधा…', all: 'सर्व उत्पादने', loading: 'उत्पादने लोड होत आहेत…', offline: 'ऑफलाइन कॅटलॉग दाखवत आहे. लाइव्ह सेवा उपलब्ध नाही.', empty: 'शोधाशी जुळणारी उत्पादने नाहीत.', stock: 'उपलब्ध', soldOut: 'साठा संपला', listed: 'सूचीदार', verified: 'पडताळलेली NGO', buy: 'आता खरेदी करा', redeem: 'रिडीम करा', selected: 'तुमच्या रिवॉर्ड निवडीत जोडले', addTitle: 'उत्पादन सूचीबद्ध करा', titleLabel: 'उत्पादनाचे नाव', description: 'वर्णन', category: 'प्रकार', price: 'किंमत', currency: 'किंमत प्रकार', image: 'प्रतिमा URL', stockLabel: 'साठा संख्या', submit: 'उत्पादन प्रकाशित करा', saving: 'जतन होत आहे…', saved: 'उत्पादन प्रकाशित झाले.', localSaved: 'या डिव्हाइसवर जतन केले; Firestore उपलब्ध नव्हते.', addError: 'उत्पादन प्रकाशित झाले नाही. आवश्यक माहिती तपासा.', stars: 'अभिप्राय', local: 'ऑफलाइन नमुना', filter: 'प्रकार', ownerDefault: 'तुमची NGO', token: 'स्क्रॅप टोकन', rupee: 'भारतीय रुपये' },
  hi: { title: 'NGO इको-स्टोर', subtitle: 'सत्यापित समुदाय भागीदारों से पर्यावरण-अनुकूल उत्पाद खरीदें।', search: 'उत्पाद, श्रेणी या NGO खोजें…', all: 'सभी उत्पाद', loading: 'उत्पाद लोड हो रहे हैं…', offline: 'ऑफलाइन कैटलॉग दिखा रहे हैं। लाइव सेवा उपलब्ध नहीं है।', empty: 'खोज से मेल खाते उत्पाद नहीं हैं।', stock: 'उपलब्ध', soldOut: 'स्टॉक समाप्त', listed: 'सूचीदाता', verified: 'सत्यापित NGO', buy: 'अभी खरीदें', redeem: 'रिडीम करें', selected: 'आपकी रिवॉर्ड सूची में जोड़ा गया', addTitle: 'उत्पाद सूचीबद्ध करें', titleLabel: 'उत्पाद का नाम', description: 'विवरण', category: 'श्रेणी', price: 'मूल्य', currency: 'मूल्य प्रकार', image: 'इमेज URL', stockLabel: 'स्टॉक संख्या', submit: 'उत्पाद प्रकाशित करें', saving: 'सेव हो रहा है…', saved: 'उत्पाद प्रकाशित हो गया।', localSaved: 'इस डिवाइस पर सेव किया; Firestore उपलब्ध नहीं था।', addError: 'उत्पाद प्रकाशित नहीं हुआ। आवश्यक विवरण जांचें।', stars: 'समीक्षाएँ', local: 'ऑफलाइन नमूना', filter: 'श्रेणियाँ', ownerDefault: 'आपका NGO', token: 'स्क्रैप टोकन', rupee: 'भारतीय रुपये' },
};

const isProduct = (value: unknown): value is NGOProduct => {
  if (!value || typeof value !== 'object') return false;
  const product = value as Partial<NGOProduct>;
  return typeof product.id === 'string' && typeof product.title === 'string' && typeof product.description === 'string' &&
    typeof product.price === 'number' && Number.isFinite(product.price) && typeof product.stock === 'number' &&
    Number.isFinite(product.stock) && typeof product.ownerId === 'string' && typeof product.ownerName === 'string' &&
    typeof product.imageUrl === 'string' && typeof product.ownerVerified === 'boolean' &&
    typeof product.rating === 'number' && Number.isFinite(product.rating) &&
    typeof product.reviewCount === 'number' && Number.isFinite(product.reviewCount) &&
    (product.currency === 'INR' || product.currency === 'SCRAP_TOKENS') &&
    CATEGORIES.includes(product.category as NGOProductCategory);
};

const readLocalProducts = (): NGOProduct[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(isProduct) : [];
  } catch {
    return [];
  }
};

interface ProductForm {
  title: string;
  description: string;
  category: NGOProductCategory;
  price: string;
  currency: NGOProduct['currency'];
  imageUrl: string;
  stock: string;
}

export const EStoreComponent: React.FC<{ lang: Language; role: UserRole; ownerId?: string; ownerName?: string }> = ({ lang, role, ownerId, ownerName }) => {
  const t = copy[lang];
  const [products, setProducts] = useState<NGOProduct[]>(demoProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<NGOProductCategory | 'ALL'>('ALL');
  const [notice, setNotice] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>({ title: '', description: '', category: CATEGORIES[0], price: '', currency: 'INR', imageUrl: '', stock: '1' });

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    const localProducts = readLocalProducts();
    const fallbackCatalog = [...localProducts, ...demoProducts];
    setProducts(fallbackCatalog);
    try {
      const storedReward = sessionStorage.getItem(REWARD_KEY);
      if (storedReward) {
        const reward: unknown = JSON.parse(storedReward);
        if (reward && typeof reward === 'object' && 'id' in reward && typeof reward.id === 'string') setSelectedProductId(reward.id);
      }
    } catch { /* Session storage can be unavailable in restricted browser contexts. */ }

    let unsubscribe: () => void = () => {};
    try {
      unsubscribe = subscribeNGOProducts((remoteProducts) => {
        if (!active) return;
        const byId = new Map<string, NGOProduct>();
        [...fallbackCatalog, ...remoteProducts.filter(isProduct)].forEach((product) => byId.set(product.id, product));
        setProducts([...byId.values()]);
        setIsOffline(false);
        setIsLoading(false);
      }, () => {
        if (!active) return;
        setProducts(fallbackCatalog);
        setIsOffline(true);
        setIsLoading(false);
      });
    } catch {
      setProducts(fallbackCatalog);
      setIsOffline(true);
      setIsLoading(false);
    }
    return () => { active = false; unsubscribe(); };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products.filter((product) => {
      const inCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
      const matchesSearch = !normalizedSearch || `${product.title} ${product.description} ${product.category} ${product.ownerName}`.toLowerCase().includes(normalizedSearch);
      return inCategory && matchesSearch;
    });
  }, [products, search, categoryFilter]);

  const updateForm = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => setForm((current) => ({ ...current, [key]: value }));

  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (role !== 'ngo' || isSaving) return;
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.title.trim() || !form.description.trim() || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      setNotice(t.addError);
      return;
    }
    setIsSaving(true);
    setNotice('');
    const product: NGOProduct = {
      id: `local-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      price,
      currency: form.currency,
      imageUrl: form.imageUrl.trim() || FALLBACK_IMAGE,
      stock,
      ownerId: ownerId || 'local-ngo',
      ownerName: ownerName || t.ownerDefault,
      ownerVerified: true,
      rating: 0,
      reviewCount: 0,
    };
    const persisted = await createNGOProduct(product);
    const savedProduct = product;
    const nextProducts = [savedProduct, ...products.filter((item) => item.id !== savedProduct.id)];
    setProducts(nextProducts);
    try { localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(nextProducts.filter((item) => !demoProducts.some((demo) => demo.id === item.id)))); } catch { /* UI still retains this listing for the active session. */ }
    setNotice(persisted ? t.saved : t.localSaved);
    setForm({ title: '', description: '', category: CATEGORIES[0], price: '', currency: 'INR', imageUrl: '', stock: '1' });
    setIsSaving(false);
  };

  const selectProduct = (product: NGOProduct) => {
    setSelectedProductId(product.id);
    setNotice(`${product.title} — ${t.selected}`);
    try { sessionStorage.setItem(REWARD_KEY, JSON.stringify(product)); } catch { /* Selection remains available in component state. */ }
  };

  return (
    <section className="estore-panel my-2 w-full rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-6">
      <header className="mb-5 flex flex-col gap-4 border-b border-violet-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Leaf className="h-5 w-5" /></span>
          <div><h2 className="text-lg font-extrabold tracking-tight text-slate-900">{t.title}</h2><p className="mt-1 text-sm text-slate-500">{t.subtitle}</p></div>
        </div>
        <div className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.search} aria-label={t.search} className="w-full rounded-xl border border-violet-200 bg-violet-50/40 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200" /></div>
      </header>

      <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1" aria-label={t.filter}>
        <Filter className="h-4 w-4 shrink-0 text-violet-600" />
        <button onClick={() => setCategoryFilter('ALL')} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${categoryFilter === 'ALL' ? 'bg-violet-700 text-white' : 'border border-violet-100 bg-white text-slate-600 hover:bg-violet-50'}`}>{t.all}</button>
        {CATEGORIES.map((category) => <button key={category} onClick={() => setCategoryFilter(category)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${categoryFilter === category ? 'bg-violet-700 text-white' : 'border border-violet-100 bg-white text-slate-600 hover:bg-violet-50'}`}>{category}</button>)}
      </div>

      {role === 'ngo' && <form onSubmit={handleAddProduct} className="mb-6 grid gap-3 rounded-2xl border border-violet-100 bg-violet-50/50 p-4 sm:grid-cols-2">
        <h3 className="flex items-center gap-2 text-sm font-bold text-violet-950 sm:col-span-2"><PackagePlus className="h-4 w-4 text-violet-700" />{t.addTitle}</h3>
        <input required maxLength={100} value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder={t.titleLabel} className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
        <select value={form.category} onChange={(event) => updateForm('category', event.target.value as NGOProductCategory)} aria-label={t.category} className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm">{CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select>
        <textarea required maxLength={1000} rows={2} value={form.description} onChange={(event) => updateForm('description', event.target.value)} placeholder={t.description} className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300 sm:col-span-2" />
        <input required type="number" min="0" step="1" value={form.price} onChange={(event) => updateForm('price', event.target.value)} placeholder={t.price} className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
        <select value={form.currency} onChange={(event) => updateForm('currency', event.target.value as NGOProduct['currency'])} aria-label={t.currency} className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm"><option value="INR">₹ · {t.rupee}</option><option value="SCRAP_TOKENS">{t.token}</option></select>
        <input type="url" value={form.imageUrl} onChange={(event) => updateForm('imageUrl', event.target.value)} placeholder={t.image} className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
        <input required type="number" min="0" step="1" value={form.stock} onChange={(event) => updateForm('stock', event.target.value)} placeholder={t.stockLabel} aria-label={t.stockLabel} className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
        <button type="submit" disabled={isSaving} className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-800 disabled:cursor-wait disabled:opacity-60 sm:col-span-2">{isSaving ? <><LoaderCircle className="h-4 w-4 animate-spin" />{t.saving}</> : t.submit}</button>
      </form>}

      <div className="mb-3 flex items-center justify-between"><p className="text-xs font-semibold text-slate-500">{isLoading ? <span className="inline-flex items-center gap-2"><LoaderCircle className="h-3.5 w-3.5 animate-spin" />{t.loading}</span> : `${filteredProducts.length} products`}</p>{isOffline && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800">{t.local}</span>}</div>
      {isOffline && <p role="status" className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">{t.offline}</p>}
      {notice && <p role="status" className="mb-3 rounded-lg bg-violet-50 px-3 py-2 text-xs font-medium text-violet-800">{notice}</p>}

      {filteredProducts.length === 0 ? <div className="rounded-xl border border-dashed border-violet-200 py-10 text-center text-sm text-slate-500">{t.empty}</div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} lang={lang} selected={selectedProductId === product.id} onSelect={() => selectProduct(product)} />)}
      </div>}
    </section>
  );
};

const ProductCard: React.FC<{ product: NGOProduct; lang: Language; selected: boolean; onSelect: () => void }> = ({ product, lang, selected, onSelect }) => {
  const t = copy[lang];
  const [imageFailed, setImageFailed] = useState(false);
  const price = product.currency === 'SCRAP_TOKENS' ? `${product.price} ${t.token}` : `₹${product.price.toLocaleString('en-IN')}`;
  return (
    <article className="group overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100/70">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-violet-100 to-fuchsia-50">
        {!imageFailed ? <img src={product.imageUrl || FALLBACK_IMAGE} alt={product.title} loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center text-violet-400"><ShoppingBag className="h-12 w-12" /></div>}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-violet-800 shadow-sm backdrop-blur">{product.category}</span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 text-sm font-bold text-slate-900" title={product.title}>{product.title}</h3>
        <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-relaxed text-slate-500">{product.description}</p>
        <div className="mt-2 flex items-center gap-1 text-xs text-amber-600"><Star className="h-3.5 w-3.5 fill-current" /><span className="font-bold text-slate-700">{Number.isFinite(product.rating) ? product.rating.toFixed(1) : 'New'}</span><span className="text-slate-400">({product.reviewCount || 0} {t.stars})</span></div>
        <p className="mt-3 text-lg font-extrabold tracking-tight text-violet-800">{price}</p>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500"><span>{t.listed} {product.ownerName || t.ownerDefault}</span>{product.ownerVerified && <span title={t.verified} aria-label={t.verified} className="inline-flex text-violet-600"><BadgeCheck className="h-4 w-4" /></span>}</div>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-violet-50 pt-3"><span className={`text-[10px] font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>{product.stock > 0 ? `${product.stock} ${t.stock}` : t.soldOut}</span><button type="button" disabled={product.stock <= 0} onClick={onSelect} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${selected ? 'bg-violet-100 text-violet-800' : 'bg-violet-700 text-white hover:bg-violet-800'}`}>{selected && <Check className="h-3.5 w-3.5" />}{selected ? t.selected : product.currency === 'SCRAP_TOKENS' ? t.redeem : t.buy}</button></div>
      </div>
    </article>
  );
};
