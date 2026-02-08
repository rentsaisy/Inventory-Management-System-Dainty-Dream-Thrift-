'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface StockOut {
  stock_out_id: number;
  item_id: number;
  quantity: number;
  selling_price: number;
  date_out: string;
  user_id: number;
  item_name?: string;
  username?: string;
}

export default function StockOutPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stockOut, setStockOut] = useState<StockOut[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchStockOut();
    }
  }, [user]);

  const fetchStockOut = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stock-out');
      if (res.ok) {
        setStockOut(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch stock out records:', error);
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
            <h1 className="text-4xl font-bold tracking-tight">Stock Out</h1>
            <p className="text-muted-foreground mt-2">Record outgoing inventory</p>
          </div>
          <Button>Add Stock Out</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock Out Records</CardTitle>
            <CardDescription>All outgoing stock transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading stock out records...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Selling Price</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockOut.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-muted-foreground">No stock out records found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      stockOut.map((record) => (
                        <TableRow key={record.stock_out_id}>
                          <TableCell className="font-medium">{record.item_name || 'N/A'}</TableCell>
                          <TableCell>{record.quantity}</TableCell>
                          <TableCell>${record.selling_price.toFixed(2)}</TableCell>
                          <TableCell>{new Date(record.date_out).toLocaleDateString()}</TableCell>
                          <TableCell>{record.username || 'N/A'}</TableCell>
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
