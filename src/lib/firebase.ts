import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Check if Firebase config environment variables are set
const requiredEnvVars = [
	'NEXT_PUBLIC_FIREBASE_API_KEY',
	'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
	'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
	'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
	'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
	'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
	console.warn(
		'Missing Firebase environment variables:',
		missingEnvVars.join(', ')
	);
	console.warn(
		'Please create a .env.local file with your Firebase configuration.'
	);
}

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'placeholder-api-key',
	authDomain:
		process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
		'placeholder.firebaseapp.com',
	projectId:
		process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'placeholder-project',
	storageBucket:
		process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
		'placeholder.appspot.com',
	messagingSenderId:
		process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
	appId:
		process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
		'1:123456789:web:placeholder',
};

// Initialize Firebase only if we have valid config
let app;
let firestore;
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
	if (process.env.NODE_ENV === 'development') {
		console.warn('Using mock Firebase services for development');
		app = null;
		firestore = null;
		auth = null;
		storage = null;
	}
}

export { auth, firestore, storage };
export default app;
