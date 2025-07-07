'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import axios from '@/lib/axios';
import { formatCurrency, formatDate, getCategoryColor, isExpired, isExpiringSoon } from '@/lib/utils';
import { InventoryItem } from '@/types';
import { Edit, Filter, Package, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const InventoryPage = () => {
  const { t, ready } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/inventory');
      setInventory(response.data.data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error(t('message.error'));
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesLocation = !locationFilter || item.location === locationFilter;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await axios.delete(`/api/inventory/${id}`);
      toast.success(t('message.itemDeleted'));
      fetchInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(t('message.error'));
    }
  };

  const getStatusColor = (item: InventoryItem) => {
    if (isExpired(item.expiryDate)) return 'text-red-600';
    if (isExpiringSoon(item.expiryDate, 30)) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusText = (item: InventoryItem) => {
    if (isExpired(item.expiryDate)) return 'Expired';
    if (isExpiringSoon(item.expiryDate, 30)) return 'Expiring Soon';
    return 'Good';
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'medicine', label: t('inventory.category.medicine') },
    { value: 'equipment', label: t('inventory.category.equipment') },
    { value: 'supplies', label: t('inventory.category.supplies') },
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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:pl-64">
          <Header onMenuToggle={() => setSidebarOpen(true)} />
          
          <main className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {t('inventory.title')}
                  </h1>
                  <p className="text-gray-600">
                    Manage inventory items and track stock levels
                  </p>
                </div>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>{t('inventory.addItem')}</span>
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
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select
                    options={categoryOptions}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  />
                  <Input
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInventory.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {t(`inventory.category.${item.category}`)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <span className="font-medium">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cost:</span>
                        <span className="font-medium">{formatCurrency(item.cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="font-medium">{item.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Expiry:</span>
                        <span className={`font-medium ${getStatusColor(item)}`}>
                          {formatDate(item.expiryDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`text-xs font-medium ${getStatusColor(item)}`}>
                          {getStatusText(item)}
                        </span>
                      </div>
                      {item.donor && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Donor:</span>
                          <span className="font-medium">{item.donor}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600">{item.purpose}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredInventory.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No inventory items found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || categoryFilter || locationFilter 
                      ? 'Try adjusting your filters'
                      : 'Get started by adding your first inventory item'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default InventoryPage;
