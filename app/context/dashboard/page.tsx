'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, TrendingUp, TrendingDown, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalSuppliers: 0,
    totalCategories: 0,
    totalInventoryValue: 0,
  });
  const [lowStockData, setLowStockData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [stockTrendData, setStockTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [itemsRes, categoriesRes, suppliersRes, stockInRes, stockOutRes] = await Promise.all([
          fetch('/api/items'),
          fetch('/api/categories'),
          fetch('/api/suppliers'),
          fetch('/api/stock-in'),
          fetch('/api/stock-out'),
        ]);

        if (itemsRes.ok && categoriesRes.ok && suppliersRes.ok && stockInRes.ok && stockOutRes.ok) {
          const items = await itemsRes.json();
          const categories = await categoriesRes.json();
          const suppliers = await suppliersRes.json();
          const stockInData = await stockInRes.json();
          const stockOutData = await stockOutRes.json();

          // Calculate low stock items
          const lowStock = items.filter((item: any) => item.current_stock < 10);
          
          // Calculate total inventory value
          const totalValue = items.reduce((sum: number, item: any) => {
            return sum + (item.current_stock * item.purchase_price);
          }, 0);

          setStats({
            totalItems: items.length,
            lowStockItems: lowStock.length,
            totalSuppliers: suppliers.length,
            totalCategories: categories.length,
            totalInventoryValue: totalValue,
          });

          // Prepare data for low stock chart
          const lowStockChart = lowStock
            .sort((a: any, b: any) => a.current_stock - b.current_stock)
            .slice(0, 8)
            .map((item: any) => ({
              name: item.item_name,
              stock: item.current_stock,
            }));
          setLowStockData(lowStockChart);

          // Prepare data for category chart
          const categoryValueMap: { [key: string]: number } = {};
          items.forEach((item: any) => {
            const categoryName = item.category_name || 'Uncategorized';
            categoryValueMap[categoryName] = (categoryValueMap[categoryName] || 0) + (item.current_stock * item.purchase_price);
          });
          
          const categoryChart = Object.entries(categoryValueMap).map(([name, value]) => ({
            name,
            value: Math.round(value),
          }));
          setCategoryData(categoryChart);

          // Prepare data for stock trend
          const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toISOString().split('T')[0];
          });

          const trendData = last30Days.map((date) => {
            const inCount = stockInData.filter((s: any) => s.date_in.startsWith(date)).reduce((sum: number, s: any) => sum + s.quantity, 0);
            const outCount = stockOutData.filter((s: any) => s.date_out.startsWith(date)).reduce((sum: number, s: any) => sum + s.quantity, 0);
            return {
              date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              stockIn: inCount,
              stockOut: outCount,
            };
          });
          setStockTrendData(trendData);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
            <div className="w-6 h-6 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {user.name}!</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <Card className="p-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-0">
            <CardTitle className="text-xs font-medium">Total Items</CardTitle>
            <Package className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-1">
            <div className="text-xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Product types</p>
          </CardContent>
        </Card>

        <Card className="p-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-0">
            <CardTitle className="text-xs font-medium">Total Value</CardTitle>
            <TrendingUp className="h-3 w-3 text-green-500" />
          </CardHeader>
          <CardContent className="p-0 pt-1">
            <div className="text-xl font-bold">${stats.totalInventoryValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Inventory value</p>
          </CardContent>
        </Card>

        <Card className="p-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-0">
            <CardTitle className="text-xs font-medium">Low Stock</CardTitle>
            <AlertCircle className="h-3 w-3 text-orange-500" />
          </CardHeader>
          <CardContent className="p-0 pt-1">
            <div className="text-xl font-bold text-orange-500">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Below 10 units</p>
          </CardContent>
        </Card>

        <Card className="p-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-0">
            <CardTitle className="text-xs font-medium">Categories</CardTitle>
            <Package className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-1">
            <div className="text-xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Total categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Low Stock Items Chart */}
          {lowStockData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Low Stock Items</CardTitle>
                <CardDescription className="text-xs">Below 10 units</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={lowStockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="stock" fill="#f97316" name="Stock Level" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Inventory Value by Category Chart */}
          {categoryData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Value by Category</CardTitle>
                <CardDescription className="text-xs">Inventory distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value}`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'][index % 8]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Stock In/Out Trend */}
      {stockTrendData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Stock Trend (Last 30 Days)</CardTitle>
            <CardDescription className="text-xs">Incoming vs outgoing activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="stockIn" stroke="#10b981" name="Stock In" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="stockOut" stroke="#ef4444" name="Stock Out" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Low Stock Alert */}
      {stats.lowStockItems > 0 && (
        <Alert className="border-orange-500/50 bg-orange-500/10">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-800">
            <strong>{stats.lowStockItems} items</strong> are running low on stock. Please consider restocking.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
