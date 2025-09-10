'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBook, FaRobot, FaCog, FaBookmark, FaChartLine } from 'react-icons/fa';

const navItems = [
  { href: '/', label: 'Book', icon: FaBook },
  { href: '/analytics', label: 'Analytics', icon: FaChartLine },
  { href: '/ai-librarian', label: 'AI Librarian', icon: FaRobot },
  { href: '/references', label: 'References', icon: FaBookmark },
  { href: '/settings', label: 'Settings', icon: FaCog },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
} 