import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Upload,
  User,
  Building,
  Landmark,
  ArrowRight,
  Info,
  Sparkles,
  Truck,
  Home,
  Check,
  QrCode,
  FileText,
  BadgeCheck,
  Scale,
} from 'lucide-react';
import { SupportedRole, KycStatus, Language } from '../types';
import confetti from 'canvas-confetti';

interface RoleOnboardingWorkflowProps {
  role: SupportedRole;
  lang: Language;
  onComplete: (kycStatus: KycStatus, kycDetails: Record<string, any>) => void;
}

export const RoleOnboardingWorkflow: React.FC<RoleOnboardingWorkflowProps> = ({
  role,
  lang,
  onComplete,
}) => {
  // Common KYC form states
  const [kycStatus, setKycStatus] = useState<KycStatus>('PENDING');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [selectedProofSim, setSelectedProofSim] = useState<string>('aadhaar_sim_front.jpg');

  // Household fields
  const [householdName, setHouseholdName] = useState('Anand Deshmukh');
  const [householdAddress, setHouseholdAddress] = useState('B-402, Rohan Nilay, Aundh, Pune - 411007');
  const [householdDocType, setHouseholdDocType] = useState('Electricity Bill / Address Proof');
  const [upiId, setUpiId] = useState('anand.deshmukh@okhdfcbank');
  const [scrapTypes, setScrapTypes] = useState<string[]>(['Newspaper / Paper', 'Plastic Bottles', 'Old Electronics']);

  // Kabadiwala fields
  const [collectorName, setCollectorName] = useState('Ramesh Shinde');
  const [collectionWard, setCollectionWard] = useState('Aundh Ward #4, Pune Municipal Corporation');
  const [vehicleNumber, setVehicleNumber] = useState('MH-12-RP-3012 (EV Cargo Loader)');
  const [hubAssociation, setHubAssociation] = useState('Aundh Circular Micro-Hub #4');
  const [smartScaleId, setSmartScaleId] = useState('TaraScale-BT-402');
  const [dailyCapacity, setDailyCapacity] = useState('350 kg/day');

  // Recycler fields
  const [facilityName, setFacilityName] = useState('EcoPlast Polymers Ltd');
  const [ctoLicenseNumber, setCtoLicenseNumber] = useState('MPCB-CTO-PUN-2024-9041');
  const [capacityTons, setCapacityTons] = useState('500 Metric Tonnes / Month');
  const [gstNumber, setGstNumber] = useState('27AAACE1234F1Z5');
  const [recyclerTypes, setRecyclerTypes] = useState<string[]>(['PET Bottles (Food-grade Flakes)', 'HDPE / PP Polymers']);

  // Government fields
  const [officerName, setOfficerName] = useState('Dr. Sanjay Kulkarni');
  const [department, setDepartment] = useState('Maharashtra Pollution Control Board (MPCB) / PMC');
  const [designation, setDesignation] = useState('Deputy Environmental Engineer - Solid Waste Management Cell');
  const [employeeGovId, setEmployeeGovId] = useState('GOV-MH-ENV-8841');
  const [jurisdiction, setJurisdiction] = useState('Pune City & Pimpri Chinchwad Zone');

  const content = {
    mr: {
      tag: 'प्रोटोटाइप पडताळणी · Prototype Verification',
      notice:
        '⚠️ प्रोटोटाइप पडताळणी: हे केवळ प्रात्यक्षिक (Prototype) स्क्रीन आहे. येथे कोणताही प्रत्यक्ष आधार, पॅन किंवा शासकीय CPCB/MPCB डेटा तपासला जात नाही.',
      householdTitle: 'घरगुती नागरिक केवायसी नोंदणी (Household Onboarding)',
      householdSub: 'कबाड पिकअप व तात्काळ यूपीआय पेमेंटसाठी प्राथमिक माहिती नोंदवा',
      kabadiwalaTitle: 'कबाडीवाला व्यावसायिक नोंदणी व केवायसी (Kabadiwala Onboarding)',
      kabadiwalaSub: 'अधिकृत संकलक बॅज, ब्लूटूथ डिजिटल काटा व थेट रिसायकलर खरेदीसाठी नोंदणी',
      recyclerTitle: 'अधिकृत रिसायकलिंग फॅक्टरी ईपीआर पडताळणी (Recycler Onboarding)',
      recyclerSub: 'सीटीओ परवाना, जीएसटी व ईपीआर क्रेडिट्स जारी करण्यासाठी पडताळणी',
      govTitle: 'शासकीय व मनपा अधिकारी ओळख प्रमाणीकरण (Government Onboarding)',
      govSub: 'शहर-स्तरीय कचरा डायव्हर्जन डेटा व ऑडिट अहवाल तपासणीसाठी अधिकृत प्रवेश',
      submitBtn: 'प्रोटोटाइप केवायसी पूर्ण करा',
      verifying: 'डेटा तपासला जात आहे...',
      statusLabel: 'केवायसी स्थिती (KYC Status):',
      statusChangeHint: 'चाचणीसाठी केवायसी स्थिती बदला (Test KYC Statuses):',
      verifiedSuccess: 'पडताळणी यशस्वी! KabadiGpt मुख्य सहाय्यक उघडत आहे...',
      uploadNotice: 'प्रोटोटाइप ओळखपत्र सिमुलेशन जोडले आहे.',
    },
    hi: {
      tag: 'प्रोटोटाइप सत्यापन · Prototype Verification',
      notice:
        '⚠️ प्रोटोटाइप सत्यापन: यह केवल एक प्रोटोटाइप सिमुलेशन स्क्रीन है। कोई वास्तविक आधार, पैन या सीपीसीबी सरकारी डेटाबेस उपयोग नहीं किया जा रहा है।',
      householdTitle: 'घरेलू नागरिक केवाईसी पंजीकरण (Household Onboarding)',
      householdSub: 'डोरस्टेप कबाड़ पिकअप व तुरंत यूपीआई भुगतान हेतु विवरण दर्ज करें',
      kabadiwalaTitle: 'कबाड़ीवाला व्यावसायिक पंजीकरण व सत्यापन (Kabadiwala Onboarding)',
      kabadiwalaSub: 'अधिकृत कलेक्टर बैज, डिजिटल कांटा व सीधी रीसाइक्लर खरीद हेतु',
      recyclerTitle: 'अधिकृत रीसाइक्लिंग फैक्ट्री ईपीआर सत्यापन (Recycler Onboarding)',
      recyclerSub: 'सीटीओ लाइसेंस, जीएसटी व ईपीआर क्रेडिट्स हेतु',
      govTitle: 'सरकारी व नगर निगम अधिकारी प्रमाणीकरण (Government Onboarding)',
      govSub: 'शहर-स्तरीय कचरा डायवर्जन व ऑडिट रिपोर्ट्स एक्सेस हेतु',
      submitBtn: 'प्रोटोटाइप केवाईसी पूर्ण करें',
      verifying: 'डेटा सत्यापित हो रहा है...',
      statusLabel: 'केवाईसी स्थिति (KYC Status):',
      statusChangeHint: 'परीक्षण हेतु केवाईसी स्थिति बदलें (Test KYC Statuses):',
      verifiedSuccess: 'सत्यापन सफल! KabadiGpt मुख्य इंटरफेस खुल रहा है...',
      uploadNotice: 'प्रोटोटाइप पहचान पत्र सिमुलेशन संलग्न है।',
    },
    en: {
      tag: 'Prototype Verification · Simulation Only',
      notice:
        '⚠️ Prototype Verification: This is a simulation screen for demonstration. No real Aadhaar, PAN, or CPCB/MPCB government databases are queried or authenticated.',
      householdTitle: 'Household Citizen Onboarding (Household)',
      householdSub: 'Setup verified doorstep collection profile and instant UPI scrap payouts',
      kabadiwalaTitle: 'Kabadiwala Collector Formalization & KYC',
      kabadiwalaSub: 'Obtain certified partner badge, smart scale pairing, and B2B hub bidding',
      recyclerTitle: 'Authorized Recycler Compliance Onboarding',
      recyclerSub: 'Consent to Operate (CTO) & CPCB EPR plastic crediting integration',
      govTitle: 'Government & Municipal Officer Verification',
      govSub: 'Access municipal solid waste diversion telematics and regulatory ledger',
      submitBtn: 'Complete Prototype Onboarding',
      verifying: 'Verifying prototype credentials...',
      statusLabel: 'KYC Status:',
      statusChangeHint: 'Test different prototype KYC statuses:',
      verifiedSuccess: 'Verification Complete! Opening main conversational workspace...',
      uploadNotice: 'Prototype simulated ID document attached.',
    },
  }[lang];

  // Manual or automatic status transitions for prototype testing
  const handleSimulateStatus = (newStatus: KycStatus) => {
    setKycStatus(newStatus);
  };

  const handleCompleteKYC = () => {
    setIsVerifying(true);
    // Simulate prototype verification lifecycle
    setTimeout(() => {
      // Determine final status if still pending
      let finalStatus: KycStatus = kycStatus;
      if (finalStatus === 'PENDING') {
        finalStatus = role === 'RECYCLER' || role === 'GOVERNMENT' ? 'COMPLIANCE_VERIFIED' : 'IDENTITY_VERIFIED';
      }

      let details: Record<string, any> = {};

      if (role === 'HOUSEHOLD') {
        details = {
          name: householdName,
          address: householdAddress,
          docType: householdDocType,
          upiId: upiId,
          scrapTypes: scrapTypes,
          verifiedDate: new Date().toISOString(),
        };
      } else if (role === 'KABADIWALA') {
        details = {
          collectorName,
          ward: collectionWard,
          vehicle: vehicleNumber,
          hub: hubAssociation,
          scaleId: smartScaleId,
          dailyCapacity,
          collectorBadgeId: 'MH-KAB-PUN-042',
        };
      } else if (role === 'RECYCLER') {
        details = {
          facilityName,
          license: ctoLicenseNumber,
          capacity: capacityTons,
          gst: gstNumber,
          recyclerTypes,
          eprAuditPass: true,
        };
      } else if (role === 'GOVERNMENT') {
        details = {
          officerName,
          department,
          designation,
          employeeId: employeeGovId,
          jurisdiction,
          securityClearance: 'Level-2 Municipal Auditor',
        };
      }

      setKycStatus(finalStatus);
      setIsVerifying(false);

      if (finalStatus === 'IDENTITY_VERIFIED' || finalStatus === 'COMPLIANCE_VERIFIED') {
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }

      setTimeout(() => {
        onComplete(finalStatus, details);
      }, 1000);
    }, 900);
  };

  const getStatusBadge = (status: KycStatus) => {
    switch (status) {
      case 'IDENTITY_VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            IDENTITY_VERIFIED
          </span>
        );
      case 'COMPLIANCE_VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            COMPLIANCE_VERIFIED
          </span>
        );
      case 'REQUIRES_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            REQUIRES_REVIEW
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      {/* Explicit Prototype Verification notice */}
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">{content.tag}</span>
          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
            {content.notice}
          </p>
        </div>
      </div>

      {/* Role Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
            {role === 'HOUSEHOLD' && content.householdTitle}
            {role === 'KABADIWALA' && content.kabadiwalaTitle}
            {role === 'RECYCLER' && content.recyclerTitle}
            {role === 'GOVERNMENT' && content.govTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {role === 'HOUSEHOLD' && content.householdSub}
            {role === 'KABADIWALA' && content.kabadiwalaSub}
            {role === 'RECYCLER' && content.recyclerSub}
            {role === 'GOVERNMENT' && content.govSub}
          </p>
        </div>
        <div className="shrink-0">{getStatusBadge(kycStatus)}</div>
      </div>

      {/* Interactive Prototype KYC Status Switcher for Testing */}
      <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
          {content.statusChangeHint}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              'PENDING',
              'IDENTITY_VERIFIED',
              'COMPLIANCE_VERIFIED',
              'REQUIRES_REVIEW',
              'REJECTED',
            ] as KycStatus[]
          ).map((s) => (
            <button
              key={s}
              onClick={() => handleSimulateStatus(s)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                kycStatus === s
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Household Role Form */}
      {role === 'HOUSEHOLD' && (
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              नागरिकाचे नाव / Full Name
            </label>
            <input
              type="text"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              पिकअप पत्ता / Residential Address
            </label>
            <input
              type="text"
              value={householdAddress}
              onChange={(e) => setHouseholdAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                प्रोटोटाइप पुरावा प्रकार / Proof Doc
              </label>
              <select
                value={householdDocType}
                onChange={(e) => setHouseholdDocType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white"
              >
                <option value="Electricity Bill / Address Proof">Electricity Bill (MSEDCL)</option>
                <option value="Housing Society NOC">Housing Society NOC</option>
                <option value="Aadhaar Masked Simulation">Aadhaar (Masked Simulation)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                UPI ID (तात्काळ कबाड पैसे खात्यात)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Simulated document attachment */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-mono text-[11px]">{selectedProofSim}</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Simulated Proof Attached
            </span>
          </div>
        </div>
      )}

      {/* 2. Kabadiwala Role Form */}
      {role === 'KABADIWALA' && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                संकलकाचे नाव / Collector Name
              </label>
              <input
                type="text"
                value={collectorName}
                onChange={(e) => setCollectorName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                संकलन वॉर्ड / Assigned Ward
              </label>
              <input
                type="text"
                value={collectionWard}
                onChange={(e) => setCollectionWard(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                वाहन क्रमांक / Vehicle Type
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                संलग्न मायक्रो-हब / Aggregator Hub
              </label>
              <input
                type="text"
                value={hubAssociation}
                onChange={(e) => setHubAssociation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>
          </div>

          {/* Smart Scale Bluetooth pairing simulation */}
          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900">
              <Scale className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="font-bold block text-[11px]">डिजिटल वजन काटा पेअरिंग (IoT Scale):</span>
                <span className="font-mono text-[10px] text-emerald-800">{smartScaleId} (Bluetooth Connected)</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
              CALIBRATED
            </span>
          </div>
        </div>
      )}

      {/* 3. Recycler Role Form */}
      {role === 'RECYCLER' && (
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              प्रक्रिया फॅक्टरीचे नाव / Facility Name
            </label>
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                MPCB / CPCB CTO परवाना क्रमांक
              </label>
              <input
                type="text"
                value={ctoLicenseNumber}
                onChange={(e) => setCtoLicenseNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                मासिक रिसायकलिंग क्षमता (Capacity)
              </label>
              <input
                type="text"
                value={capacityTons}
                onChange={(e) => setCapacityTons(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              GSTIN Tax Identification & EPR UID
            </label>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono"
            />
          </div>
        </div>
      )}

      {/* 4. Government Role Form */}
      {role === 'GOVERNMENT' && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                अधिकाऱ्याचे नाव / Officer Name
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                विभागीय आयडी / Employee ID
              </label>
              <input
                type="text"
                value={employeeGovId}
                onChange={(e) => setEmployeeGovId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              शासकीय मंडळ / Department Organization
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              पद / Designation Authority
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
            />
          </div>
        </div>
      )}

      {/* Success notification if verified */}
      {kycStatus === 'IDENTITY_VERIFIED' || kycStatus === 'COMPLIANCE_VERIFIED' ? (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{content.verifiedSuccess}</span>
        </div>
      ) : null}

      {/* Warning if Requires Review or Rejected */}
      {kycStatus === 'REQUIRES_REVIEW' && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Status: REQUIRES_REVIEW. Documents undergoing secondary supervisor validation.</span>
        </div>
      )}

      {kycStatus === 'REJECTED' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>Status: REJECTED. Incomplete regulatory license document. Please update details and retry.</span>
        </div>
      )}

      {/* Submit Action CTA */}
      <button
        onClick={handleCompleteKYC}
        disabled={isVerifying}
        className="mt-4 w-full min-h-[44px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
      >
        {isVerifying ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>{content.submitBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
