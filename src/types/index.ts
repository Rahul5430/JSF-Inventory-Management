// types/index.ts

export type UserRole = 'admin' | 'coordinator' | 'volunteer';

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	location?: string;
	createdAt: Date;
	lastLogin?: Date;
}

export interface InventoryItem {
	id: string;
	name: string;
	quantity: number;
	cost: number;
	location: string;
	expiryDate: Date;
	donor?: string;
	purpose: string;
	category: 'medicine' | 'equipment' | 'supplies';
	minStockLevel: number;
	unit: string;
	createdAt: Date;
	updatedAt: Date;
	createdBy: string;
}

export interface StaffMember {
	id: string;
	name: string;
	role: 'doctor' | 'nurse' | 'volunteer' | 'coordinator' | 'admin';
	specialty?: string;
	shiftStart: string;
	shiftEnd: string;
	patientsServed: number;
	location: string;
	contactNumber: string;
	email: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Alert {
	id: string;
	type: 'low_stock' | 'expiry' | 'system';
	title: string;
	message: string;
	severity: 'low' | 'medium' | 'high';
	isRead: boolean;
	createdAt: Date;
	relatedItemId?: string;
}

export interface Report {
	id: string;
	type: 'inventory' | 'staff' | 'usage';
	title: string;
	data: any;
	generatedAt: Date;
	generatedBy: string;
}

export interface Location {
	id: string;
	name: string;
	address: string;
	coordinatorId: string;
	isActive: boolean;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginationParams {
	page: number;
	limit: number;
	search?: string;
	filter?: Record<string, any>;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
