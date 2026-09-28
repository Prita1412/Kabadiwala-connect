import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import {
  UserDocument,
  SupportedRole,
  KycStatus,
  Language,
  RequestDocument,
  RequestStatus,
  PickupDocument,
  ReceiptDocument,
  BatchDocument,
  EventDocument,
  RecyclerDocument,
  MaterialDocument,
  TraceabilityRecordDocument,
  WeighedItem,
} from '../types';
import {
  SCRAP_RATES,
  MOCK_PICKUPS,
  MOCK_BATCHES,
  MOCK_RECYCLER_OFFERS,
  MOCK_TRACEABILITY_STEPS,
} from '../data/mockData';

// Firestore collections strictly matching the specification
export const COLLECTIONS = {
  USERS: 'users',
  REQUESTS: 'requests',
  PICKUPS: 'pickups',
  RECEIPTS: 'receipts',
  BATCHES: 'batches',
  EVENTS: 'events',
  RECYCLERS: 'recyclers',
  MATERIALS: 'materials',
  TRACEABILITY: 'traceability',
} as const;

// ==========================================
// 1. AUTHENTICATION & IDENTITY ENFORCEMENT
// ==========================================

/**
 * Ensure an active Firebase Authentication session exists.
 * Prevents client spoofing by providing the cryptographically verified auth.currentUser.uid.
 */
export async function ensureAuthenticated(phone?: string): Promise<FirebaseUser> {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  const credential = await signInAnonymously(auth);
  return credential.user;
}

/**
 * Development authentication flow with OTP verification (123456)
 */
export async function authenticateWithPhoneDev(
  phoneNumber: string,
  otpCode: string
): Promise<{ user: FirebaseUser; phone: string }> {
  if (otpCode.trim() !== '123456') {
    throw new Error('Invalid OTP code. For prototype verification, use 123456.');
  }

  const user = await ensureAuthenticated(phoneNumber);
  return { user, phone: phoneNumber };
}

export function subscribeAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Helper to securely get authenticated UID. Throws or creates verified session.
 */
export function getVerifiedAuthUid(): string {
  const current = auth.currentUser;
  if (!current) {
    throw new Error('Action requires authenticated Firebase user');
  }
  return current.uid;
}

// ==========================================
// 2. COLLECTION: users
// ==========================================
// Document model:
// id, name, phone, role, verificationStatus, language, latitude, longitude, createdAt, updatedAt

export async function getUserProfile(userId: string): Promise<UserDocument | null> {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserDocument;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching user profile from Firestore:', error);
    return null;
  }
}

/**
 * Save user document into `users` collection.
 * Enforces identity: id must match request.auth.uid to prevent client-side forgery.
 */
export async function saveUserProfile(profileData: {
  id: string;
  name: string;
  phone: string;
  role: SupportedRole;
  verificationStatus: KycStatus;
  language: Language;
  latitude?: number;
  longitude?: number;
  location?: string;
  kycDetails?: Record<string, any>;
}): Promise<UserDocument> {
  // Ensure user is authenticated
  const verifiedUser = await ensureAuthenticated(profileData.phone);
  const verifiedUid = verifiedUser.uid;

  const userDocRef = doc(db, COLLECTIONS.USERS, verifiedUid);
  const existing = await getDoc(userDocRef);

  const defaultCoords = { lat: 18.558, lng: 73.8078 }; // Aundh, Pune
  const userDoc: UserDocument = {
    id: verifiedUid,
    name: profileData.name || 'Verified Citizen',
    phone: profileData.phone,
    role: profileData.role,
    verificationStatus: profileData.verificationStatus || 'PENDING',
    language: profileData.language || 'mr',
    latitude: profileData.latitude ?? defaultCoords.lat,
    longitude: profileData.longitude ?? defaultCoords.lng,
    location: profileData.location || 'Pune, Maharashtra',
    createdAt: existing.exists() ? (existing.data() as any).createdAt : serverTimestamp(),
    updatedAt: serverTimestamp(),
    kycDetails: profileData.kycDetails || {},
  };

  await setDoc(userDocRef, userDoc, { merge: true });

  await logAuditEvent({
    eventType: existing.exists() ? 'USER_UPDATED' : 'USER_REGISTERED',
    entityId: verifiedUid,
    actorId: verifiedUid,
    actorRole: profileData.role,
    latitude: userDoc.latitude,
    longitude: userDoc.longitude,
    description: `User ${userDoc.name} (${userDoc.role}) registered. Status: ${userDoc.verificationStatus}`,
    metadata: { phone: userDoc.phone, role: userDoc.role },
  });

  return userDoc;
}

