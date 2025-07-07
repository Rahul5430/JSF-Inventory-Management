import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain:
		process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId:
		process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket:
		process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId:
		process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId:
		process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let firestore: Firestore | null;
let auth;
let storage;

try {
	app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

	// Initialize Firebase services
	firestore = getFirestore(app);
	auth = getAuth(app);
	storage = getStorage(app);
} catch (error) {
	console.error('Firebase initialization error:', error);

	// Create mock objects for development
	// if (process.env.NODE_ENV === 'development') {
	// 	console.warn('Using mock Firebase services for development');
	// 	// app = null;
	// 	// firestore = null;
	// 	auth = null;
	// 	// storage = null;
	// }
}

export { auth, firestore, storage };
export default app;
