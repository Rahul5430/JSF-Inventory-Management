import { firestore } from '@/lib/firebase';
import { StaffMember } from '@/types';
import {
	addDoc,
	collection,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	startAfter,
	where,
} from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/staff
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') ?? '1');
		const limit = parseInt(searchParams.get('limit') ?? '10');
		const search = searchParams.get('search') ?? '';
		const role = searchParams.get('role') ?? '';
		const location = searchParams.get('location') ?? '';
		const isActive = searchParams.get('isActive');
		const sortBy = searchParams.get('sortBy') ?? 'createdAt';
		const sortOrder = searchParams.get('sortOrder') ?? 'desc';

		const staffRef = collection(firestore, 'staff');
		let q = query(staffRef);

		// Apply filters
		if (search) {
			q = query(
				q,
				where('name', '>=', search),
				where('name', '<=', search + '\uf8ff')
			);
		}
		if (role) {
			q = query(q, where('role', '==', role));
		}
		if (location) {
			q = query(q, where('location', '==', location));
		}
		if (isActive !== null && isActive !== undefined) {
			q = query(q, where('isActive', '==', isActive === 'true'));
		}

		// Apply sorting
		q = query(q, orderBy(sortBy, sortOrder as 'asc' | 'desc'));

		// Apply pagination
		const offset = (page - 1) * limit;
		if (offset > 0) {
			// For pagination, we need to get the last document from previous page
			const prevQuery = query(q, limit(offset));
			const prevDocs = await getDocs(prevQuery);
			const lastDoc = prevDocs.docs[prevDocs.docs.length - 1];
			if (lastDoc) {
				q = query(q, startAfter(lastDoc), limit(limit));
			}
		} else {
			q = query(q, limit(limit));
		}

		const snapshot = await getDocs(q);
		const staff: StaffMember[] = [];

		snapshot.forEach((doc) => {
			const data = doc.data();
			staff.push({
				id: doc.id,
				...data,
				createdAt: data.createdAt?.toDate(),
				updatedAt: data.updatedAt?.toDate(),
			} as StaffMember);
		});

		// Get total count for pagination
		const totalQuery = query(staffRef);
		const totalSnapshot = await getDocs(totalQuery);
		const total = totalSnapshot.size;

		return NextResponse.json({
			success: true,
			data: staff,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error('Error fetching staff:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch staff' },
			{ status: 500 }
		);
	}
}

// POST /api/staff
export async function POST(request: NextRequest) {
	try {
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

		const staffData = {
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
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		};

		const docRef = await addDoc(collection(firestore, 'staff'), staffData);

		return NextResponse.json({
			success: true,
			data: { id: docRef.id, ...staffData },
			message: 'Staff member added successfully',
		});
	} catch (error) {
		console.error('Error adding staff member:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to add staff member' },
			{ status: 500 }
		);
	}
}
