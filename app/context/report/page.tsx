'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ExportReport from '@/components/ExportReport';

interface InventoryReport {
  item_id: number;
  item_name: string;
  category_name: string;
  current_stock: number;
  purchase_price: number;
  selling_price: number;
  stock_value: number;
  total_sold: number;
}

export default function ReportPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<InventoryReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchReport();
    }
  }, [user]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/items');
      if (res.ok) {
        const items = await res.json();
        // Create a simple report from items data
        const reportData = items.map((item: any) => ({
          item_id: item.item_id,
          item_name: item.item_name,
          category_name: item.category_name || 'N/A',
          current_stock: item.current_stock,
          purchase_price: item.purchase_price,
          selling_price: item.selling_price,
          stock_value: item.current_stock * item.purchase_price,
          total_sold: 0,
        }));
        setReport(reportData);
      }
    } catch (error) {
      console.error('Failed to fetch report:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStockValue = report.reduce((sum, item) => sum + item.stock_value, 0);
  const totalItems = report.reduce((sum, item) => sum + item.current_stock, 0);

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
    <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Inventory Report</h1>
            <p className="text-muted-foreground mt-2">View and export inventory reports</p>
          </div>
          <ExportReport data={report} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items in Stock</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4l8-4" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">Units in inventory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalStockValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Based on purchase price</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.length}</div>
              <p className="text-xs text-muted-foreground">Total product types</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Inventory Report</CardTitle>
            <CardDescription>Complete inventory status by item</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading report...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Purchase Price</TableHead>
                      <TableHead>Selling Price</TableHead>
                      <TableHead>Stock Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-muted-foreground">No items found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      report.map((item) => (
                        <TableRow key={item.item_id}>
                          <TableCell className="font-medium">{item.item_name}</TableCell>
                          <TableCell>{item.category_name}</TableCell>
                          <TableCell>{item.current_stock}</TableCell>
                          <TableCell>${item.purchase_price.toFixed(2)}</TableCell>
                          <TableCell>${item.selling_price.toFixed(2)}</TableCell>
                          <TableCell className="font-semibold">${item.stock_value.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
