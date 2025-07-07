import { InventoryItem } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

// Mock data for demo
const mockInventory: InventoryItem[] = [
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
	{
		id: '3',
		name: 'Blood Pressure Monitor',
		quantity: 5,
		cost: 1500.0,
		location: 'Equipment Room',
		expiryDate: new Date('2026-12-31'),
		purpose: 'Patient monitoring',
		category: 'equipment',
		minStockLevel: 2,
		unit: 'units',
		createdAt: new Date(),
		updatedAt: new Date(),
		createdBy: 'admin',
	},
];

// GET /api/inventory
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') ?? '1');
		const limit = parseInt(searchParams.get('limit') ?? '10');
		const search = searchParams.get('search') ?? '';
		const category = searchParams.get('category') ?? '';
		const location = searchParams.get('location') ?? '';
		const sortBy = searchParams.get('sortBy') ?? 'createdAt';
		const sortOrder = searchParams.get('sortOrder') ?? 'desc';

		let filteredData = [...mockInventory];

		// Apply filters
		if (search) {
			filteredData = filteredData.filter((item) =>
				item.name.toLowerCase().includes(search.toLowerCase())
			);
		}
		if (category) {
			filteredData = filteredData.filter(
				(item) => item.category === category
			);
		}
		if (location) {
			filteredData = filteredData.filter((item) =>
				item.location.toLowerCase().includes(location.toLowerCase())
			);
		}

		// Apply sorting
		filteredData.sort((a, b) => {
			const aValue = a[sortBy as keyof InventoryItem] ?? '';
			const bValue = b[sortBy as keyof InventoryItem] ?? '';

			if (sortOrder === 'asc') {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		// Apply pagination
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedData = filteredData.slice(startIndex, endIndex);

		return NextResponse.json({
			success: true,
			data: paginatedData,
			pagination: {
				page,
				limit,
				total: filteredData.length,
				totalPages: Math.ceil(filteredData.length / limit),
			},
		});
	} catch (error) {
		console.error('Error fetching inventory:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// POST /api/inventory
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			name,
			quantity,
			cost,
			location,
			expiryDate,
			donor,
			purpose,
			category,
			minStockLevel,
			unit,
		} = body;

		// Validate required fields
		if (
			!name ||
			!quantity ||
			!location ||
			!expiryDate ||
			!purpose ||
			!category ||
			!unit
		) {
			return NextResponse.json(
				{ success: false, error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const newItem: InventoryItem = {
			id: (mockInventory.length + 1).toString(),
			name,
			quantity: parseInt(quantity),
			cost: parseFloat(cost) || 0,
			location,
			expiryDate: new Date(expiryDate),
			donor: donor || '',
			purpose,
			category,
			minStockLevel: parseInt(minStockLevel) || 0,
			unit,
			createdAt: new Date(),
			updatedAt: new Date(),
			createdBy: 'admin',
		};

		mockInventory.push(newItem);

		return NextResponse.json({
			success: true,
			data: newItem,
			message: 'Item added successfully',
		});
	} catch (error) {
		console.error('Error adding inventory item:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
