import { firestore } from '@/lib/firebase';
import { InventoryItem } from '@/types';
import {
	deleteDoc,
	doc,
	getDoc,
	serverTimestamp,
	updateDoc,
} from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/inventory/[id]
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const docRef = doc(firestore, 'inventory', id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return NextResponse.json(
				{ success: false, error: 'Inventory item not found' },
				{ status: 404 }
			);
		}

		const data = docSnap.data();
		const inventoryItem: InventoryItem = {
			id: docSnap.id,
			...data,
			createdAt: data.createdAt?.toDate(),
			updatedAt: data.updatedAt?.toDate(),
			expiryDate: data.expiryDate?.toDate(),
		} as InventoryItem;

		return NextResponse.json({
			success: true,
			data: inventoryItem,
		});
	} catch (error) {
		console.error('Error fetching inventory item:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch inventory item' },
			{ status: 500 }
		);
	}
}

// PUT /api/inventory/[id]
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
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

		const docRef = doc(firestore, 'inventory', id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return NextResponse.json(
				{ success: false, error: 'Inventory item not found' },
				{ status: 404 }
			);
		}

		const updateData = {
			name,
			quantity: Number(quantity),
			cost: Number(cost) || 0,
			location,
			expiryDate: new Date(expiryDate),
			donor: donor || '',
			purpose,
			category,
			minStockLevel: Number(minStockLevel) || 0,
			unit,
			updatedAt: serverTimestamp(),
		};

		await updateDoc(docRef, updateData);

		return NextResponse.json({
			success: true,
			data: { id, ...updateData },
			message: 'Inventory item updated successfully',
		});
	} catch (error) {
		console.error('Error updating inventory item:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update inventory item' },
			{ status: 500 }
		);
	}
}

// DELETE /api/inventory/[id]
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const docRef = doc(firestore, 'inventory', id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return NextResponse.json(
				{ success: false, error: 'Inventory item not found' },
				{ status: 404 }
			);
		}

		await deleteDoc(docRef);

		return NextResponse.json({
			success: true,
			message: 'Inventory item deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting inventory item:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to delete inventory item' },
			{ status: 500 }
		);
	}
}
