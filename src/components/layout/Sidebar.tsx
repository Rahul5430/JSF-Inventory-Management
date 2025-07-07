'use client';

import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
	BarChart3,
	Globe,
	Home,
	LogOut,
	Package,
	Settings,
	Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t, i18n, ready } = useTranslation();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
	{
	  name: t('nav.dashboard'),
	  href: '/',
	  icon: Home,
	  roles: ['admin', 'coordinator', 'volunteer'],
	},
	{
	  name: t('nav.inventory'),
	  href: '/inventory',
	  icon: Package,
	  roles: ['admin', 'coordinator'],
	},
	{
	  name: t('nav.staff'),
	  href: '/staff',
	  icon: Users,
	  roles: ['admin', 'coordinator'],
	},
	{
	  name: t('nav.reports'),
	  href: '/reports',
	  icon: BarChart3,
	  roles: ['admin', 'coordinator'],
	},
	{
	  name: t('nav.settings'),
	  href: '/settings',
	  icon: Settings,
	  roles: ['admin'],
	},
  ];

  const handleLogout = async () => {
	try {
	  await logout();
	} catch (error) {
	  console.error('Logout error:', error);
	}
  };

  const toggleLanguage = () => {
	const newLang = i18n.language === 'en' ? 'hi' : 'en';
	i18n.changeLanguage(newLang);
  };

  const filteredNavigation = navigation.filter(
	(item) => user && item.roles.includes(user.role)
  );

  if (!ready) {
    return null;
  }

  return (
	<>
	  {/* Overlay */}
	  {isOpen && (
		<div
		  className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
		  onClick={onClose}
		/>
	  )}

	  {/* Sidebar */}
	  <div
		className={cn(
		  'fixed left-0 top-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0',
		  isOpen ? 'translate-x-0' : '-translate-x-full'
		)}
	  >
		<div className="flex h-full flex-col">
		  {/* Header */}
		  <div className="flex h-16 items-center justify-between border-b px-6">
			<h1 className="text-xl font-bold text-gray-900">
			  JSF Inventory
			</h1>
			<button
			  onClick={onClose}
			  className="lg:hidden"
			>
			  <svg
				className="h-6 w-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			  >
				<path
				  strokeLinecap="round"
				  strokeLinejoin="round"
				  strokeWidth={2}
				  d="M6 18L18 6M6 6l12 12"
				/>
			  </svg>
			</button>
		  </div>

		  {/* Navigation */}
		  <nav className="flex-1 space-y-1 px-4 py-4">
			{filteredNavigation.map((item) => {
			  const isActive = pathname === item.href;
			  return (
				<Link
				  key={item.name}
				  href={item.href}
				  className={cn(
					'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
					isActive
					  ? 'bg-blue-100 text-blue-700'
					  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
				  )}
				  onClick={onClose}
				>
				  <item.icon className="mr-3 h-5 w-5" />
				  {item.name}
				</Link>
			  );
			})}
		  </nav>

		  {/* Footer */}
		  <div className="border-t p-4">
			{/* Language Toggle */}
			<button
			  onClick={toggleLanguage}
			  className="mb-4 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
			>
			  <Globe className="mr-3 h-5 w-5" />
			  {i18n.language === 'en' ? 'हिंदी' : 'English'}
			</button>

			{/* User Info */}
			{user && (
			  <div className="mb-4 rounded-md bg-gray-50 p-3">
				<p className="text-sm font-medium text-gray-900">{user.name}</p>
				<p className="text-xs text-gray-500 capitalize">{user.role}</p>
			  </div>
			)}

			{/* Logout */}
			<button
			  onClick={handleLogout}
			  className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
			>
			  <LogOut className="mr-3 h-5 w-5" />
			  {t('nav.logout')}
			</button>
		  </div>
		</div>
	  </div>
	</>
  );
};

export default Sidebar; 