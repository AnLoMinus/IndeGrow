import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with experimentalForceLongPolling to fix connection issues in sandboxed environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create user profile if it doesn't exist
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'user',
        tokenBalance: 500000, // starting tokens for free users (e.g. 500K)
        createdAt: new Date().toISOString(),
        isOnline: true,
        lastActive: new Date().toISOString(),
      });
    } else {
      // update last active
      await setDoc(userRef, {
        isOnline: true,
        lastActive: new Date().toISOString()
      }, { merge: true });
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

export const logout = async () => {
  if (auth.currentUser) {
    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      isOnline: false,
      lastActive: new Date().toISOString()
    }, { merge: true });
  }
  return signOut(auth);
};
