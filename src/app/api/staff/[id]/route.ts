import { firestore } from '@/lib/firebase';
import { StaffMember } from '@/types';
import {
	deleteDoc,
	doc,
	getDoc,
	serverTimestamp,
	updateDoc,
} from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/staff/[id]
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const docRef = doc(firestore, 'staff', id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return NextResponse.json(
				{ success: false, error: 'Staff member not found' },
				{ status: 404 }
			);
		}

		const data = docSnap.data();
		const staffMember: StaffMember = {
			id: docSnap.id,
			...data,
			createdAt: data.createdAt?.toDate(),
			updatedAt: data.updatedAt?.toDate(),
		} as StaffMember;

		return NextResponse.json({
			success: true,
			data: staffMember,
		});
	} catch (error) {
		console.error('Error fetching staff member:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch staff member' },
			{ status: 500 }
		);
	}
}

// PUT /api/staff/[id]
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const body = await request.json();
		const {
			name,
			role,
			specialty,
			shiftStart,
			shiftEnd,
			patientsServed,
			location,
			contactNumber,
			email,
			isActive,
		} = body;

		// Validate required fields
		if (
			!name ||
			!role ||
			!shiftStart ||
			!shiftEnd ||
			!location ||
			!contactNumber ||
			!email
		) {
			return NextResponse.json(
				{ success: false, error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const docRef = doc(firestore, 'staff', id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return NextResponse.json(
				{ success: false, error: 'Staff member not found' },
				{ status: 404 }
			);
		}

		const updateData = {
			name,
			role,
			specialty: specialty || '',
			shiftStart,
			shiftEnd,
			patientsServed: Number(patientsServed) || 0,
			location,
			contactNumber,
			email,
			isActive: isActive !== undefined ? Boolean(isActive) : true,
			updatedAt: serverTimestamp(),
		};

		await updateDoc(docRef, updateData);

		return NextResponse.json({
			success: true,
			data: { id, ...updateData },
			message: 'Staff member updated successfully',
		});
	} catch (error) {
		console.error('Error updating staff member:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update staff member' },
			{ status: 500 }
		);
	}
}

// DELETE /api/staff/[id]
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const docRef = doc(firestore, 'staff', id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return NextResponse.json(
				{ success: false, error: 'Staff member not found' },
				{ status: 404 }
			);
		}

		await deleteDoc(docRef);

		return NextResponse.json({
			success: true,
			message: 'Staff member deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting staff member:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to delete staff member' },
			{ status: 500 }
		);
	}
}
