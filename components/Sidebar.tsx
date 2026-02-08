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
}

interface NavSection {
  title: string;
  items: NavItem[];
  roles: UserRole[];
}

const navSections: NavSection[] = [
  {
    title: 'Main',
    roles: ['admin', 'staff'],
    items: [
      {
        label: 'Dashboard',
        href: '/context/dashboard',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l-4-4"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Master',
    roles: ['admin'],
    items: [
      {
        label: 'Item',
        href: '/context/item',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        label: 'Category',
        href: '/context/category',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21H3v-2a6 6 0 0112 0v2h4v-2a6 6 0 00-9-5.63M15 5a3 3 0 11-6 0 3 3 0 016 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ),
      },
      {
        label: 'Supplier',
        href: '/context/supplier',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H1m11 0a3 3 0 11-6 0m6 0a3 3 0 10-6 0m0 0H0m6 6h12"
            />
          </svg>
        ),
      },
      {
        label: 'Staff Management',
        href: '/context/staff',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Master',
    roles: ['staff'],
    items: [
    {
      label: 'Item',
      href: '/context/item',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      label: 'Category',
      href: '/context/category',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21H3v-2a6 6 0 0112 0v2h4v-2a6 6 0 00-9-5.63M15 5a3 3 0 11-6 0 3 3 0 016 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      label: 'Supplier',
      href: '/context/supplier',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H1m11 0a3 3 0 11-6 0m6 0a3 3 0 10-6 0m0 0H0m6 6h12"
          />
        </svg>
      ),
    }
  ],
  },
  {
    title: 'Inventory',
    roles: ['admin', 'staff'],
    items: [
      {
        label: 'Stock In',
        href: '/context/stock-in',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        ),
      },
      {
        label: 'Stock Out',
        href: '/context/stock-out',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Report',
    roles: ['admin', 'staff'],
    items: [
      {
        label: 'Inventory Report',
        href: '/context/report',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  const filteredSections = navSections.filter((section) => section.roles.includes(role));

  return (
    <aside className="w-64 border-r border-primary/20 bg-card/30 backdrop-blur-sm hidden md:flex md:flex-col">
      <nav className="flex-1 p-2 space-y-3 overflow-y-auto">
        {filteredSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    pathname === item.href
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="text-sm truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