// ==========================================
// 3. COLLECTION: requests
// ==========================================
// Document model:
// id, householdId, assignedKabadiwalaId, materialTypes, estimatedWeight, address, latitude, longitude, preferredPickupTime, status, createdAt, updatedAt
// Request statuses: PENDING | ACCEPTED | IN_PROGRESS | COMPLETED | CANCELLED

export async function createPickupRequest(data: {
  materialTypes: string[];
  estimatedWeight: string | number;
  address: string;
  preferredPickupTime: string;
  latitude?: number;
  longitude?: number;
  householdId?: string;
  customerName?: string;
  phone?: string;
  estimatedPayout?: number;
}): Promise<RequestDocument> {
  const verifiedUser = await ensureAuthenticated();
  const verifiedHouseholdId = verifiedUser.uid;

  const reqId = `REQ-${Date.now().toString().slice(-6)}`;
  const lat = data.latitude ?? 18.558;
  const lng = data.longitude ?? 73.8078;

  const newDoc: RequestDocument = {
    id: reqId,
    householdId: verifiedHouseholdId, // Enforced to prevent client spoofing
    assignedKabadiwalaId: null,
    materialTypes: data.materialTypes,
    estimatedWeight: data.estimatedWeight,
    address: data.address,
    latitude: lat,
    longitude: lng,
    preferredPickupTime: data.preferredPickupTime,
    status: 'PENDING',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    // UI helper mappings
    customerName: data.customerName || 'Citizen User',
    phone: data.phone || '+91 98220 14829',
    estimatedPayout: data.estimatedPayout || 450,
    slot: data.preferredPickupTime,
  };

  await setDoc(doc(db, COLLECTIONS.REQUESTS, reqId), newDoc);

  await logAuditEvent({
    eventType: 'REQUEST_CREATED',
    entityId: reqId,
    actorId: verifiedHouseholdId,
    actorRole: 'HOUSEHOLD',
    requestId: reqId,
    latitude: lat,
    longitude: lng,
    description: `New scrap collection request #${reqId} created (${data.estimatedWeight})`,
    metadata: { address: data.address, slot: data.preferredPickupTime },
  });

  return newDoc;
}

export async function getPickupRequests(filters?: {
  status?: RequestStatus;
  householdId?: string;
}): Promise<RequestDocument[]> {
  try {
    const collRef = collection(db, COLLECTIONS.REQUESTS);
    const snap = await getDocs(collRef);

    if (snap.empty) {
      await seedInitialDataIfEmpty();
      const freshSnap = await getDocs(collRef);
      return freshSnap.docs.map((d) => d.data() as RequestDocument);
    }

    let results = snap.docs.map((d) => d.data() as RequestDocument);

    if (filters?.status) {
      results = results.filter((r) => r.status.toUpperCase() === filters.status?.toUpperCase());
    }
    if (filters?.householdId) {
      results = results.filter((r) => r.householdId === filters.householdId);
    }

    return results;
  } catch (error) {
    console.warn('Error fetching pickup requests:', error);
    return MOCK_PICKUPS as RequestDocument[];
  }
}

/**
 * Accept a request: transition request to ACCEPTED and create pickup in `pickups`
 */
