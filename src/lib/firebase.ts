import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Named Firestore Database instance with long polling enabled to prevent backend unavailable connection drops in iframe/Cloud Run environments
export const db = (() => {
  try {
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId || undefined
    );
  } catch (_e) {
    return firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
})();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Handled:', JSON.stringify(errInfo));
  return errInfo;
}

// Proactive connection validation
async function validateFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline/cached mode until backend reconnects.');
    }
  }
}
validateFirestoreConnection();

/**
 * Sign in with Google (Popup with fallback for iframes)
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      // Sync or create user record in Firestore
      await syncUserProfile(user);
    }
    return user;
  } catch (error: any) {
    console.warn('Popup sign in encountered error, attempting fallback:', error);
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectError) {
        console.error('Redirect sign in failed:', redirectError);
        throw redirectError;
      }
    } else {
      throw error;
    }
  }
}

/**
 * Sign out
 */
export async function logOut() {
  return signOut(auth);
}

/**
 * Sync user profile to Firestore
 */
export async function syncUserProfile(user: FirebaseUser, additionalData?: { role?: string; bio?: string }) {
  if (!user.uid) return;
  const userRef = doc(db, 'users', user.uid);
  try {
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Builder',
        photoURL: user.photoURL || '',
        role: additionalData?.role || 'follower',
        bio: additionalData?.bio || 'Tech builder & OgojiPulse community member',
        headline: 'AI & SQA Enthusiast',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    } else {
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        ...(additionalData || {}),
      });
    }
  } catch (err) {
    console.error('Failed to sync user profile:', err);
  }
}

/**
 * Firestore Bookings
 */
export async function createFirestoreBooking(bookingData: {
  userId?: string;
  clientName: string;
  clientEmail: string;
  serviceId: string;
  serviceTitle: string;
  priceNgn: number;
  priceUsd: number;
  paymentMethod: 'palmpay' | 'usdt';
  proofOfPaymentNote?: string;
}) {
  try {
    const bookingsCol = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCol, {
      ...bookingData,
      status: 'pending_verification',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.error('Failed to write booking to Firestore:', err);
    return null;
  }
}

export function subscribeToBookings(onUpdate: (bookings: any[]) => void) {
  try {
    const bookingsCol = collection(db, 'bookings');
    const q = query(bookingsCol, orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'bookings');
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'bookings');
    return () => {};
  }
}

/**
 * Firestore Discussions
 */
export async function createFirestoreDiscussion(data: {
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
}) {
  try {
    const discussionsCol = collection(db, 'discussions');
    const docRef = await addDoc(discussionsCol, {
      ...data,
      likes: 0,
      repliesCount: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'discussions');
    return null;
  }
}

export function subscribeToDiscussions(onUpdate: (discussions: any[]) => void) {
  try {
    const discussionsCol = collection(db, 'discussions');
    const q = query(discussionsCol, orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'discussions');
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'discussions');
    return () => {};
  }
}

/**
 * Firestore Community QA Questions
 */
export async function createFirestoreQAQuestion(data: {
  authorId?: string;
  authorName: string;
  questionText: string;
  category: string;
}) {
  try {
    const qaCol = collection(db, 'qa_questions');
    const docRef = await addDoc(qaCol, {
      ...data,
      upvotes: 1,
      status: 'open',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'qa_questions');
    return null;
  }
}

export function subscribeToQAQuestions(onUpdate: (questions: any[]) => void) {
  try {
    const qaCol = collection(db, 'qa_questions');
    const q = query(qaCol, orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'qa_questions');
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'qa_questions');
    return () => {};
  }
}

/**
 * Social Media Engagement Campaigns & Boosts
 */
