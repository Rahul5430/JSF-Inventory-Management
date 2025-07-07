'use client';

import { User, UserRole } from '@/types';
import {
	User as FirebaseUser,
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextType {
	user: User | null;
	firebaseUser: FirebaseUser | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy user for demo purposes
const dummyUser: User = {
	id: 'demo-user-id',
	name: 'Demo Admin',
	email: 'admin@jsf.org',
	role: 'admin',
	createdAt: new Date(),
};

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(dummyUser); // Set dummy user by default
	const [firebaseUser] = useState<FirebaseUser | null>(null);
	const [loading, setLoading] = useState(false); // Set to false since we have dummy user

	// Skip Firebase authentication for demo
	useEffect(() => {
		// Set dummy user immediately for demo
		setUser(dummyUser);
		setLoading(false);
	}, []);

	const signIn = async () => {
		// For demo, just set the dummy user
		setUser(dummyUser);
		return Promise.resolve();
	};

	const signUp = async () => {
		// For demo, just set the dummy user
		setUser(dummyUser);
		return Promise.resolve();
	};

	const logout = async () => {
		// For demo, just set the dummy user back
		setUser(dummyUser);
		return Promise.resolve();
	};

	const value = useMemo(() => ({
		user,
		firebaseUser,
		loading,
		signIn,
		signUp,
		logout,
	}), [user, firebaseUser, loading]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
} 