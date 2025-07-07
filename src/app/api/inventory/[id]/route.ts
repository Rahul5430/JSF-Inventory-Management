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
];

// GET /api/inventory/[id]
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Item ID is required' },
				{ status: 400 }
			);
		}

		const item = mockInventory.find((item) => item.id === id);

		if (!item) {
			return NextResponse.json(
				{ success: false, error: 'Item not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: item,
		});
	} catch (error) {
		console.error('Error fetching inventory item:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// PUT /api/inventory/[id]
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await request.json();

		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Item ID is required' },
				{ status: 400 }
			);
		}

		const itemIndex = mockInventory.findIndex((item) => item.id === id);

		if (itemIndex === -1) {
			return NextResponse.json(
				{ success: false, error: 'Item not found' },
				{ status: 404 }
			);
		}

		// Update the item
		mockInventory[itemIndex] = {
			...mockInventory[itemIndex],
			...body,
			updatedAt: new Date(),
		};

		return NextResponse.json({
			success: true,
			message: 'Item updated successfully',
		});
	} catch (error) {
		console.error('Error updating inventory item:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// DELETE /api/inventory/[id]
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Item ID is required' },
				{ status: 400 }
			);
		}

		const itemIndex = mockInventory.findIndex((item) => item.id === id);

		if (itemIndex === -1) {
			return NextResponse.json(
				{ success: false, error: 'Item not found' },
				{ status: 404 }
			);
		}

		// Remove the item
		mockInventory.splice(itemIndex, 1);

		return NextResponse.json({
			success: true,
			message: 'Item deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting inventory item:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
