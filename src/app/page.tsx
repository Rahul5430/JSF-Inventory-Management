'use client';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, isExpired, isExpiringSoon } from '@/lib/utils';
import { InventoryItem, StaffMember } from '@/types';
import {
	AlertTriangle,
	Calendar,
	Package,
	TrendingUp,
	Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
	const { t, ready } = useTranslation();
	const { user } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		totalInventory: 0,
		totalStaff: 0,
		lowStockItems: 0,
		expiringItems: 0,
		totalValue: 0,
	});
	const [recentInventory, setRecentInventory] = useState<InventoryItem[]>([]);
	const [recentStaff, setRecentStaff] = useState<StaffMember[]>([]);

	useEffect(() => {
		// For demo purposes, set some dummy data
		setStats({
			totalInventory: 150,
			totalStaff: 25,
			lowStockItems: 8,
			expiringItems: 12,
			totalValue: 45000,
		});
		
		// Set dummy inventory data
		setRecentInventory([
			{
				id: '1',
				name: 'Paracetamol 500mg',
				quantity: 50,
				cost: 2.5,
				location: 'Medical Store A',
				expiryDate: new Date('2024-12-31'),
				purpose: 'Pain relief',
				category: 'medicine',
				minStockLevel: 20,
				unit: 'tablets',
				createdAt: new Date(),
				updatedAt: new Date(),
				createdBy: 'admin',
			},
			{
				id: '2',
				name: 'Surgical Masks',
				quantity: 200,
				cost: 1.0,
				location: 'Medical Store B',
				expiryDate: new Date('2025-06-30'),
				purpose: 'Protection',
				category: 'supplies',
				minStockLevel: 100,
				unit: 'pieces',
				createdAt: new Date(),
				updatedAt: new Date(),
				createdBy: 'admin',
			},
		]);
		
		// Set dummy staff data
		setRecentStaff([
			{
				id: '1',
				name: 'Dr. Sarah Johnson',
				role: 'doctor',
				specialty: 'General Medicine',
				shiftStart: '09:00',
				shiftEnd: '17:00',
				patientsServed: 45,
				location: 'Clinic A',
				contactNumber: '+91-9876543210',
				email: 'sarah.johnson@jsf.org',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: '2',
				name: 'Nurse Priya Sharma',
				role: 'nurse',
				specialty: 'Emergency Care',
				shiftStart: '08:00',
				shiftEnd: '16:00',
				patientsServed: 38,
				location: 'Clinic B',
				contactNumber: '+91-9876543211',
				email: 'priya.sharma@jsf.org',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
		
		setLoading(false);
	}, []);

	const getStatusColor = (item: InventoryItem) => {
		if (isExpired(item.expiryDate)) return 'text-red-600';
		if (isExpiringSoon(item.expiryDate, 30)) return 'text-yellow-600';
		return 'text-green-600';
	};

	const getStatusText = (item: InventoryItem) => {
		if (isExpired(item.expiryDate)) return 'Expired';
		if (isExpiringSoon(item.expiryDate, 30)) return 'Expiring Soon';
		return 'Good';
	};

	if (loading || !ready) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="flex items-center justify-center h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			
			<div className="lg:pl-64">
				<Header onMenuToggle={() => setSidebarOpen(true)} />
				
				<main className="p-6">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">
							{t('nav.dashboard')}
						</h1>
						<p className="text-gray-600">
							Welcome back, {user?.name}! Here&apos;s what&apos;s happening today.
						</p>
					</div>

					{/* Statistics Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Inventory
								</CardTitle>
								<Package className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.totalInventory}</div>
								<p className="text-xs text-muted-foreground">
									Items in stock
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Staff
								</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.totalStaff}</div>
								<p className="text-xs text-muted-foreground">
									Active members
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Low Stock Alerts
								</CardTitle>
								<AlertTriangle className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-yellow-600">
									{stats.lowStockItems}
								</div>
								<p className="text-xs text-muted-foreground">
									Items need restocking
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Value
								</CardTitle>
								<TrendingUp className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{formatCurrency(stats.totalValue)}
								</div>
								<p className="text-xs text-muted-foreground">
									Inventory worth
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Recent Activity */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Recent Inventory */}
						<Card>
							<CardHeader>
								<CardTitle>Recent Inventory Items</CardTitle>
								<CardDescription>
									Latest items added to inventory
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{recentInventory.map((item) => (
										<div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
											<div className="flex items-center space-x-3">
												<div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
													<Package className="h-5 w-5 text-blue-600" />
												</div>
												<div>
													<p className="font-medium text-sm">{item.name}</p>
													<p className="text-xs text-gray-500">
														{item.quantity} {item.unit} • {item.location}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium">{formatCurrency(item.cost)}</p>
												<p className={`text-xs ${getStatusColor(item)}`}>
													{getStatusText(item)}
												</p>
											</div>
										</div>
									))}
								</div>
								<div className="mt-4">
									<Button variant="outline" className="w-full">
										View All Inventory
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Recent Staff */}
						<Card>
							<CardHeader>
								<CardTitle>Recent Staff Members</CardTitle>
								<CardDescription>
									Latest staff members added
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{recentStaff.map((member) => (
										<div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
											<div className="flex items-center space-x-3">
												<div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
													<Users className="h-5 w-5 text-green-600" />
												</div>
												<div>
													<p className="font-medium text-sm">{member.name}</p>
													<p className="text-xs text-gray-500 capitalize">
														{member.role} • {member.location}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium">{member.patientsServed}</p>
												<p className="text-xs text-gray-500">Patients served</p>
											</div>
										</div>
									))}
								</div>
								<div className="mt-4">
									<Button variant="outline" className="w-full">
										View All Staff
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Quick Actions */}
					<div className="mt-8">
						<Card>
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
								<CardDescription>
									Common tasks and shortcuts
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<Button className="h-20 flex-col space-y-2">
										<Package className="h-6 w-6" />
										<span>Add Inventory Item</span>
									</Button>
									<Button className="h-20 flex-col space-y-2">
										<Users className="h-6 w-6" />
										<span>Add Staff Member</span>
									</Button>
									<Button className="h-20 flex-col space-y-2">
										<Calendar className="h-6 w-6" />
										<span>View Reports</span>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</main>
			</div>
		</div>
	);
};

export default DashboardPage;
