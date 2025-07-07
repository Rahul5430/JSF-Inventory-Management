import { firestore } from '@/lib/firebase';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/inventory
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
		const category = searchParams.get('category') ?? '';
		const location = searchParams.get('location') ?? '';
		const sortBy = searchParams.get('sortBy') ?? 'createdAt';
		const sortOrder = searchParams.get('sortOrder') ?? 'desc';

		const q = collection(firestore, 'inventory');
		const inventoryQuery = query(q);

		// Filtering (client-side for now)
		const snapshot = await getDocs(inventoryQuery);
		let data = snapshot.docs.map((doc) => {
			const d = doc.data() as any;
			return {
				id: doc.id,
				...d,
				expiryDate: d.expiryDate?.toDate
					? d.expiryDate.toDate()
					: d.expiryDate,
				createdAt: d.createdAt?.toDate
					? d.createdAt.toDate()
					: d.createdAt,
				updatedAt: d.updatedAt?.toDate
					? d.updatedAt.toDate()
					: d.updatedAt,
			};
		});
		if (search)
			data = data.filter((item) =>
				item.name.toLowerCase().includes(search.toLowerCase())
			);
		if (category) data = data.filter((item) => item.category === category);
		if (location)
			data = data.filter((item) =>
				item.location.toLowerCase().includes(location.toLowerCase())
			);
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
		console.error('Error fetching inventory:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// POST /api/inventory
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
			quantity,
			cost,
			location,
			expiryDate,
			donor,
			purpose,
			category,
			minStockLevel,
			unit,
			createdBy,
		} = body;
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
		const newItem = {
			name,
			quantity: parseInt(quantity),
			cost: parseFloat(cost) || 0,
			location,
			expiryDate: new Date(expiryDate),
			donor: donor ?? '',
			purpose,
			category,
			minStockLevel: parseInt(minStockLevel) || 0,
			unit,
			createdAt: new Date(),
			updatedAt: new Date(),
			createdBy: createdBy ?? '',
		};
		const docRef = await addDoc(
			collection(firestore, 'inventory'),
			newItem
		);
		return NextResponse.json({
			success: true,
			data: { id: docRef.id, ...newItem },
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
