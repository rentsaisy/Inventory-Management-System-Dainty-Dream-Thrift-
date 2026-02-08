'use client';

import AppLayout from '@/components/AppLayout';
import { useInventory } from '@/app/context/InventoryContext';
import { useAuth } from '@/app/context/AuthContext';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const { items } = useInventory();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const avgPrice = items.length > 0 ? totalValue / items.length : 0;

  // Category breakdown
  const categoryBreakdown = items.reduce(
    (acc, item) => {
      const existing = acc.find((c) => c.category === item.category);
      if (existing) {
        existing.count += 1;
        existing.quantity += item.quantity;
        existing.value += item.quantity * item.price;
      } else {
        acc.push({
          category: item.category,
          count: 1,
          quantity: item.quantity,
          value: item.quantity * item.price,
        });
      }
      return acc;
    },
    [] as Array<{ category: string; count: number; quantity: number; value: number }>
  );

  // Condition breakdown
  const conditionBreakdown = items.reduce(
    (acc, item) => {
      const existing = acc.find((c) => c.condition === item.condition);
      if (existing) {
        existing.count += 1;
        existing.quantity += item.quantity;
      } else {
        acc.push({
          condition: item.condition,
          count: 1,
          quantity: item.quantity,
        });
      }
      return acc;
    },
    [] as Array<{ condition: string; count: number; quantity: number }>
  );

  // Low stock items
  const lowStockItems = items.filter((item) => item.quantity < 3).sort((a, b) => a.quantity - b.quantity);

  // Most valuable items
  const mostValuableItems = [...items]
    .sort((a, b) => b.quantity * b.price - a.quantity * a.price)
    .slice(0, 5);

  const conditionColors = {
    excellent: 'bg-green-500/20 text-green-700 border-green-500/30',
    good: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
    fair: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
    poor: 'bg-red-500/20 text-red-700 border-red-500/30',
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Inventory insights and statistics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/20 p-6 bg-gradient-to-br from-primary/20 to-primary/5">
            <p className="text-muted-foreground text-sm font-semibold">Total Items</p>
            <p className="text-3xl font-bold text-foreground mt-2">{totalItems}</p>
            <p className="text-xs text-muted-foreground mt-2">{items.length} products</p>
          </Card>

          <Card className="border-primary/20 p-6 bg-gradient-to-br from-accent/20 to-accent/5">
            <p className="text-muted-foreground text-sm font-semibold">Total Value</p>
            <p className="text-3xl font-bold text-foreground mt-2">${totalValue.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">Inventory worth</p>
          </Card>

          <Card className="border-primary/20 p-6 bg-gradient-to-br from-green-500/20 to-green-500/5">
            <p className="text-muted-foreground text-sm font-semibold">Average Price</p>
            <p className="text-3xl font-bold text-foreground mt-2">${avgPrice.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">Per product</p>
          </Card>

          <Card className="border-primary/20 p-6 bg-gradient-to-br from-blue-500/20 to-blue-500/5">
            <p className="text-muted-foreground text-sm font-semibold">Low Stock</p>
            <p className="text-3xl font-bold text-foreground mt-2">{lowStockItems.length}</p>
            <p className="text-xs text-muted-foreground mt-2">Items under 3 units</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card className="border-primary/20 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Items by Category</h2>
            <div className="space-y-3">
              {categoryBreakdown.length > 0 ? (
                categoryBreakdown.map((category) => (
                  <div key={category.category} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground capitalize">{category.category}</p>
                      <p className="text-sm text-muted-foreground">{category.count} products • {category.quantity} units</p>
                    </div>
                    <p className="text-lg font-bold text-primary">${category.value.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No data available</p>
              )}
            </div>
          </Card>

          {/* Condition Breakdown */}
          <Card className="border-primary/20 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Items by Condition</h2>
            <div className="space-y-3">
              {conditionBreakdown.length > 0 ? (
                conditionBreakdown.map((condition) => (
                  <div
                    key={condition.condition}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      conditionColors[condition.condition as keyof typeof conditionColors]
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold capitalize">{condition.condition}</p>
                      <p className="text-sm opacity-75">{condition.count} products • {condition.quantity} units</p>
                    </div>
                    <p className="text-lg font-bold">{condition.quantity}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No data available</p>
              )}
            </div>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-yellow-500/30 p-6 bg-yellow-500/5">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Low Stock Alert
            </h2>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-yellow-500/20">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-600">{item.quantity}</p>
                    <p className="text-xs text-muted-foreground">in stock</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Most Valuable Items */}
        {mostValuableItems.length > 0 && (
          <Card className="border-primary/20 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Most Valuable Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/20 text-left">
                    <th className="pb-3 px-4 font-semibold text-foreground">Item</th>
                    <th className="pb-3 px-4 font-semibold text-foreground">Quantity</th>
                    <th className="pb-3 px-4 font-semibold text-foreground">Unit Price</th>
                    <th className="pb-3 px-4 font-semibold text-foreground">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {mostValuableItems.map((item) => (
                    <tr key={item.id} className="border-b border-primary/10 hover:bg-primary/5">
                      <td className="py-3 px-4 text-foreground font-semibold">{item.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{item.quantity}</td>
                      <td className="py-3 px-4 text-muted-foreground">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-foreground font-bold">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