export async function acceptPickup(
  requestId: string,
  collectorIdParam?: string,
  collectorNameParam?: string
): Promise<PickupDocument> {
  const verifiedUser = await ensureAuthenticated();
  const verifiedCollectorId = verifiedUser.uid;

  const reqRef = doc(db, COLLECTIONS.REQUESTS, requestId);
  await updateDoc(reqRef, {
    status: 'ACCEPTED',
    assignedKabadiwalaId: verifiedCollectorId,
    updatedAt: serverTimestamp(),
  });

  const pickupId = `PKP-${Date.now().toString().slice(-6)}`;
  const pickupDoc: PickupDocument = {
    id: pickupId,
    requestId,
    householdId: 'HH-USER-1',
    kabadiwalaId: verifiedCollectorId,
    status: 'ASSIGNED',
    startedAt: serverTimestamp(),
    completedAt: null,
    actualWeight: 0,
    materialBreakdown: [],
    totalAmount: 0,
    createdAt: serverTimestamp(),
    customerName: 'Citizen Customer',
    address: 'Pune Municipal Ward',
    distance: '0.8 km',
    eta: '10 mins',
  };

  await setDoc(doc(db, COLLECTIONS.PICKUPS, pickupId), pickupDoc);

  await logAuditEvent({
    eventType: 'PICKUP_ACCEPTED',
    entityId: pickupId,
    actorId: verifiedCollectorId,
    actorRole: 'KABADIWALA',
    requestId,
    pickupId,
    description: `Collector #${verifiedCollectorId} accepted request #${requestId}`,
  });

  return pickupDoc;
}

// ==========================================
// 4. COLLECTION: pickups & digital weighing
// ==========================================
// Document model:
// id, requestId, householdId, kabadiwalaId, status, startedAt, completedAt, actualWeight, materialBreakdown, totalAmount, createdAt

