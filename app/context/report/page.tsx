'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface InventoryReport {
  item_id: number;
  item_name: string;
  category_name: string;
  current_stock: number;
  purchase_price: number;
  selling_price: number;
  stock_value: number;
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
        const reportData = items.map((item: any) => ({
          item_id: item.item_id,
          item_name: item.item_name,
          category_name: item.category_name || 'N/A',
          current_stock: item.current_stock,
          purchase_price: item.purchase_price,
          selling_price: item.selling_price,
          stock_value: item.current_stock * item.purchase_price,
        }));
        setReport(reportData);
      }
    } catch (error) {
      console.error('Failed to fetch report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (report.length === 0) {
      alert('No data to export');
      return;
    }

    // Create CSV header
    const headers = ['Item ID', 'Item Name', 'Category', 'Current Stock', 'Purchase Price', 'Selling Price', 'Stock Value'];
    
    // Create CSV rows
    const rows = report.map(item => [
      item.item_id,
      item.item_name,
      item.category_name,
      item.current_stock,
      item.purchase_price.toFixed(2),
      item.selling_price.toFixed(2),
      item.stock_value.toFixed(2),
    ]);

    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map((cell: any) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Inventory Report</h1>
          <p className="text-muted-foreground mt-2">Detailed inventory summary of all items</p>
        </div>
        <Button
          onClick={exportToCSV}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading report...</p>
            </div>
          ) : report.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No items found</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="overflow-hidden rounded-lg border border-primary/20 w-full">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-primary/70 border-b border-primary/20 h-10 table-row">
                      <th className="font-bold text-primary-foreground text-sm px-3 py-2 text-left">Item ID</th>
                      <th className="font-bold text-primary-foreground text-sm px-3 py-2 text-left">Item Name</th>
                      <th className="font-bold text-primary-foreground text-sm px-3 py-2 text-left">Category</th>
                      <th className="font-bold text-primary-foreground text-sm px-3 py-2 text-center">Current Stock</th>
                      <th className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Purchase Price</th>
                      <th className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Selling Price</th>
                      <th className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Stock Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.map((item) => (
                      <tr key={item.item_id} className="transition-colors border-b border-primary/10 hover:bg-card/50 h-11 table-row">
                        <td className="text-sm px-3 py-3">{item.item_id}</td>
                        <td className="font-medium text-sm px-3 py-3">{item.item_name}</td>
                        <td className="text-sm px-3 py-3">{item.category_name}</td>
                        <td className="text-center text-sm px-3 py-3">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-semibold">
                            {item.current_stock}
                          </span>
                        </td>
                        <td className="text-right text-sm px-3 py-3">${item.purchase_price.toFixed(2)}</td>
                        <td className="text-right text-sm px-3 py-3">${item.selling_price.toFixed(2)}</td>
                        <td className="text-right font-semibold text-sm px-3 py-3">${item.stock_value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
    </div>
  );
}
