'use client';

import React from "react"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type UserRole } from '@/app/context/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    roles: ['admin', 'staff'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l-4-4"
        />
      </svg>
    ),
  },
  {
    label: 'Inventory',
    href: '/dashboard/inventory',
    roles: ['admin', 'staff'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4l8-4"
        />
      </svg>
    ),
  },
  {
    label: 'Add Item',
    href: '/dashboard/add-item',
    roles: ['admin', 'staff'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    roles: ['admin'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    label: 'Staff Management',
    href: '/dashboard/staff',
    roles: ['admin'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
        />
      </svg>
    ),
  },
];

export default function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 border-r border-primary/20 bg-card/30 backdrop-blur-sm overflow-y-auto hidden md:flex md:flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200',
              pathname === item.href
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-primary/20">
        <p className="text-xs text-muted-foreground text-center">
          <span className="block font-semibold text-foreground mb-1">Role</span>
          <span className="inline-block px-2 py-1 bg-primary/20 text-primary rounded-full capitalize font-semibold">
            {role}
          </span>
        </p>
      </div>
    </aside>
  );
}
