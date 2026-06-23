'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path 
      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 bg-blue-50' 
      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <Link 
              href="/dashboard" 
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2"
              aria-label="ParkSense Home"
            >
              <span>🚦</span>
              <span>ParkSense</span>
            </Link>
            <span className="ml-2 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hidden sm:inline">
              Gridlock Intelligence
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-2">
            <Link 
              href="/dashboard" 
              className={`${isActive('/dashboard')} px-4 py-2 rounded-t-lg transition-all duration-200 flex items-center gap-2`}
              aria-label="Dashboard"
            >
              <span>📊</span>
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <Link 
              href="/analytics" 
              className={`${isActive('/analytics')} px-4 py-2 rounded-t-lg transition-all duration-200 flex items-center gap-2`}
              aria-label="Analytics"
            >
              <span>📈</span>
              <span className="font-medium">Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}