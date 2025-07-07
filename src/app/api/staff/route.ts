import { firestore } from '@/lib/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/staff
export async function GET(request: NextRequest) {
	if (!firestore)
		return NextResponse.json(
			{ success: false, error: 'Firestore not initialized' },
			{ status: 500 }
		);
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') ?? '1');
		const limitVal = parseInt(searchParams.get('limit') ?? '10');
		const search = searchParams.get('search') ?? '';
		const role = searchParams.get('role') ?? '';
		const location = searchParams.get('location') ?? '';
		const isActive = searchParams.get('isActive');
		const sortBy = searchParams.get('sortBy') ?? 'createdAt';
		const sortOrder = searchParams.get('sortOrder') ?? 'desc';

		const q = collection(firestore, 'staff');
		const staffQuery = q;
		const snapshot = await getDocs(staffQuery);
		let data = snapshot.docs.map((doc) => {
			const d = doc.data() as any;
			return {
				id: doc.id,
				...d,
				createdAt: d.createdAt?.toDate
					? d.createdAt.toDate()
					: d.createdAt,
				updatedAt: d.updatedAt?.toDate
					? d.updatedAt.toDate()
					: d.updatedAt,
			};
		});
		if (search)
			data = data.filter((member) =>
				member.name.toLowerCase().includes(search.toLowerCase())
			);
		if (role) data = data.filter((member) => member.role === role);
		if (location)
			data = data.filter((member) =>
				member.location.toLowerCase().includes(location.toLowerCase())
			);
		if (isActive !== null) {
			const activeFilter = isActive === 'true';
			data = data.filter((member) => member.isActive === activeFilter);
		}
		data.sort((a, b) => {
			const aValue = a[sortBy] ?? '';
			const bValue = b[sortBy] ?? '';
			if (sortOrder === 'asc') return aValue > bValue ? 1 : -1;
			else return aValue < bValue ? 1 : -1;
		});
		const startIndex = (page - 1) * limitVal;
		const endIndex = startIndex + limitVal;
		const paginatedData = data.slice(startIndex, endIndex);
		return NextResponse.json({
			success: true,
			data: paginatedData,
			pagination: {
				page,
				limit: limitVal,
				total: data.length,
				totalPages: Math.ceil(data.length / limitVal),
			},
		});
	} catch (error) {
		console.error('Error fetching staff:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// POST /api/staff
export async function POST(request: NextRequest) {
	if (!firestore)
		return NextResponse.json(
			{ success: false, error: 'Firestore not initialized' },
			{ status: 500 }
		);
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
		const newStaff = {
			name,
			role,
			specialty: specialty || '',
			shiftStart,
			shiftEnd,
			patientsServed: parseInt(patientsServed) || 0,
			location,
			contactNumber,
			email,
			isActive: typeof isActive === 'boolean' ? isActive : true,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		const docRef = await addDoc(collection(firestore, 'staff'), newStaff);
		return NextResponse.json({
			success: true,
			data: { id: docRef.id, ...newStaff },
			message: 'Staff member added successfully',
		});
	} catch (error) {
		console.error('Error adding staff member:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
