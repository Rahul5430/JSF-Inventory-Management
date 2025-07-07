'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { firestore } from '@/lib/firebase';
import { getRoleColor } from '@/lib/utils';
import { StaffMember } from '@/types';
import type { Firestore } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { Edit, Filter, Phone, Plus, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const db: Firestore | null = firestore;

function formatDateTime(dt: string) {
  if (!dt) return '';
  const d = new Date(dt);
  if (isNaN(d.getTime())) return dt;
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
  }).replace(',', '');
}

const StaffPage = () => {
  const { t, ready } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    if (!db) {
      toast.error('Firestore not initialized');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'staff'));
      const staffList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name ?? '',
          role: data.role ?? 'volunteer',
          'Speciality': data['Speciality'] ?? '',
          shiftStart: data.shiftStart ?? '',
          shiftEnd: data.shiftEnd ?? '',
          'Entry Time': data['Entry Time'] ?? '',
          'Exit Time': data['Exit Time'] ?? '',
          'Number Of Patients': data['Number Of Patients'] ?? 0,
          'Physician Contact Number': data['Physician Contact Number'] ?? '',
          'S.No': data['S.No'] ?? 0,
          patientsServed: data.patientsServed ?? 0,
          location: data.location ?? '',
          contactNumber: data.contactNumber ?? '',
          email: data.email ?? '',
          isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        };
      });
      setStaff(staffList);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error(t('message.error'));
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || member.role === roleFilter;
    const matchesLocation = !locationFilter || member.location === locationFilter;
    
    return matchesSearch && matchesRole && matchesLocation;
  });

  const handleDelete = async () => {
    // TODO: Implement Firestore delete logic if needed
    toast.success(t('message.staffDeleted'));
    fetchStaff();
  };

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'doctor', label: t('staff.role.doctor') },
    { value: 'nurse', label: t('staff.role.nurse') },
    { value: 'volunteer', label: t('staff.role.volunteer') },
    { value: 'coordinator', label: t('staff.role.coordinator') },
    { value: 'admin', label: t('staff.role.admin') },
  ];

  if (loading || !ready) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  console.log(filteredStaff);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <main className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t('staff.title')}
                </h1>
                <p className="text-gray-600">
                  Manage staff members and track their activities
                </p>
              </div>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>{t('staff.addMember')}</span>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Search staff members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                  options={roleOptions}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                />
                <Input
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Staff List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete()}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                      {t(`staff.role.${member.role}`)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Speciality:</span>
                      <span className="font-medium">{member['Speciality']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="font-medium">{member.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Shift:</span>
                      <span className="font-medium whitespace-nowrap truncate">{formatDateTime(member.shiftStart)} - {formatDateTime(member.shiftEnd)}</span>
                    </div>
                    
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Entry Time:</span>
                        <span className="font-medium">{member['Entry Time']}</span>
                      </div>
                    
                    
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Exit Time:</span>
                        <span className="font-medium">{member['Exit Time']}</span>
                      </div>
                    
                    
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Number Of Patients:</span>
                        <span className="font-medium">{member['Number Of Patients']}</span>
                      </div>
                    
                    
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Physician Contact Number:</span>
                        <span className="font-medium">{member['Physician Contact Number']}</span>
                      </div>
                    
                    
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">S.No:</span>
                        <span className="font-medium">{member['S.No']}</span>
                      </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Patients Served:</span>
                      <span className="font-medium">{member.patientsServed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`text-xs font-medium ${member.isActive ? 'text-green-600' : 'text-red-600'}`}>{member.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">{member['Physician Contact Number']}</span>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStaff.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No staff members found
                </h3>
                <p className="text-gray-600">
                  {searchTerm || roleFilter || locationFilter 
                    ? 'Try adjusting your filters'
                    : 'Get started by adding your first staff member'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AuthGuard>
  );
};

export default StaffPage; 