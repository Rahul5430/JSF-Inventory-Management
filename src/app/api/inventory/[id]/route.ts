import { firestore } from '@/lib/firebase';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/inventory/[id]
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	if (!firestore)
		return NextResponse.json(
			{ success: false, error: 'Firestore not initialized' },
			{ status: 500 }
		);
	try {
		const { id } = await params;
		if (!id)
			return NextResponse.json(
				{ success: false, error: 'Item ID is required' },
				{ status: 400 }
			);
		const docRef = doc(firestore, 'inventory', id);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists())
			return NextResponse.json(
				{ success: false, error: 'Item not found' },
				{ status: 404 }
			);
		const data = docSnap.data() as any;
		return NextResponse.json({
			success: true,
			data: {
				id: docSnap.id,
				...data,
				expiryDate: data.expiryDate?.toDate
					? data.expiryDate.toDate()
					: data.expiryDate,
				createdAt: data.createdAt?.toDate
					? data.createdAt.toDate()
					: data.createdAt,
				updatedAt: data.updatedAt?.toDate
					? data.updatedAt.toDate()
					: data.updatedAt,
			},
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
	if (!firestore)
		return NextResponse.json(
			{ success: false, error: 'Firestore not initialized' },
			{ status: 500 }
		);
	try {
		const { id } = await params;
		const body = await request.json();
		if (!id)
			return NextResponse.json(
				{ success: false, error: 'Item ID is required' },
				{ status: 400 }
			);
		const docRef = doc(firestore, 'inventory', id);
		await updateDoc(docRef, { ...body, updatedAt: new Date() });
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
	if (!firestore)
		return NextResponse.json(
			{ success: false, error: 'Firestore not initialized' },
			{ status: 500 }
		);
	try {
		const { id } = await params;
		if (!id)
			return NextResponse.json(
				{ success: false, error: 'Item ID is required' },
				{ status: 400 }
			);
		const docRef = doc(firestore, 'inventory', id);
		await deleteDoc(docRef);
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