export async function createFirestoreEngagementCampaign(data: {
  userId?: string;
  authorName: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'X/Twitter' | 'LinkedIn' | 'Snapchat';
  postUrl: string;
  packageType: string;
  notes?: string;
  targetInteractions?: number;
}) {
  try {
    const col = collection(db, 'engagement_campaigns');
    const docRef = await addDoc(col, {
      ...data,
      interactionsDelivered: 0,
      status: 'active',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'engagement_campaigns');
    return null;
  }
}

export function subscribeToEngagementCampaigns(onUpdate: (campaigns: any[]) => void) {
  try {
    const col = collection(db, 'engagement_campaigns');
    const q = query(col, orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'engagement_campaigns');
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'engagement_campaigns');
    return () => {};
  }
}

/**
 * Newsletter Subscribers for OgojiPulse Updates
 */
export interface NewsletterSubscriptionInput {
  email: string;
  name?: string;
  source?: string;
  interests?: string[];
}

export interface NewsletterSubscriptionResult {
  success: boolean;
  message: string;
  alreadySubscribed?: boolean;
  subscriberId?: string;
}

export async function subscribeToNewsletter(
  data: NewsletterSubscriptionInput
): Promise<NewsletterSubscriptionResult> {
  const cleanEmail = (data.email || '').trim().toLowerCase();
  
  // Basic validation
  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    };
  }

  try {
    const subscribersCol = collection(db, 'newsletter_subscribers');

    // Check if subscriber already exists
    try {
      const q = query(subscribersCol, where('email', '==', cleanEmail), limit(1));
      const existingSnapshot = await getDocs(q);

      if (!existingSnapshot.empty) {
        const existingDoc = existingSnapshot.docs[0];
        const existingData = existingDoc.data();

        // If previously unsubscribed, reactivate
        if (existingData.status === 'unsubscribed') {
          await updateDoc(doc(db, 'newsletter_subscribers', existingDoc.id), {
            status: 'subscribed',
            interests: data.interests || existingData.interests || [],
            reactivatedAt: serverTimestamp(),
          });
          return {
            success: true,
            alreadySubscribed: false,
            subscriberId: existingDoc.id,
            message: "Welcome back! Your subscription to OgojiPulse updates has been reactivated.",
          };
        }

        return {
          success: true,
          alreadySubscribed: true,
          subscriberId: existingDoc.id,
          message: "You're already subscribed to OgojiPulse updates with this email!",
        };
      }
    } catch (checkErr) {
      console.warn('Existing subscriber lookup skipped:', checkErr);
      // Fall through to addDoc
    }

    // Add new subscriber
    const docRef = await addDoc(subscribersCol, {
      email: cleanEmail,
      name: data.name?.trim() || '',
      source: data.source || 'footer',
      interests: data.interests || ['General Updates', 'AI Prompts', 'SQA Workflows'],
      status: 'subscribed',
      userId: auth.currentUser?.uid || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Also persist a backup flag in localStorage so browser remembers
    try {
      localStorage.setItem('ogojipulse_subscribed_email', cleanEmail);
    } catch {
      // ignore
    }

    return {
      success: true,
      alreadySubscribed: false,
      subscriberId: docRef.id,
      message: "🎉 You're in! Check your inbox soon for Victor's weekly AI & tech updates.",
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'newsletter_subscribers');
    
    // Save to local fallback in case network/offline occurs
    try {
      const localSubs = JSON.parse(localStorage.getItem('ogojipulse_local_subscribers') || '[]');
      localSubs.push({
        email: cleanEmail,
        createdAt: new Date().toISOString(),
        source: data.source || 'footer',
      });
      localStorage.setItem('ogojipulse_local_subscribers', JSON.stringify(localSubs));
      localStorage.setItem('ogojipulse_subscribed_email', cleanEmail);
      return {
        success: true,
        alreadySubscribed: false,
        message: "You're subscribed! (Cached locally and will sync once connected).",
      };
    } catch {
      return {
        success: false,
        message: 'Unable to subscribe at this moment. Please try again.',
      };
    }
  }
}

export function subscribeToNewsletterSubscribers(onUpdate: (subs: any[]) => void) {
  try {
    const col = collection(db, 'newsletter_subscribers');
    const q = query(col, orderBy('createdAt', 'desc'), limit(100));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'newsletter_subscribers');
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'newsletter_subscribers');
    return () => {};
  }
}