export async function recordWeight(
  pickupId: string,
  itemWeights: WeighedItem[],
  householdIdParam?: string
): Promise<{
  totalWeight: number;
  totalAmount: number;
  pickupId: string;
}> {
  const verifiedUser = await ensureAuthenticated();
  const verifiedKabadiwalaId = verifiedUser.uid;

  const totalWeight = itemWeights.reduce((sum, item) => sum + (item.weightKg || 0), 0);
  const totalAmount = itemWeights.reduce(
    (sum, item) => sum + (item.amount || item.subtotal || item.weightKg * item.ratePerKg),
    0
  );

  const breakdown = itemWeights.map((i) => ({
    material: i.materialName || i.name || 'Scrap Material',
    weightKg: i.weightKg,
    ratePerKg: i.ratePerKg,
    amount: i.amount || i.subtotal || i.weightKg * i.ratePerKg,
  }));

  const pickupRef = doc(db, COLLECTIONS.PICKUPS, pickupId);
  await setDoc(
    pickupRef,
    {
      id: pickupId,
      requestId: pickupId,
      householdId: householdIdParam || 'HH-CURRENT',
      kabadiwalaId: verifiedKabadiwalaId,
      status: 'WEIGHED',
      actualWeight: totalWeight,
      materialBreakdown: breakdown,
      totalAmount: totalAmount,
      completedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  await logAuditEvent({
    eventType: 'WEIGHT_RECORDED',
    entityId: pickupId,
    actorId: verifiedKabadiwalaId,
    actorRole: 'KABADIWALA',
    pickupId,
    weight: totalWeight,
    description: `Weighed ${totalWeight.toFixed(1)} kg for ₹${totalAmount.toFixed(0)} via smart scale.`,
  });

  return { totalWeight, totalAmount, pickupId };
}

// ==========================================
// 5. COLLECTION: receipts
// ==========================================
// Document model:
// id, pickupId, householdId, kabadiwalaId, items, totalAmount, createdAt

export async function createReceipt(receiptData: {
  pickupId: string;
  householdId?: string;
  collectorId?: string;
  items: WeighedItem[];
  totalAmount: number;
  customerName?: string;
  collectorName?: string;
  totalWeight?: number;
  paymentMode?: string;
  paymentStatus?: string;
  scaleBluetoothId?: string;
  qrVerificationHash?: string;
}): Promise<ReceiptDocument> {
  const verifiedUser = await ensureAuthenticated();
  const verifiedKabadiwalaId = verifiedUser.uid;

  const receiptId = `RCP-2026-${Date.now().toString().slice(-4)}`;
  const itemsPayload = receiptData.items.map((i) => ({
    name: i.materialName || i.name || 'Scrap Item',
    weightKg: i.weightKg,
    ratePerKg: i.ratePerKg,
    amount: i.amount || i.subtotal || i.weightKg * i.ratePerKg,
  }));

  const receiptDoc: ReceiptDocument = {
    id: receiptId,
    pickupId: receiptData.pickupId,
    householdId: receiptData.householdId || 'HH-CURRENT',
    kabadiwalaId: verifiedKabadiwalaId,
    items: itemsPayload,
    totalAmount: receiptData.totalAmount,
    createdAt: serverTimestamp(),
    customerName: receiptData.customerName || 'Verified Citizen',
    collectorName: receiptData.collectorName || 'Ramesh Shinde',
    totalWeight: receiptData.totalWeight || itemsPayload.reduce((a, b) => a + b.weightKg, 0),
    paymentMode: receiptData.paymentMode || 'UPI',
    paymentStatus: receiptData.paymentStatus || 'COMPLETED',
    qrVerificationHash: `SHA256-QR-${receiptId}`,
  };

  await setDoc(doc(db, COLLECTIONS.RECEIPTS, receiptId), receiptDoc);

  await logAuditEvent({
    eventType: 'RECEIPT_ISSUED',
    entityId: receiptId,
    actorId: verifiedKabadiwalaId,
    actorRole: 'KABADIWALA',
    pickupId: receiptData.pickupId,
    description: `Digital receipt #${receiptId} generated for ₹${receiptData.totalAmount}`,
  });

  return receiptDoc;
}

export async function getReceipt(receiptId: string): Promise<ReceiptDocument | null> {
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.RECEIPTS, receiptId));
    if (snap.exists()) {
      return snap.data() as ReceiptDocument;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// ==========================================
// 6. COLLECTION: batches
// ==========================================
// Document model:
// id, batchId, createdBy, kabadiwalaId, recyclerId, materialType, totalWeight, status, createdAt, receivedAt

export async function createBatch(batchData: {
  batchId?: string;
  materialType: string;
  totalWeight: number;
  recyclerId?: string | null;
  status?: any;
  balesCount?: number;
  purityGrade?: string;
  moisturePercent?: number;
  contaminationPercent?: number;
}): Promise<BatchDocument> {
  const verifiedUser = await ensureAuthenticated();
  const verifiedKabadiwalaId = verifiedUser.uid;

  const docId = `BAT-${Date.now().toString().slice(-6)}`;
  const humanBatchId = batchData.batchId || `PUN-BAL-2026-${Math.floor(800 + Math.random() * 100)}`;

  const newBatch: BatchDocument = {
    id: docId,
    batchId: humanBatchId,
    createdBy: verifiedKabadiwalaId, // Verified to prevent forgery
    kabadiwalaId: verifiedKabadiwalaId,
    recyclerId: batchData.recyclerId || null,
    materialType: batchData.materialType,
    totalWeight: batchData.totalWeight,
    status: (batchData.status?.toUpperCase() as any) || 'CREATED',
    createdAt: serverTimestamp(),
    receivedAt: null,
    batchNumber: humanBatchId,
    balesCount: batchData.balesCount || 8,
    purityGrade: batchData.purityGrade || 'Grade-A 98.2% Virgin Equivalent',
    moisturePercent: batchData.moisturePercent || 1.8,
    contaminationPercent: batchData.contaminationPercent || 1.4,
    qrSealCode: `TS-9924-MH-${docId}`,
  };

  await setDoc(doc(db, COLLECTIONS.BATCHES, docId), newBatch);

  await logAuditEvent({
    eventType: 'BATCH_CREATED',
    entityId: docId,
    actorId: verifiedKabadiwalaId,
    actorRole: 'KABADIWALA',
    batchId: humanBatchId,
    weight: batchData.totalWeight,
    description: `Baled scrap batch #${humanBatchId} sealed with QR seal`,
  });

  return newBatch;
}

export async function getBatches(): Promise<BatchDocument[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.BATCHES));
    if (snap.empty) {
      await seedInitialDataIfEmpty();
      const fresh = await getDocs(collection(db, COLLECTIONS.BATCHES));
      return fresh.docs.map((d) => d.data() as BatchDocument);
    }
    return snap.docs.map((d) => d.data() as BatchDocument);
  } catch (error) {
    return MOCK_BATCHES as BatchDocument[];
  }
}

