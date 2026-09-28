export type UserRole = 'household' | 'kabadiwala' | 'recycler' | 'regulator';
export type SupportedRole = 'HOUSEHOLD' | 'KABADIWALA' | 'RECYCLER' | 'GOVERNMENT';
export type Language = 'mr' | 'hi' | 'en';

export type KycStatus =
  | 'PENDING'
  | 'IDENTITY_VERIFIED'
  | 'COMPLIANCE_VERIFIED'
  | 'REQUIRES_REVIEW'
  | 'REJECTED';

// ==========================================
// 1. COLLECTION: users
// ==========================================
export interface UserDocument {
  id: string;
  name: string;
  phone: string;
  role: SupportedRole;
  verificationStatus: KycStatus;
  language: Language;
  latitude: number;
  longitude: number;
  createdAt: any;
  updatedAt: any;
  location?: string;
  kycDetails?: Record<string, any>;
}

export interface UserProfile {
  id?: string;
  phone: string;
  name?: string;
  role: SupportedRole | null;
  verificationStatus?: KycStatus;
  kycStatus: KycStatus;
  language?: Language;
  location?: string;
  latitude?: number;
  longitude?: number;
  kycDetails?: Record<string, any>;
  onboarded: boolean;
  createdAt?: any;
  updatedAt?: any;
}

// ==========================================
// 2. COLLECTION: requests
// ==========================================
export type RequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface PickupItem {
  name?: string;
  material?: string;
  approxKg: number;
  ratePerKg?: number;
  icon?: string;
}

export interface RequestDocument {
  id: string;
  householdId?: string;
  assignedKabadiwalaId?: string | null;
  materialTypes?: string[];
  estimatedWeight?: string | number;
  address: string;
  latitude: number;
  longitude: number;
  preferredPickupTime?: string;
  status: RequestStatus;
  createdAt?: any;
  updatedAt?: any;
  // UI helper mappings
  userId?: string;
  customerName?: string;
  phone?: string;
  area?: string;
  locality?: string;
  materials?: string[];
  items?: PickupItem[];
  estimatedWeightKg?: number;
  estimatedPayout?: number;
  estimatedEarnings?: number;
  slot?: string;
  scheduledTime?: string;
  distance?: string;
  distanceKm?: number;
  urgent?: boolean;
  collectorId?: string;
  collectorName?: string;
}

export type PickupRequest = RequestDocument;
export type PickupRequestDocument = RequestDocument;

// ==========================================
// 3. COLLECTION: pickups
// ==========================================
export interface PickupDocument {
  id: string;
  requestId: string;
  householdId: string;
  kabadiwalaId: string;
  status: string;
  startedAt: any;
  completedAt: any;
  actualWeight: number;
  materialBreakdown: Array<{
    material: string;
    weightKg: number;
    ratePerKg: number;
    amount: number;
  }>;
  totalAmount: number;
  createdAt: any;
  // UI helper mappings
  collectorId?: string;
  collectorName?: string;
  customerName?: string;
  phone?: string;
  address?: string;
  locality?: string;
  materials?: string[];
  distance?: string;
  eta?: string;
  totalWeightKg?: number;
  updatedAt?: any;
}

// ==========================================
// 4. COLLECTION: receipts
// ==========================================
export interface WeighedItem {
  id?: string;
  name?: string;
  materialName?: string;
  category?: string;
  weightKg: number;
  ratePerKg: number;
  amount?: number;
  subtotal?: number;
}

export interface ReceiptDocument {
  id: string;
  pickupId: string;
  householdId: string;
  kabadiwalaId: string;
  items: Array<{
    name: string;
    weightKg: number;
    ratePerKg: number;
    amount: number;
    materialName?: string;
    subtotal?: number;
    id?: string;
  }>;
  totalAmount: number;
  createdAt: any;
  // UI helper mappings
  totalWeight?: number;
  customerName?: string;
  collectorName?: string;
  collectorId?: string;
  customerPhone?: string;
  paymentMode?: 'UPI' | 'CASH' | 'BANK_TRANSFER' | string;
  paymentStatus?: 'COMPLETED' | 'PENDING' | string;
  scaleBluetoothId?: string;
  qrVerificationHash?: string;
  timestamp?: string;
}

export type DigitalReceiptData = ReceiptDocument;
export type DigitalReceiptDocument = ReceiptDocument;

