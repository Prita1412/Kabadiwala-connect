import React, { useState, useRef, useEffect } from 'react';
import {
  Scan,
  CheckCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  ShieldCheck,
  Scale,
  Upload,
  RefreshCw,
  Loader2,
  FileImage,
  Layers,
  Package,
} from 'lucide-react';
import { Language, DetectedMaterial } from '../../types';

interface DetectedItem {
  id: string;
  name: string;
  nameMr: string;
  category: 'plastic' | 'paper' | 'metal' | 'ewaste' | 'glass';
  categoryLabelMr: string;
  categoryLabelEn: string;
  estimatedQuantityKg: number;
  confidence: number;
  suggestedRatePerKg: number;
  grade: string;
  color: string;
}

interface MaterialDetectionProps {
  lang: Language;
  imageSrc?: string;
  fileName?: string;
  onAddToPickup?: (detection: DetectedMaterial) => void;
  onOpenScale?: () => void;
}

export const MaterialDetection: React.FC<MaterialDetectionProps> = ({
  lang,
  imageSrc: initialImageSrc,
  fileName: initialFileName = 'Scrap_Item_Scan.jpg',
  onAddToPickup,
  onOpenScale,
}) => {
  const [currentImage, setCurrentImage] = useState<string | null>(
    initialImageSrc || null
  );
  const [fileName, setFileName] = useState<string>(initialFileName);
  const [isLoading, setIsLoading] = useState<boolean>(!initialImageSrc ? false : true);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock detection results with categories and estimated quantities
  const detectedItems: DetectedItem[] = [
    {
      id: 'item-1',
      name: 'PET Grade-1 Clear Bottles & Containers',
      nameMr: 'ग्रेड-१ शुद्ध पीईटी प्लास्टिक बाटल्या',
      category: 'plastic',
      categoryLabelEn: 'Plastics (Polymers)',
      categoryLabelMr: 'प्लास्टिक (पॉलिमर्स)',
      estimatedQuantityKg: 8.5,
      confidence: 96,
      suggestedRatePerKg: 18.5,
      grade: 'Grade A (100% Circular Recyclable)',
      color: 'emerald',
    },
    {
      id: 'item-2',
      name: 'Corrugated Cardboard / Cartons',
      nameMr: 'पुठ्ठा / कार्डबोर्ड बॉक्सेस',
      category: 'paper',
      categoryLabelEn: 'Paper & Fibers',
      categoryLabelMr: 'कागद व पुठ्ठा',
      estimatedQuantityKg: 14.0,
      confidence: 92,
      suggestedRatePerKg: 11.0,
      grade: 'Grade B (OCC-11 High Fiber)',
      color: 'amber',
    },
    {
      id: 'item-3',
      name: 'Scrap Iron Grills & Rods',
      nameMr: 'लोखंडी भंगार व रॉड्स',
      category: 'metal',
      categoryLabelEn: 'Metals (Ferrous)',
      categoryLabelMr: 'धातू व लोखंड',
      estimatedQuantityKg: 6.2,
      confidence: 89,
      suggestedRatePerKg: 30.0,
      grade: 'Grade A (HMS-1 Heavy Melt)',
      color: 'blue',
    },
  ];

  // Trigger simulated scanning when an image is available
  useEffect(() => {
    if (initialImageSrc) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setHasScanned(true);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [initialImageSrc]);

  const handleFileProcess = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setCurrentImage(reader.result as string);
      setIsLoading(true);
      setHasScanned(false);

      // Simulate AI Vision analysis loading
      setTimeout(() => {
        setIsLoading(false);
        setHasScanned(true);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const totalEstimatedWeight = detectedItems.reduce(
    (acc, curr) => acc + curr.estimatedQuantityKg,
    0
  );
  const totalEstimatedValue = detectedItems.reduce(
    (acc, curr) => acc + curr.estimatedQuantityKg * curr.suggestedRatePerKg,
    0
  );

  const content = {
    mr: {
      title: 'एआय कॉम्प्युटर व्हिजन - भंगार ओळख व प्रमाण',
      sub: 'फोटो अपलोड करा किंवा स्कॅन करा · मशीन लर्निंग मॉडेल',
      uploadPrompt: 'भंगाराचा फोटो येथे अपलोड करा किंवा ड्रॅग करा',
      uploadSub: 'PNG, JPG किंवा WebP समर्थित',
      scanningTitle: 'एआय कॉम्प्युटर व्हिजन स्कॅन करत आहे...',
      scanningSub: 'पॉलिमर प्रकार, धातू शुद्धता व अंदाजे वजन मोजले जात आहे...',
      detectedCount: 'साहित्य शोधले गेले',
      category: 'श्रेणी (Category)',
      estWeight: 'अंदाजे प्रमाण',
      rate: 'बाजारभाव',
      totalSummary: 'एकूण शोधलेला साठा',
      totalWeightLabel: 'एकूण अंदाजे वजन',
      totalValLabel: 'अंदाजे रोख मूल्य',
      btnAdd: 'पिकअप विनंतीमध्ये जोडा',
      btnScale: 'काट्यावर अचूक वजन करा',
      btnUploadAgain: 'दुसरा फोटो स्कॅन करा',
    },
    hi: {
      title: 'एआई कंप्यूटर विजन - कबाड़ पहचान व मात्रा',
      sub: 'फोटो अपलोड करें या स्कैन करें · मशीन लर्निंग मॉडल',
      uploadPrompt: 'कबाड़ का फोटो यहाँ अपलोड करें या ड्रैग करें',
      uploadSub: 'PNG, JPG या WebP समर्थित',
      scanningTitle: 'एआई कंप्यूटर विजन स्कैन कर रहा है...',
      scanningSub: 'पॉलिमर प्रकार, धातु शुद्धता व अनुमानित वजन निकाला जा रहा है...',
      detectedCount: 'सामग्रियां पहचानी गईं',
      category: 'श्रेणी (Category)',
      estWeight: 'अनुमानित मात्रा',
      rate: 'बाजार भाव',
      totalSummary: 'कुल पहचानी गई सामग्री',
      totalWeightLabel: 'कुल अनुमानित वजन',
      totalValLabel: 'अनुमानित नकद मूल्य',
      btnAdd: 'पिकअप अनुरोध में जोड़ें',
      btnScale: 'कांटे पर सटीक वजन करें',
      btnUploadAgain: 'अन्य फोटो स्कैन करें',
    },
    en: {
      title: 'AI Vision Material Detection & Quantities',
      sub: 'Upload scrap photo for instant categorization and estimation',
      uploadPrompt: 'Click to upload scrap photo or drag and drop',
      uploadSub: 'Supports PNG, JPG, or WebP up to 10MB',
      scanningTitle: 'AI Computer Vision is analyzing scrap photo...',
      scanningSub: 'Segmenting polymer types, metal purity & volumetric mass...',
      detectedCount: 'Materials Detected',
      category: 'Category',
      estWeight: 'Est. Quantity',
      rate: 'Spot Rate',
      totalSummary: 'Total Visual Analysis',
      totalWeightLabel: 'Total Est. Weight',
      totalValLabel: 'Est. Cash Value',
      btnAdd: 'Add to Pickup Request',
      btnScale: 'Verify on Digital Scale',
      btnUploadAgain: 'Scan Another Photo',
    },
  }[lang];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 my-2 max-w-xl">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Scan className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 text-base">{content.title}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{content.sub}</p>
        </div>
        {hasScanned && (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            {detectedItems.length} {content.detectedCount}
          </span>
        )}
      </div>

      {/* 1. UPLOAD STATE (when no image has been selected) */}
      {!currentImage && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors my-2 ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-slate-50'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900 mb-1">
            {content.uploadPrompt}
          </h4>
          <p className="text-xs text-slate-500 mb-4">{content.uploadSub}</p>
          <button
            type="button"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <FileImage className="w-4 h-4" />
            <span>Select Scrap Photo</span>
          </button>
        </div>
      )}

      {/* 2. LOADING STATE (while AI is analyzing) */}
      {currentImage && isLoading && (
        <div className="relative w-full rounded-xl overflow-hidden bg-slate-950 p-6 my-2 text-center text-white border border-slate-800">
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-md">
            <img
              src={currentImage}
              alt="Analyzing scrap"
              className="w-full h-full object-cover opacity-60"
            />
            {/* Visual radar scanning sweep line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/40 to-transparent animate-pulse" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            <h4 className="font-bold text-sm text-emerald-300">
              {content.scanningTitle}
            </h4>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {content.scanningSub}
          </p>

          <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto mt-4 overflow-hidden">
            <div className="w-full h-full bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* 3. DETECTION RESULTS STATE */}
      {currentImage && !isLoading && hasScanned && (
        <div className="space-y-3 my-2">
          {/* Visual scanned photo with bounding box annotations */}
          <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            <img
              src={currentImage}
              alt="Detected scrap items"
              className="w-full h-full object-cover"
            />

            {/* AI Bounding Box 1 */}
            <div
              className="absolute border-2 border-emerald-400 rounded-lg bg-emerald-400/10 pointer-events-none"
              style={{ top: '15%', left: '12%', width: '40%', height: '62%' }}
            >
              <div className="absolute -top-6 left-0 bg-emerald-600 text-white font-mono text-[10px] font-semibold px-2 py-0.5 rounded shadow whitespace-nowrap">
                PET_BOTTLE: 8.5 kg (96%)
              </div>
            </div>

            {/* AI Bounding Box 2 */}
            <div
              className="absolute border-2 border-amber-400 rounded-lg bg-amber-400/10 pointer-events-none"
              style={{ top: '25%', left: '56%', width: '38%', height: '52%' }}
            >
              <div className="absolute -top-6 left-0 bg-amber-600 text-white font-mono text-[10px] font-semibold px-2 py-0.5 rounded shadow whitespace-nowrap">
                CARDBOARD: 14.0 kg (92%)
              </div>
            </div>

            <div className="absolute bottom-2 right-2 bg-slate-900/85 backdrop-blur text-[10px] font-mono text-emerald-300 px-2 py-1 rounded border border-slate-700">
              Edge AI Vision · Verified
            </div>
          </div>

          {/* List of Detected Materials & Categories */}
          <div className="space-y-2">
            {detectedItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.color === 'emerald'
                          ? 'bg-emerald-500'
                          : item.color === 'amber'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <h5 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                      {lang === 'mr' ? item.nameMr : item.name}
                    </h5>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>
                      {lang === 'mr'
                        ? item.categoryLabelMr
                        : item.categoryLabelEn}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-emerald-700 font-medium">
                      {item.grade}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-slate-900 text-sm block">
                    {item.estimatedQuantityKg} kg
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                    ₹{item.suggestedRatePerKg}/kg · ₹
                    {Math.round(item.estimatedQuantityKg * item.suggestedRatePerKg)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Aggregate Total Summary */}
          <div className="bg-slate-900 text-white rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-300 block">
                {content.totalWeightLabel}
              </span>
              <span className="text-lg font-bold font-mono text-white">
                {totalEstimatedWeight.toFixed(1)} kg
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-300 block">
                {content.totalValLabel}
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                ₹{Math.round(totalEstimatedValue)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => {
                if (onAddToPickup) {
                  onAddToPickup({
                    id: detectedItems[0].id,
                    name: detectedItems[0].name,
                    nameMr: detectedItems[0].nameMr,
                    nameHi: detectedItems[0].name,
                    confidence: detectedItems[0].confidence,
                    category: detectedItems[0].category,
                    estimatedKg: totalEstimatedWeight,
                    suggestedRatePerKg: detectedItems[0].suggestedRatePerKg,
                    recyclabilityGrade: detectedItems[0].grade,
                    notes: 'Multi-material detection completed.',
                  });
                }
              }}
              className="w-full sm:flex-1 min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{content.btnAdd}</span>
            </button>

            <button
              onClick={onOpenScale}
              className="w-full sm:w-auto min-h-[44px] px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>{content.btnScale}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto min-h-[44px] px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              title={content.btnUploadAgain}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{content.btnUploadAgain}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