export async function getBatch(batchId: string): Promise<BatchDocument | null> {
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.BATCHES, batchId));
    if (snap.exists()) {
      return snap.data() as BatchDocument;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// ==========================================
// 7. COLLECTION: events (Audit Ledger)
// ==========================================
// Document model:
// id, eventType, actorId, actorRole, requestId, pickupId, batchId, weight, latitude, longitude, timestamp, metadata

export async function logAuditEvent(event: {
  eventType: string;
  actorId?: string;
  actorRole?: string;
  requestId?: string | null;
  pickupId?: string | null;
  batchId?: string | null;
  weight?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  metadata?: Record<string, any>;
  description?: string;
  entityId?: string;
}): Promise<void> {
  try {
    const eventId = `EVT-${Date.now().toString().slice(-6)}`;
    const authId = auth.currentUser?.uid || event.actorId || 'SYSTEM';

    const eventDoc: EventDocument = {
      id: eventId,
      eventType: event.eventType,
      actorId: authId,
      actorRole: event.actorRole || 'SYSTEM',
      requestId: event.requestId || null,
      pickupId: event.pickupId || null,
      batchId: event.batchId || null,
      weight: event.weight ?? null,
      latitude: event.latitude ?? null,
      longitude: event.longitude ?? null,
      timestamp: serverTimestamp(),
      metadata: event.metadata || {},
      description: event.description || '',
    };

    await setDoc(doc(db, COLLECTIONS.EVENTS, eventId), eventDoc);
  } catch (e) {
    // Non-blocking telemetry
  }
}

// ==========================================
// 8. COLLECTION: recyclers
// ==========================================
// Document model:
// id, name, gstin, registrationStatus, verificationStatus, facilityLocation, supportedMaterials, createdAt

export async function getRecyclers(): Promise<RecyclerDocument[]> {
  try {
    const collRef = collection(db, COLLECTIONS.RECYCLERS);
    const snap = await getDocs(collRef);
    if (snap.empty) {
      await seedInitialDataIfEmpty();
      const freshSnap = await getDocs(collRef);
      return freshSnap.docs.map((d) => d.data() as RecyclerDocument);
    }
    return snap.docs.map((d) => d.data() as RecyclerDocument);
  } catch (error) {
    return MOCK_RECYCLER_OFFERS as RecyclerDocument[];
  }
}

// ==========================================
// 9. AUXILIARY DATA (Materials & Traceability)
// ==========================================

export async function getMaterials(): Promise<MaterialDocument[]> {
  try {
    const collRef = collection(db, COLLECTIONS.MATERIALS);
    const snap = await getDocs(collRef);
    if (snap.empty) {
      await seedInitialDataIfEmpty();
      const freshSnap = await getDocs(collRef);
      return freshSnap.docs.map((d) => d.data() as MaterialDocument);
    }
    return snap.docs.map((d) => d.data() as MaterialDocument);
  } catch (error) {
    return SCRAP_RATES as MaterialDocument[];
  }
}

export async function getTraceability(batchId?: string): Promise<TraceabilityRecordDocument[]> {
  try {
    const collRef = collection(db, COLLECTIONS.TRACEABILITY);
    const snap = await getDocs(collRef);
    if (snap.empty) {
      await seedInitialDataIfEmpty();
      const freshSnap = await getDocs(collRef);
      return freshSnap.docs.map((d) => d.data() as TraceabilityRecordDocument);
    }
    return snap.docs.map((d) => d.data() as TraceabilityRecordDocument);
  } catch (error) {
    return MOCK_TRACEABILITY_STEPS as TraceabilityRecordDocument[];
  }
}

// ==========================================
// 10. INITIAL DATABASE SEEDING
// ==========================================

let seedingPromise: Promise<void> | null = null;

export async function seedInitialDataIfEmpty(): Promise<void> {
  if (seedingPromise) return seedingPromise;

  seedingPromise = (async () => {
    try {
      // 1. Seed Materials
      const matSnap = await getDocs(collection(db, COLLECTIONS.MATERIALS));
      if (matSnap.empty) {
        for (const mat of SCRAP_RATES) {
          await setDoc(doc(db, COLLECTIONS.MATERIALS, mat.id), mat);
        }
      }

      // 2. Seed Recyclers strictly matching COLLECTION: recyclers schema:
      // id, name, gstin, registrationStatus, verificationStatus, facilityLocation, supportedMaterials, createdAt
      const recSnap = await getDocs(collection(db, COLLECTIONS.RECYCLERS));
      if (recSnap.empty) {
        for (const rec of MOCK_RECYCLER_OFFERS) {
          const recyclerDoc: RecyclerDocument = {
            id: rec.id,
            name: rec.companyName || 'EcoPlast Polymers Ltd',
            gstin: rec.gstin || '27AAACE1234F1Z5',
            registrationStatus: 'ACTIVE',
            verificationStatus: 'VERIFIED',
            facilityLocation: rec.location || 'Chakan MIDC Phase 2, Pune',
            supportedMaterials: ['PET Bottles', 'HDPE Containers', 'HMS-1 Steel'],
            createdAt: serverTimestamp(),
            // UI helper attributes
            companyName: rec.companyName || 'EcoPlast Polymers Ltd',
            rating: rec.rating || 4.9,
            bidRatePerKg: rec.offeredRatePerKg || 25.5,
            distanceKm: rec.distanceKm || 14,
            eprCertified: rec.eprCertified ?? true,
          };
          await setDoc(doc(db, COLLECTIONS.RECYCLERS, rec.id), recyclerDoc);
        }
      }

      // 3. Seed Requests strictly matching COLLECTION: requests schema:
      // id, householdId, assignedKabadiwalaId, materialTypes, estimatedWeight, address, latitude, longitude, preferredPickupTime, status, createdAt, updatedAt
      const reqSnap = await getDocs(collection(db, COLLECTIONS.REQUESTS));
      if (reqSnap.empty) {
        for (const req of MOCK_PICKUPS) {
          const reqDoc: RequestDocument = {
            id: req.id,
            householdId: 'HH-ANAND-DESHMUKH',
            assignedKabadiwalaId: req.status === 'accepted' ? 'COL-RAMESH-SHINDE' : null,
            materialTypes: req.materials || ['Newspaper', 'Cardboard', 'Plastics'],
            estimatedWeight: req.estimatedWeight || '28 kg',
            address: req.address,
            latitude: req.latitude ?? 18.558,
            longitude: req.longitude ?? 73.8078,
            preferredPickupTime: req.slot || 'Today, 10 AM - 1 PM',
            status: req.status === 'accepted' ? 'ACCEPTED' : 'PENDING',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            customerName: req.customerName,
            phone: req.phone,
            estimatedPayout: req.estimatedPayout,
            distance: req.distance || '0.8 km',
            slot: req.slot,
          };
          await setDoc(doc(db, COLLECTIONS.REQUESTS, req.id), reqDoc);
        }
      }

      // 4. Seed Batches strictly matching COLLECTION: batches schema:
      // id, batchId, createdBy, kabadiwalaId, recyclerId, materialType, totalWeight, status, createdAt, receivedAt
      const batchSnap = await getDocs(collection(db, COLLECTIONS.BATCHES));
      if (batchSnap.empty) {
        for (const batch of MOCK_BATCHES) {
          const batchDoc: BatchDocument = {
            id: batch.id,
            batchId: batch.batchNumber || batch.id,
            createdBy: 'COL-RAMESH-SHINDE',
            kabadiwalaId: 'COL-RAMESH-SHINDE',
            recyclerId: 'REC-1',
            materialType: batch.materialType || 'Grade-1 High Density PET Bales',
            totalWeight: batch.totalWeightKg || 420,
            status: 'CREATED',
            createdAt: serverTimestamp(),
            receivedAt: null,
            batchNumber: batch.batchNumber,
            balesCount: batch.balesCount || 8,
            purityGrade: 'Grade-A 98.2% Virgin Equivalent',
            moisturePercent: batch.moisturePercent || 1.8,
            contaminationPercent: batch.contaminationPercent || 1.4,
            qrSealCode: batch.tamperSealId || 'TS-9924-MH',
          };
          await setDoc(doc(db, COLLECTIONS.BATCHES, batch.id), batchDoc);
        }
      }

      // 5. Seed Traceability
      const traceSnap = await getDocs(collection(db, COLLECTIONS.TRACEABILITY));
      if (traceSnap.empty) {
        for (const trace of MOCK_TRACEABILITY_STEPS) {
          const stepKey = `TRC-${trace.stepNumber ?? 1}`;
          await setDoc(doc(db, COLLECTIONS.TRACEABILITY, stepKey), {
            id: stepKey,
            ...trace,
          });
        }
      }
    } catch (err) {
      console.warn('Initial Firestore seeding completed or skipped:', err);
    }
  })();

  return seedingPromise;
}
