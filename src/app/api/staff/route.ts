import { StaffMember } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

// Mock data for demo
const mockStaff: StaffMember[] = [
	{
		id: '1',
		name: 'Dr. Sarah Johnson',
		role: 'doctor',
		specialty: 'General Medicine',
		shiftStart: '09:00',
		shiftEnd: '17:00',
		patientsServed: 45,
		location: 'Clinic A',
		contactNumber: '+91-9876543210',
		email: 'sarah.johnson@jsf.org',
		isActive: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: '2',
		name: 'Nurse Priya Sharma',
		role: 'nurse',
		specialty: 'Emergency Care',
		shiftStart: '08:00',
		shiftEnd: '16:00',
		patientsServed: 38,
		location: 'Clinic B',
		contactNumber: '+91-9876543211',
		email: 'priya.sharma@jsf.org',
		isActive: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: '3',
		name: 'Dr. Rajesh Kumar',
		role: 'doctor',
		specialty: 'Cardiology',
		shiftStart: '10:00',
		shiftEnd: '18:00',
		patientsServed: 52,
		location: 'Clinic C',
		contactNumber: '+91-9876543212',
		email: 'rajesh.kumar@jsf.org',
		isActive: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

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

		let filteredData = [...mockStaff];

		// Apply filters
		if (search) {
			filteredData = filteredData.filter((member) =>
				member.name.toLowerCase().includes(search.toLowerCase())
			);
		}
		if (role) {
			filteredData = filteredData.filter(
				(member) => member.role === role
			);
		}
		if (location) {
			filteredData = filteredData.filter((member) =>
				member.location.toLowerCase().includes(location.toLowerCase())
			);
		}
		if (isActive !== null) {
			const activeFilter = isActive === 'true';
			filteredData = filteredData.filter(
				(member) => member.isActive === activeFilter
			);
		}

		// Apply sorting
		filteredData.sort((a, b) => {
			const aValue = a[sortBy as keyof StaffMember] ?? '';
			const bValue = b[sortBy as keyof StaffMember] ?? '';

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
		console.error('Error fetching staff:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
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

		const newStaff: StaffMember = {
			id: (mockStaff.length + 1).toString(),
			name,
			role,
			specialty: specialty || '',
			shiftStart,
			shiftEnd,
			patientsServed: parseInt(patientsServed) || 0,
			location,
			contactNumber,
			email,
			isActive: Boolean(isActive),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		mockStaff.push(newStaff);

		return NextResponse.json({
			success: true,
			data: newStaff,
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
