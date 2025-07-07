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
];

// GET /api/staff/[id]
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Staff ID is required' },
				{ status: 400 }
			);
		}

		const staff = mockStaff.find((member) => member.id === id);

		if (!staff) {
			return NextResponse.json(
				{ success: false, error: 'Staff member not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: staff,
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
	try {
		const { id } = await params;
		const body = await request.json();

		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Staff ID is required' },
				{ status: 400 }
			);
		}

		const memberIndex = mockStaff.findIndex((member) => member.id === id);

		if (memberIndex === -1) {
			return NextResponse.json(
				{ success: false, error: 'Staff member not found' },
				{ status: 404 }
			);
		}

		// Update the staff member
		mockStaff[memberIndex] = {
			...mockStaff[memberIndex],
			...body,
			updatedAt: new Date(),
		};

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
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Staff ID is required' },
				{ status: 400 }
			);
		}

		const memberIndex = mockStaff.findIndex((member) => member.id === id);

		if (memberIndex === -1) {
			return NextResponse.json(
				{ success: false, error: 'Staff member not found' },
				{ status: 404 }
			);
		}

		// Remove the staff member
		mockStaff.splice(memberIndex, 1);

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
