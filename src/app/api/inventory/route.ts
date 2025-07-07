import { firestore } from '@/lib/firebase';
import { InventoryItem } from '@/types';
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

		const inventoryRef = collection(firestore, 'inventory');
		let q = query(inventoryRef);

		// Apply filters
		if (search) {
			q = query(
				q,
				where('name', '>=', search),
				where('name', '<=', search + '\uf8ff')
			);
		}
		if (category) {
			q = query(q, where('category', '==', category));
		}
		if (location) {
			q = query(q, where('location', '==', location));
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
		const inventory: InventoryItem[] = [];

		snapshot.forEach((doc) => {
			const data = doc.data();
			inventory.push({
				id: doc.id,
				...data,
				createdAt: data.createdAt?.toDate(),
				updatedAt: data.updatedAt?.toDate(),
				expiryDate: data.expiryDate?.toDate(),
			} as InventoryItem);
		});

		// Get total count for pagination
		const totalQuery = query(inventoryRef);
		const totalSnapshot = await getDocs(totalQuery);
		const total = totalSnapshot.size;

		return NextResponse.json({
			success: true,
			data: inventory,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error('Error fetching inventory:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch inventory' },
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
			createdBy,
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

		const inventoryData = {
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
			createdBy,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		};

		const docRef = await addDoc(
			collection(firestore, 'inventory'),
			inventoryData
		);

		return NextResponse.json({
			success: true,
			data: { id: docRef.id, ...inventoryData },
			message: 'Inventory item added successfully',
		});
	} catch (error) {
		console.error('Error adding inventory item:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to add inventory item' },
			{ status: 500 }
		);
	}
}
