import { ActiveComponentType, Language, UserRole } from '../types';
import { MOCK_PICKUPS, MOCK_BATCHES } from '../data/mockData';

export interface ParsedIntentResult {
  replyText: string;
  workflow?: {
    type: ActiveComponentType;
    data?: any;
  };
}

export function parseUserIntent(
  input: string,
  role: UserRole,
  lang: Language,
  isImageUpload?: boolean,
  imageSrc?: string
): ParsedIntentResult {
  const text = (input || '').toLowerCase().trim();

  // If user uploaded an image -> Material Detection workflow
  if (isImageUpload) {
    if (lang === 'mr') {
      return {
        replyText: 'मी तुमच्या भंगार साहित्याचा फोटो स्कॅन केला आहे. एआयने साहित्य, शुद्धता ग्रेड आणि बाजारभाव तपासला आहे:',
        workflow: {
          type: 'MATERIAL_DETECTION',
          data: { imageSrc, fileName: 'Scrap_Item_Scan.jpg' },
        },
      };
    } else if (lang === 'hi') {
      return {
        replyText: 'मैंने आपके कबाड़ सामान की तस्वीर स्कैन कर ली है। एआई ने सामग्री का प्रकार, शुद्धता ग्रेड और अनुमानित दर निकाल ली है:',
        workflow: {
          type: 'MATERIAL_DETECTION',
          data: { imageSrc, fileName: 'Scrap_Item_Scan.jpg' },
        },
      };
    } else {
      return {
        replyText: 'I scanned your scrap image with AI Computer Vision. Material purity grade and fair market rates have been calculated:',
        workflow: {
          type: 'MATERIAL_DETECTION',
          data: { imageSrc, fileName: 'Scrap_Item_Scan.jpg' },
        },
      };
    }
  }

  // 1. Request Count / "आज किती pickup requests आहेत?"
  if (
    text.includes('किती pickup') ||
    text.includes('kitne pickup') ||
    text.includes('how many pickup') ||
    text.includes('pending pickup') ||
    text.includes('request count') ||
    text.includes('pickup requests आहेत') ||
    text.includes('आजचे पिकअप')
  ) {
    const pendingCount = MOCK_PICKUPS.filter((p) => p.status === 'pending').length;
    const replies: Record<Language, string> = {
      mr: `आज तुमच्या भागात एकूण ${pendingCount} प्रलंबित पिकअप विनंत्या आहेत. ३ तातडीच्या आहेत. खाली त्वरित सारांश पहा:`,
      hi: `आज आपके क्षेत्र में कुल ${pendingCount} पेंडिंग पिकअप अनुरोध हैं। नीचे विवरण देखें:`,
      en: `You have ${pendingCount} pending pickup requests in your territory today (3 high-priority). Here is your summary card:`,
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'REQUEST_COUNT', data: { total: pendingCount } },
    };
  }

  // 2. Request List / "माझ्या जवळचे pickups दाखव"
  if (
    text.includes('जवळचे') ||
    text.includes('near me') ||
    text.includes('nearby') ||
    text.includes('पास के') ||
    text.includes('request list') ||
    text.includes('दाखव pickups') ||
    text.includes('पिकअप लिस्ट')
  ) {
    const replies: Record<Language, string> = {
      mr: 'तुमच्या सध्याच्या स्थानावरून (Aundh, Pune) जवळचे उपलब्ध पिकअप खालीलप्रमाणे आहेत:',
      hi: 'आपके वर्तमान स्थान से सबसे नजदीकी पिकअप सूची नीचे दी गई है:',
      en: 'Here are the live verified pickups closest to your current location in Pune:',
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'REQUEST_LIST', data: { pickups: MOCK_PICKUPS } },
    };
  }

  // 3. Pickup Details / Specific customer / "REQ-101" / "Anand"
  if (
    text.includes('anand') ||
    text.includes('req-101') ||
    text.includes('pickup details') ||
    text.includes('ग्राहक माहिती') ||
    text.includes('details')
  ) {
    const target = MOCK_PICKUPS[0];
    const replies: Record<Language, string> = {
      mr: `आनंद देशमुख (REQ-101) यांच्या पिकअपचे तपशील खालीलप्रमाणे आहेत. तुम्ही थेट कॉल करू शकता किंवा डिजिटल वजन सुरू करू शकता:`,
      hi: `आनंद देशमुख (REQ-101) के पिकअप विवरण नीचे दिए गए हैं:`,
      en: `Here are the verified pickup details for Anand Deshmukh (REQ-101) in Aundh, Pune:`,
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'PICKUP_DETAILS', data: { pickup: target } },
    };
  }

  // 4. Pickup Map / Route / "माझा pickup कुठे आहे?" / "नकाशा" / "route"
  if (
    text.includes('नकाशा') ||
    text.includes('map') ||
    text.includes('कुठे आहे') ||
    text.includes('kahan hai') ||
    text.includes('where is') ||
    text.includes('track') ||
    text.includes('route') ||
    text.includes('दिशा')
  ) {
    const replies: Record<Language, string> = {
      mr: 'तुमच्या आजच्या पिकअप मार्गाचा थेट जीपीएस नकाशा खाली दिला आहे. एकूण अंतर ४.२ किमी आहे:',
      hi: 'आपके आज के पिकअप रूट का लाइव मैप नीचे दिया गया है:',
      en: 'Here is your optimized live pickup route map with turn-by-turn navigation waypoints:',
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'PICKUP_MAP', data: { pickups: MOCK_PICKUPS } },
    };
  }

  // 5. Earnings / "माझी आजची कमाई किती?"
  if (
    text.includes('कमाई') ||
    text.includes('earning') ||
    text.includes('income') ||
    text.includes('revenue') ||
    text.includes('पैसे') ||
    text.includes('नफा')
  ) {
    const replies: Record<Language, string> = {
      mr: 'आजची तुमची एकूण कमाई आणि संकलित साहित्याचे विभाजन खाली दिले आहे. तुम्ही लगेच बँक खात्यात ट्रान्सफर करू शकता:',
      hi: 'आज की आपकी कुल कमाई और सामग्री का हिसाब नीचे दिया गया है:',
      en: 'Here is your daily earnings statement, gross volumes collected, and instant UPI settlement card:',
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'EARNINGS', data: {} },
    };
  }

  // 6. Full Dashboard / "माझा पूर्ण dashboard दाखव"
  if (
    text.includes('dashboard') ||
    text.includes('डॅशबोर्ड') ||
    text.includes('overview') ||
    text.includes('पूर्ण माहिती') ||
    text.includes('full status')
  ) {
    const replies: Record<Language, string> = {
      mr: 'तुमचा आजचा संपूर्ण ऑपरेशन्स डॅशबोर्ड, ईको-इम्पॅक्ट आणि वजन विश्लेषण खाली दिले आहे:',
      hi: 'आपका संपूर्ण ऑपरेशन्स डैशबोर्ड और इको-इम्पैक्ट विवरण नीचे है:',
      en: 'Here is your full operational command dashboard with material categories and carbon savings metrics:',
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'FULL_DASHBOARD', data: {} },
    };
  }

  // 7. Sell Scrap / "मला कबाड विकायचं आहे" / "माझ्याकडे जुना laptop आहे" / "मला pickup book करायचा आहे"
  if (
    text.includes('विकायचं') ||
    text.includes('sell') ||
    text.includes('bechna') ||
    text.includes('laptop') ||
    text.includes('लॅपटॉप') ||
    text.includes('pickup book') ||
    text.includes('कबाड') ||
    text.includes('भंगार') ||
    text.includes('raddi') ||
    text.includes('रद्दी') ||
    text.includes('ई-कचरा') ||
    text.includes('scrap')
  ) {
    const isLaptop = text.includes('laptop') || text.includes('लॅपटॉप') || text.includes('computer');
    const replies: Record<Language, string> = {
      mr: isLaptop
        ? 'नक्कीच! जुन्या लॅपटॉप/ई-कचऱ्यासाठी ₹२८० ते ₹१,२०० प्रति नग दर मिळतो. पिकअप बुक करण्यासाठी खालील फॉर्म पूर्ण करा:'
        : 'छान! घरबसल्या कबाड विकण्यासाठी साहित्याची निवड करा आणि सोयीस्कर वेळ निवडा. त्वरित मोफत पिकअप मिळेल:',
      hi: isLaptop
        ? 'जी हाँ! पुराने लैपटॉप/कंप्यूटर के लिए आपको उचित मूल्य मिलेगा। पिकअप बुक करने के लिए नीचे जानकारी भरें:'
        : 'घर बैठे कबाड़ बेचने के लिए स्क्रैप चुनें और समय तय करें। सत्यापित कबाड़ीवाला आपके घर आएगा:',
      en: isLaptop
        ? 'Great! Old laptops and computer PCBs fetch between ₹280/kg to ₹1,200/unit. Complete the quick booking below:'
        : 'Sell your household scrap at verified fair rates with doorstep pickup! Select items and schedule below:',
    };
    return {
      replyText: replies[lang],
      workflow: {
        type: 'SELL_SCRAP',
        data: { initialCategory: isLaptop ? 'ewaste' : 'all' },
      },
    };
  }

  // 8. Digital Weighing / "कचरा वजन करा" / "scale" / "weigh"
  if (
    text.includes('वजन') ||
    text.includes('weigh') ||
    text.includes('scale') ||
    text.includes('काटा') ||
    text.includes('tol')
  ) {
    const replies: Record<Language, string> = {
      mr: 'स्मार्ट ब्लूटूथ वजन काटा कनेक्ट केला आहे. पारदर्शक वजनासाठी साहित्य निवडा व वजन लॉक करा:',
      hi: 'स्मार्ट डिजिटल वजन पैमाना कनेक्टेड है। सटीक और पारदर्शी तौल के लिए वजन लॉक करें:',
      en: 'Smart IoT Bluetooth Digital Scale connected. Real-time tare & net weight capture active:',
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'DIGITAL_WEIGHING', data: {} },
    };
  }

  // 9. Digital Receipt / "पावती दाखवा" / "receipt"
  if (
    text.includes('पावती') ||
    text.includes('receipt') ||
    text.includes('बिल') ||
    text.includes('bill') ||
    text.includes('रसीद')
  ) {
    const replies: Record<Language, string> = {
      mr: 'सत्यापित डिजिटल ग्रीन पावती तयार झाली आहे. यामध्ये क्यूआर कोड, वजनाची नोंद आणि तात्काळ यूपीआय पेमेंट समाविष्ट आहे:',
      hi: 'डिजिटल ग्रीन रसीद तैयार है। इसमें क्यूआर कोड और तुरंत यूपीआई भुगतान का विकल्प है:',
      en: 'Here is the verified tamper-proof Digital Green Receipt with automated UPI payout and carbon offset score:',
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'DIGITAL_RECEIPT', data: {} },
    };
  }

  // 10. Batch Creation / "नवीन bulk scrap batches दाखवा" / "create batch" / "bale"
  if (
    text.includes('batch') ||
    text.includes('बॅच') ||
    text.includes('bulk') ||
    text.includes('bale') ||
    text.includes('बेलिंग') ||
    text.includes('लॉट')
  ) {
    const replies: Record<Language, string> = {
      mr: 'कबाडीवाला मायक्रो-हब मधून गोळा केलेल्या स्क्रॅपचे प्रमाणित बेल किंवा बल्क लॉट तयार करा:',
      hi: 'कलेक्ट किए गए कबाड़ का प्रमाणित बल्क बैच या बेल तैयार करें:',
      en: 'Create a standardized, certified scrap lot/bale with QR seal ready for factory dispatch:',
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'BATCH_CREATION', data: {} },
    };
  }

  // 11. Batch Details / "batch 801" / "lot details"
  if (
    text.includes('batch details') ||
    text.includes('801') ||
    text.includes('802') ||
    text.includes('तपशील बॅच')
  ) {
    const replies: Record<Language, string> = {
      mr: 'बॅच PUN-BAL-801 चे गुणवत्ता प्रमाणपत्र, आर्द्रता पातळी (1.8%) आणि ट्रॅकिंग तपशील खालीलप्रमाणे आहेत:',
      hi: 'बैच PUN-BAL-801 के लैब टेस्ट परिणाम और डिजिटल सील विवरण नीचे हैं:',
      en: 'Batch PUN-BAL-801 specification sheet, moisture level (1.8%), and tamper seal manifest:',
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'BATCH_DETAILS', data: { batch: MOCK_BATCHES[0] } },
    };
  }

  // 12. Recycler Matching / "Verified recycler matching" / "find recycler"
  if (
    text.includes('recycler') ||
    text.includes('रिसायकल') ||
    text.includes('matching') ||
    text.includes('फॅक्टरी') ||
    text.includes('खरेदीदार') ||
    text.includes('buyer')
  ) {
    const replies: Record<Language, string> = {
      mr: 'तुमच्या स्क्रॅप बॅचसाठी मान्यताप्राप्त ईपीआर-सर्टिफाइड रिसायकलर्सचे सर्वोत्तम थेट खरेदी दर खालीलप्रमाणे आहेत:',
      hi: 'आपके स्क्रैप बैच के लिए अधिकृत रिसाइकलर्स के उच्चतम बोली दर नीचे प्रस्तुत हैं:',
      en: 'Smart B2B matchmaking: Verified authorized recyclers offering the highest spot prices for your lot:',
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'RECYCLER_MATCHING', data: {} },
    };
  }

  // 13. Traceability Timeline / "Traceability manifest तपासणी" / "lifecycle"
  if (
    text.includes('traceability') ||
    text.includes('ट्रॅकिंग') ||
    text.includes('manifest') ||
    text.includes('कसोटी') ||
    text.includes('प्रवास') ||
    text.includes('chain of custody') ||
    text.includes('lifecycle')
  ) {
    const replies: Record<Language, string> = {
      mr: 'घरापासून रिसायकलिंग फॅक्टरीपर्यंतच्या संपूर्ण चक्रीय प्रवासाची डिजिटल टाइमलाइन खाली दिली आहे:',
      hi: 'कबाड़ संग्रह से लेकर अंतिम रिसाइकिलिंग तक की संपूर्ण डिजिटल ट्रेसिबिलिटी टाइमलाइन नीचे है:',
      en: 'End-to-End Circular Traceability: Verifiable chain-of-custody from citizen doorstep to recycled resin:',
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'TRACEABILITY', data: {} },
    };
  }

  // 14. Regulatory Analytics / "EPR compliance" / "MPCB" / "regulator"
  if (
    text.includes('epr') ||
    text.includes('regulator') ||
    text.includes('mpcb') ||
    text.includes('cpcb') ||
    text.includes('compliance') ||
    text.includes('शासकीय') ||
    text.includes('सरकारी') ||
    text.includes('analytics')
  ) {
    const replies: Record<Language, string> = {
      mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB) व मनपा वेस्ट डायव्हर्जन व ईपीआर अनुपालन विश्लेषण अहवाल:',
      hi: 'प्रदूषण नियंत्रण बोर्ड (CPCB/MPCB) ईपीआर अनुपालन और शहर-स्तरीय वेस्ट डायवर्जन रिपोर्ट:',
      en: 'Regulatory & EPR Compliance Portal: Municipal waste diversion metrics, ward audits, and credits ledger:',
    };
    return {
      replyText: replies[lang],
      workflow: { type: 'REGULATORY_ANALYTICS', data: {} },
    };
  }

  // Default fallback conversational reply based on role & language
  const defaultReplies: Record<UserRole, Record<Language, string>> = {
    household: {
      mr: 'मी KabadiGpt आहे! तुम्ही घरातून रद्दी, प्लास्टिक, लोखंड, तांबे किंवा जुने इलेक्ट्रॉनिक्स सहज विकू शकता. तुम्हाला काय विकायचे आहे?',
      hi: 'मैं KabadiGpt हूँ! आप अखबार, प्लास्टिक, लोहा या पुराना इलेक्ट्रॉनिक सामान उचित दाम पर बेच सकते हैं। आप क्या बेचना चाहते हैं?',
      en: 'Hello! I am KabadiGpt. You can sell newspaper, cardboard, plastics, metals, or old electronics for instant cash with verified doorstep pickup.',
    },
    kabadiwala: {
      mr: 'नमस्कार काका! आजचे पिकअप्स, जवळचे मार्ग, डिजिटल वजन किंवा तुमची आजची कमाई पाहण्यासाठी खालीलपैकी एका पर्यायावर टॅप करा:',
      hi: 'नमस्ते! आज के नए पिकअप ऑर्डर्स, डिजिटल कांटा या कमाई देखने के लिए नीचे दिए गए बटन पर टैप करें:',
      en: 'Welcome! Check today’s pickup requests, optimize your route, use the digital scale, or review today’s total earnings.',
    },
    recycler: {
      mr: 'स्वागत आहे! प्रमाणित स्क्रॅप बॅचेस, थेट लॉट खरेदी, आणि रिसायकलिंग मॅन्युफॅक्चरिंग क्रेडिट्स व्यवस्थापित करा:',
      hi: 'स्वागत है! प्रमाणित स्क्रैप बैचेस की खरीद और ईपीआर सर्टिफिकेट्स की ट्रैकिंग यहाँ करें:',
      en: 'Welcome Authorized Recycler. Review certified scrap batches, place bids, and verify traceability manifests.',
    },
    regulator: {
      mr: 'नमस्कार! मनपा व एमपीसीबी ईपीआर अनुपालन, कचरा डायव्हर्जन डेटा आणि रीअल-टाइम ट्रेसिबिलिटी अहवाल उपलब्ध आहे:',
      hi: 'नमस्कार! शहर-स्तरीय लैंडफिल डायवर्जन, वार्ड विश्लेषण और ईपीआर कम्प्लायंस डैशबोर्ड देखें:',
      en: 'Regulatory Overview: Monitor city-wide landfill diversion, informal worker formalization, and EPR credit audits.',
    },
  };

  return {
    replyText: defaultReplies[role][lang],
    workflow: role === 'household' ? { type: 'SELL_SCRAP' } : { type: 'REQUEST_COUNT' },
  };
}
