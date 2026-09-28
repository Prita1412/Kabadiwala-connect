import React from 'react';
import {
  Recycle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Building2,
  Landmark,
  Home,
  MessageSquare,
  Mic,
  Camera,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Globe,
} from 'lucide-react';
import { Language } from '../types';

interface LandingScreenProps {
  lang: Language;
  onStartLogin: () => void;
  onSelectLanguage: (lang: Language) => void;
  onDirectDemoRole?: (role: 'HOUSEHOLD' | 'KABADIWALA' | 'RECYCLER' | 'GOVERNMENT') => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  lang,
  onStartLogin,
  onSelectLanguage,
  onDirectDemoRole,
}) => {
  const content = {
    mr: {
      badge: 'संभाषण-आधारित कचरा व्यवस्थापन व चक्रीय अर्थव्यवस्था',
      headlineStart: 'कचऱ्यातून संपत्ती,',
      headlineAccent: 'संभाषणामधून व्यवहार',
      subHeadline:
        'घरगुती नागरिक, कबाडीवाला, अधिकृत रिसायकलर आणि शासकीय नियामक — सर्वांना एकाच बुद्धिमान ChatGPT-सारख्या अनुभवात जोडणारा डिजिटल प्लॅटफॉर्म.',
      getStarted: 'लॉगिन करा व सुरू करा',
      prototypeBadge: 'प्रोटोटाइप पडताळणी सिस्टीम · Dev OTP: 123456',
      howItWorksTitle: 'कसे कार्य करते? (How KabadiGpt Works)',
      howItWorksSub: 'पारंपरिक कठीण मेनू किंवा टॅब्स नाहीत — थेट बोला, टाइप करा किंवा फोटो पाठवा',
      step1Title: '१. इनपुट द्या',
      step1Desc: 'मराठी किंवा इंग्रजीत बोला, मेसेज पाठवा किंवा भंगाराचा फोटो अपलोड करा.',
      step2Title: '२. एआय समज',
      step2Desc: 'KabadiGpt तुमच्या गरजेचा अर्थ व संबंधित ऑपरेशन्स ओळखतो.',
      step3Title: '३. थेट वर्कफ्लो',
      step3Desc: 'पिकअप विनंत्या, डिजिटल काटा, बी२बी बॅचेस किंवा थेट पावती उघडते.',
      step4Title: '४. सुरक्षित व्यवहार',
      step4Desc: 'तात्काळ यूपीआय पैसे व ईपीआर ऑडिट ट्रॅकिंग पूर्ण होते.',
      rolesTitle: '४ प्रमुख भागधारक (Target User Roles)',
      rolesSub: 'प्रत्येक घटकासाठी सानुकूल ऑनबोर्डिंग व विशिष्ट वर्कफ्लो:',
      householdTitle: 'घरगुती नागरिक (Household)',
      householdDesc: 'घरातील वर्तमानपत्रे, प्लास्टिक, ई-कचरा वाजवी हमीभावात विका. थेट डोअरस्टेप पिकअप आणि तात्काळ यूपीआय.',
      householdPrompt: '"मी घरातून कबाड विकतो"',
      kabadiwalaTitle: 'कबाडीवाला (Kabadiwala / Collector)',
      kabadiwalaDesc: 'जवळचे पिकअप्स, ब्लूटूथ डिजिटल काटा, ग्राहकांना थेट एसएमएस पावती आणि रिसायकलरला थेट बल्क विक्री.',
      kabadiwalaPrompt: '"मी कबाडीवाला आहे"',
      recyclerTitle: 'अधिकृत रिसायकलर (Authorized Recycler)',
      recyclerDesc: 'प्रमाणित स्क्रॅप बॅचेसची खरेदी, स्पॉट बिडिंग आणि CPCB/MPCB ईपीआर ट्रॅसेबिलिटी मॅनिफेस्ट.',
      recyclerPrompt: '"मी recycler आहे"',
      govTitle: 'शासकीय नियामक (Government / MPCB)',
      govDesc: 'शहर-स्तरीय लँडफिल डायव्हर्जन, असंघटित कामगारांचे औपचारिकरण आणि रीसायकलिंग ऑडिट विश्लेषण.',
      govPrompt: '"मी government officer आहे"',
      featuresHeading: 'वैशिष्ट्ये',
      f1: 'मराठी व इंग्रजी व्हॉइस सपोर्ट (Web Speech API)',
      f2: 'एआय मटेरियल डिटेक्शन (फोटोवरून स्क्रॅप ओळख)',
      f3: 'स्मार्ट ब्लूटूथ वजन काटा सिम्युलेशन',
      f4: 'प्रोटोटाइप केवायसी व पारदर्शक ईपीआर लेजर',
      ctaBottomTitle: 'कचरामुक्त शहरासाठी आजच सामील व्हा',
      ctaBottomBtn: 'मोबाईल लॉगिनसह पुढे जा',
    },
    hi: {
      badge: 'संभाषण-आधारित अपशिष्ट प्रबंधन और चक्रीय अर्थव्यवस्था',
      headlineStart: 'कबाड़ से संपदा,',
      headlineAccent: 'संवाद से समाधान',
      subHeadline:
        'घरेलू नागरिक, कबाड़ीवाला, अधिकृत रीसाइक्लर और सरकारी नियामक — सभी को एक सरल ChatGPT जैसे इंटरफेस में जोड़ने वाला डिजिटल प्लेटफॉर्म।',
      getStarted: 'लॉगिन करें और शुरू करें',
      prototypeBadge: 'प्रोटोटाइप सत्यापन सिस्टम · Dev OTP: 123456',
      howItWorksTitle: 'यह कैसे काम करता है? (How it Works)',
      howItWorksSub: 'जटिल टैब नेविगेशन नहीं — बोलें, टाइप करें या फोटो खींचें',
      step1Title: '१. इनपुट दें',
      step1Desc: 'हिंदी, मराठी या अंग्रेजी में बोलें, टाइप करें या फोटो अपलोड करें।',
      step2Title: '२. एआई समझ',
      step2Desc: 'KabadiGpt आपकी मंशा और आवश्यक कार्य को तुरंत पहचानता है।',
      step3Title: '३. लाइव वर्कफ्लो',
      step3Desc: 'पिकअप लिस्ट, डिजिटल कांटा, बल्क बैच या रसीद तुरंत खुलती है।',
      step4Title: '४. सुरक्षित भुगतान',
      step4Desc: 'डोरस्टेप यूपीआई भुगतान और ईपीआर ट्रेसेबिलिटी पूरी होती है।',
      rolesTitle: '४ मुख्य उपयोगकर्ता (Target User Roles)',
      rolesSub: 'प्रत्येक भूमिका के लिए विशेष ऑनबोर्डिंग और वर्कफ्लो:',
      householdTitle: 'घरेलू नागरिक (Household)',
      householdDesc: 'घर बैठे पुराना अखबार, प्लास्टिक, धातु बेचें। डोरस्टेप पिकअप और पारदर्शी भाव।',
      householdPrompt: '"मैं घर से कबाड़ बेचता हूँ"',
      kabadiwalaTitle: 'कबाड़ीवाला (Kabadiwala / Collector)',
      kabadiwalaDesc: 'पास के पिकअप्स, ब्लूटूथ डिजिटल कांटा, डिजिटल रसीद और रीसाइक्लर को सीधी बिक्री।',
      kabadiwalaPrompt: '"मैं कबाड़ीवाला हूँ"',
      recyclerTitle: 'अधिकृत रीसाइक्लर (Authorized Recycler)',
      recyclerDesc: 'सत्यापित बल्क स्क्रैप लॉट्स, स्पॉट बिडिंग और सीपीसीबी ईपीआर ट्रेसेबिलिटी।',
      recyclerPrompt: '"मैं recycler हूँ"',
      govTitle: 'सरकारी नियामक (Government / MPCB)',
      govDesc: 'लैंडफिल डायवर्जन टेलीमैटिक्स, असंगठित कबाड़ कामगारों का औपचारिकरण रिपोर्ट।',
      govPrompt: '"मैं government officer हूँ"',
      featuresHeading: 'विशेषताएं',
      f1: 'मराठी, हिंदी और अंग्रेजी वॉइस इनपुट व आउटपुट',
      f2: 'एआई मटेरियल डिटेक्शन (फोटो से कबाड़ पहचान)',
      f3: 'स्मार्ट ब्लूटूथ वजन कांटा सिमुलेटर',
      f4: 'प्रोटोटाइप केवाईसी और पारदर्शी ईपीआर लेजर',
      ctaBottomTitle: 'स्वच्छ और आत्मनिर्भर शहर के लिए आज ही जुड़ें',
      ctaBottomBtn: 'मोबाइल लॉगिन के साथ आगे बढ़ें',
    },
    en: {
      badge: 'Conversational Waste Management & Circular Traceability',
      headlineStart: 'Zero Landfill Waste,',
      headlineAccent: 'Driven by Conversation',
      subHeadline:
        'A single ChatGPT-style interface connecting Households, Kabadiwalas, Authorized Recyclers, and Government Regulators for transparent scrap collection and verified circular custody.',
      getStarted: 'Login & Get Started',
      prototypeBadge: 'Prototype Verification · Dev OTP: 123456',
      howItWorksTitle: 'How KabadiGpt Works',
      howItWorksSub: 'No complicated tabs — User types, speaks, or uploads scrap photos',
      step1Title: '1. User Input',
      step1Desc: 'Speak, type, or upload an image in Marathi, Hindi, or English.',
      step2Title: '2. AI Intent Parser',
      step2Desc: 'KabadiGpt understands user intent and extracts logistics data.',
      step3Title: '3. Relevant Workflow Opens',
      step3Desc: 'Dynamic workspace renders digital scale, pickup maps, or EPR ledgers.',
      step4Title: '4. Action Completed',
      step4Desc: 'Instant digital weighing receipt, UPI transfer, and chain-of-custody seal.',
      rolesTitle: '4 Target User Ecosystems',
      rolesSub: 'Tailored conversational onboarding and dedicated capabilities:',
      householdTitle: 'Household Citizen',
      householdDesc: 'Sell paper, plastic, metals & old laptops at doorstep spot rates. Instant UPI payouts.',
      householdPrompt: '"I sell scrap from household"',
      kabadiwalaTitle: 'Kabadiwala (Scrap Collector)',
      kabadiwalaDesc: 'Route pickups, pair Bluetooth smart scale, print digital receipts, and bale batches.',
      kabadiwalaPrompt: '"I am a kabadiwala"',
      recyclerTitle: 'Authorized Recycler',
      recyclerDesc: 'Procure certified bales, place spot bids, and issue CPCB EPR compliance certificates.',
      recyclerPrompt: '"I am an authorized recycler"',
      govTitle: 'Government & Municipal Officer',
      govDesc: 'Monitor city-wide landfill diversion, informal collector formalization, and EPR audits.',
      govPrompt: '"I am a government officer"',
      featuresHeading: 'Core Platform Features',
      f1: 'Voice-First UI with Marathi & English Web Speech Support',
      f2: 'Computer Vision AI Scrap Material Detection',
      f3: 'IoT Digital Weighing Scale Simulation',
      f4: 'Simulated Prototype KYC for All 4 Roles',
      ctaBottomTitle: 'Join the Circular Economy Revolution',
      ctaBottomBtn: 'Proceed with Phone Login',
    },
  }[lang];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-100 flex flex-col text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Kabadi<span className="text-emerald-600">Gpt</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  AI Circular
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Conversational Waste Management & Traceability
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => onSelectLanguage('mr')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  lang === 'mr' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => onSelectLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  lang === 'hi' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => onSelectLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  lang === 'en' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Login CTA */}
            <button
              onClick={onStartLogin}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>{content.getStarted}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{content.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {content.headlineStart}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
              {content.headlineAccent}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {content.subHeadline}
          </p>

          {/* Prototype simulation label */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartLogin}
              className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{content.getStarted}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-900 text-xs font-mono font-medium border border-amber-200">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{content.prototypeBadge}</span>
            </div>
          </div>
        </section>

        {/* How It Works: The Conversational Paradigm */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {content.howItWorksTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {content.howItWorksSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{content.step1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{content.step1Desc}</p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start gap-2">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{content.step2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{content.step2Desc}</p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start gap-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{content.step3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{content.step3Desc}</p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{content.step4Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{content.step4Desc}</p>
            </div>
          </div>
        </section>

        {/* 4 Roles Section */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {content.rolesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {content.rolesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Household Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-emerald-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    HOUSEHOLD
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  {content.householdTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {content.householdDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-500 italic">
                  {content.householdPrompt}
                </span>
                <button
                  onClick={() => {
                    if (onDirectDemoRole) onDirectDemoRole('HOUSEHOLD');
                    else onStartLogin();
                  }}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>निवडा</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Kabadiwala Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-emerald-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    KABADIWALA
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  {content.kabadiwalaTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {content.kabadiwalaDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-500 italic">
                  {content.kabadiwalaPrompt}
                </span>
                <button
                  onClick={() => {
                    if (onDirectDemoRole) onDirectDemoRole('KABADIWALA');
                    else onStartLogin();
                  }}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>निवडा</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Recycler Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-emerald-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    RECYCLER
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  {content.recyclerTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {content.recyclerDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-500 italic">
                  {content.recyclerPrompt}
                </span>
                <button
                  onClick={() => {
                    if (onDirectDemoRole) onDirectDemoRole('RECYCLER');
                    else onStartLogin();
                  }}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>निवडा</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Government Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-emerald-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                    GOVERNMENT
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  {content.govTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {content.govDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-500 italic">
                  {content.govPrompt}
                </span>
                <button
                  onClick={() => {
                    if (onDirectDemoRole) onDirectDemoRole('GOVERNMENT');
                    else onStartLogin();
                  }}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>निवडा</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8">
          <div className="max-w-xl mb-6">
            <span className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
              {content.featuresHeading}
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">
              Zero-Waste Urban Circularity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <Mic className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{content.f1}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <Camera className="w-5 h-5 text-teal-400 shrink-0" />
              <span>{content.f2}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-400 shrink-0" />
              <span>{content.f3}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{content.f4}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm">{content.ctaBottomTitle}</p>
              <p className="text-xs text-slate-400">
                Pune Municipal Corporation & Maharashtra Circular Model
              </p>
            </div>
            <button
              onClick={onStartLogin}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
            >
              <span>{content.ctaBottomBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 KabadiGpt Circular Waste Platform. Prototype build for demonstration.</p>
      </footer>
    </div>
  );
};
