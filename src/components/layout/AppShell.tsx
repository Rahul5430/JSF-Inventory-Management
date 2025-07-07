'use client';

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { readonly children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
	<>
	  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
	  <div className="lg:pl-64">
		<Header onMenuToggle={() => setSidebarOpen(true)} />
		<main>{children}</main>
	  </div>
	</>
  );
} 