// ==========================================
// 5. COLLECTION: batches
// ==========================================
export interface BatchDocument {
  id: string;
  batchId?: string;
  createdBy?: string;
  kabadiwalaId?: string;
  recyclerId?: string | null;
  materialType?: string;
  totalWeight?: number;
  status:
    | 'CREATED'
    | 'DISPATCHED'
    | 'RECEIVED'
    | 'RECYCLED'
    | 'ready_for_dispatch'
    | 'in_transit'
    | 'created'
    | 'bidding';
  createdAt?: any;
  receivedAt?: any;
  // UI helper mappings
  batchNumber?: string;
  materialCategory?: string;
  totalWeightKg?: number;
  weightKg?: number;
  balesCount?: number;
  baleCount?: number;
  purityGrade?: string;
  moisturePercent?: number;
  moistureContent?: number;
  contaminationPercent?: number;
  contaminationRate?: number;
  originHub?: string;
  collectorId?: string;
  collectorName?: string;
  tamperSealId?: string;
  qrSealCode?: string;
  createdDate?: string;
  bestBidRatePerKg?: number;
  matchedRecyclerId?: string;
  matchedRecyclerName?: string;
  finalRatePerKg?: number;
  updatedAt?: any;
}

export type BatchItem = BatchDocument;

// ==========================================
// 6. COLLECTION: events
// ==========================================
export interface EventDocument {
  id: string;
  eventType: string;
  actorId: string;
  actorRole: string;
  requestId: string | null;
  pickupId: string | null;
  batchId: string | null;
  weight: number | null;
  latitude: number | null;
  longitude: number | null;
  timestamp: any;
  metadata: Record<string, any>;
  description?: string;
}

// ==========================================
// 7. COLLECTION: recyclers
// ==========================================
export interface RecyclerDocument {
  id: string;
  name?: string;
  gstin?: string;
  registrationStatus?: string;
  verificationStatus?: string;
  facilityLocation?: string;
  supportedMaterials?: string[];
  createdAt?: any;
  // UI helper mappings
  companyName?: string;
  recyclerName?: string;
  location?: string;
  distanceKm?: number;
  offeredRatePerKg?: number;
  bidRatePerKg?: number;
  minBatchKg?: number;
  totalOfferValue?: number;
  eprCertified?: boolean;
  rating?: number;
  settlementDays?: number;
  licenseNumber?: string;
  verified?: boolean;
  materialsAccepted?: string[];
  capacityMonthlyTons?: number;
}

export type RecyclerOffer = RecyclerDocument;

// Materials, Facilities & UI Component Types
export interface ScrapRate {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  category: 'paper' | 'plastic' | 'metal' | 'ewaste' | 'glass';
  ratePerKg: number;
  unit: string;
  icon: string;
}

export type MaterialDocument = ScrapRate;

export interface TraceabilityStep {
  id?: string;
  stepNumber?: number;
  batchId?: string;
  stage?: string;
  title: string;
  titleMr?: string;
  actor: string;
  actorName?: string;
  location: string;
  timestamp: string;
  status?: 'completed' | 'active' | 'upcoming';
  completed?: boolean;
  hash?: string;
  verificationHash?: string;
  details?: string;
  cpcbEprCreditIssued?: boolean;
}

export type TraceabilityRecordDocument = TraceabilityStep;

export interface DetectedMaterial {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  category: string;
  estimatedWeightKg?: number;
  estimatedKg?: number;
  suggestedRatePerKg?: number;
  recyclabilityGrade?: string;
  notes?: string;
  confidence: number;
  estimatedPrice?: number;
  unit?: string;
}

export type ActiveComponentType =
  | 'REQUEST_COUNT'
  | 'REQUEST_LIST'
  | 'PICKUP_DETAILS'
  | 'PICKUP_MAP'
  | 'FULL_DASHBOARD'
  | 'SELL_SCRAP'
  | 'MATERIAL_DETECTION'
  | 'DIGITAL_WEIGHING'
  | 'DIGITAL_RECEIPT'
  | 'EARNINGS'
  | 'BATCH_CREATION'
  | 'BATCH_DETAILS'
  | 'RECYCLER_MATCHING'
  | 'TRACEABILITY'
  | 'REGULATORY_ANALYTICS';

export interface CentralUIState {
  activeComponent: ActiveComponentType | string | null;
  componentData: Record<string, any> | null;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  workflow?: {
    type: ActiveComponentType;
    data?: any;
  };
  onboardingRole?: SupportedRole;
  imageAttachment?: string;
  isVoice?: boolean;
}
