'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface StockIn {
  stock_in_id: number;
  item_id: number;
  quantity: number;
  purchase_price: number;
  date_in: string;
  supplier_id: number;
  reference_no?: string;
  item_name?: string;
  supplier_name?: string;
}

export default function StockInPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stockIn, setStockIn] = useState<StockIn[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchStockIn();
    }
  }, [user]);

  const fetchStockIn = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stock-in');
      if (res.ok) {
        setStockIn(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch stock in records:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Stock In</h1>
            <p className="text-muted-foreground mt-2">Record incoming inventory</p>
          </div>
          <Button>Add Stock In</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock In Records</CardTitle>
            <CardDescription>All incoming stock transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading stock in records...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Purchase Price</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockIn.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-muted-foreground">No stock in records found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      stockIn.map((record) => (
                        <TableRow key={record.stock_in_id}>
                          <TableCell className="font-medium">{record.item_name || 'N/A'}</TableCell>
                          <TableCell>{record.supplier_name || 'N/A'}</TableCell>
                          <TableCell>{record.quantity}</TableCell>
                          <TableCell>${record.purchase_price.toFixed(2)}</TableCell>
                          <TableCell>{new Date(record.date_in).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
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
