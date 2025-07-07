import { type ClassValue, clsx } from 'clsx';
import { addDays, format, isAfter, isBefore } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return format(dateObj, 'dd/MM/yyyy');
}

export function formatDateTime(date: Date | string): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return format(dateObj, 'dd/MM/yyyy HH:mm');
}

export function isExpiringSoon(
	date: Date | string,
	days: number = 30
): boolean {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	const threshold = addDays(new Date(), days);
	return isBefore(dateObj, threshold) && isAfter(dateObj, new Date());
}

export function isExpired(date: Date | string): boolean {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return isBefore(dateObj, new Date());
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
	}).format(amount);
}

export function generateId(): string {
	return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
	const phoneRegex = /^[6-9]\d{9}$/;
	return phoneRegex.test(phone);
}

export function getSeverityColor(severity: 'low' | 'medium' | 'high'): string {
	switch (severity) {
		case 'low':
			return 'text-yellow-600 bg-yellow-100';
		case 'medium':
			return 'text-orange-600 bg-orange-100';
		case 'high':
			return 'text-red-600 bg-red-100';
		default:
			return 'text-gray-600 bg-gray-100';
	}
}

export function getRoleColor(role: string): string {
	switch (role) {
		case 'admin':
			return 'bg-red-100 text-red-800';
		case 'coordinator':
			return 'bg-blue-100 text-blue-800';
		case 'doctor':
			return 'bg-green-100 text-green-800';
		case 'nurse':
			return 'bg-purple-100 text-purple-800';
		case 'volunteer':
			return 'bg-yellow-100 text-yellow-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
}

export function getCategoryColor(category: string): string {
	switch (category) {
		case 'medicine':
			return 'bg-blue-100 text-blue-800';
		case 'equipment':
			return 'bg-green-100 text-green-800';
		case 'supplies':
			return 'bg-yellow-100 text-yellow-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
}
