import { firestore } from '@/lib/firebase';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/staff/[id]
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
				{ success: false, error: 'Staff ID is required' },
				{ status: 400 }
			);
		const docRef = doc(firestore, 'staff', id);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists())
			return NextResponse.json(
				{ success: false, error: 'Staff member not found' },
				{ status: 404 }
			);
		const data = docSnap.data() as any;
		return NextResponse.json({
			success: true,
			data: {
				id: docSnap.id,
				...data,
				createdAt: data.createdAt?.toDate
					? data.createdAt.toDate()
					: data.createdAt,
				updatedAt: data.updatedAt?.toDate
					? data.updatedAt.toDate()
					: data.updatedAt,
			},
		});
	} catch (error) {
		console.error('Error fetching staff member:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// PUT /api/staff/[id]
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
				{ success: false, error: 'Staff ID is required' },
				{ status: 400 }
			);
		const docRef = doc(firestore, 'staff', id);
		await updateDoc(docRef, { ...body, updatedAt: new Date() });
		return NextResponse.json({
			success: true,
			message: 'Staff member updated successfully',
		});
	} catch (error) {
		console.error('Error updating staff member:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// DELETE /api/staff/[id]
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
				{ success: false, error: 'Staff ID is required' },
				{ status: 400 }
			);
		const docRef = doc(firestore, 'staff', id);
		await deleteDoc(docRef);
		return NextResponse.json({
			success: true,
			message: 'Staff member deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting staff member:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
