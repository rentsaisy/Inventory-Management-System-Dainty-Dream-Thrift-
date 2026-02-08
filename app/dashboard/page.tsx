'use client';

import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/app/context/AuthContext';
import { useInventory } from '@/app/context/InventoryContext';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { items } = useInventory();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalProducts = items.length;

  const categoryCount = items.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const stats = [
    {
      label: 'Total Items',
      value: totalItems,
      icon: '📦',
      color: 'from-primary/20 to-primary/5',
    },
    {
      label: 'Total Products',
      value: totalProducts,
      icon: '🏪',
      color: 'from-accent/20 to-accent/5',
    },
    {
      label: 'Inventory Value',
      value: `$${totalValue.toFixed(2)}`,
      icon: '💰',
      color: 'from-green-500/20 to-green-500/5',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Welcome, {user?.name}! 👋</h1>
          <p className="text-muted-foreground mt-2">
            {user?.role === 'admin'
              ? 'Manage your thrift store inventory and view analytics'
              : 'View and update inventory items'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden border-primary/20 bg-gradient-to-br ${stat.color} p-6 transition-transform hover:scale-105`}
            >
              <div className="absolute top-2 right-2 text-3xl opacity-20">{stat.icon}</div>
              <p className="text-muted-foreground text-sm font-semibold">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-primary/20 p-6 hover:border-primary/40 transition-colors cursor-pointer">
            <Link href="/dashboard/inventory" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4l8-4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">View Inventory</h3>
                <p className="text-sm text-muted-foreground">Browse all items in stock</p>
              </div>
            </Link>
          </Card>

          <Card className="border-primary/20 p-6 hover:border-primary/40 transition-colors cursor-pointer">
            <Link href="/dashboard/add-item" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Add New Item</h3>
                <p className="text-sm text-muted-foreground">Add items to inventory</p>
              </div>
            </Link>
          </Card>

          {user?.role === 'admin' && (
            <>
              <Card className="border-primary/20 p-6 hover:border-primary/40 transition-colors cursor-pointer">
                <Link href="/dashboard/analytics" className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Analytics</h3>
                    <p className="text-sm text-muted-foreground">View inventory analytics</p>
                  </div>
                </Link>
              </Card>

              <Card className="border-primary/20 p-6 hover:border-primary/40 transition-colors cursor-pointer">
                <Link href="/dashboard/staff" className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Staff Management</h3>
                    <p className="text-sm text-muted-foreground">Manage staff accounts</p>
                  </div>
                </Link>
              </Card>
            </>
          )}
        </div>

        {/* Categories Overview */}
        {totalProducts > 0 && (
          <Card className="border-primary/20 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Items by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(categoryCount).map(([category, count]) => (
                <div key={category} className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground capitalize mb-2">{category}</p>
                  <p className="text-2xl font-bold text-primary">{count}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
