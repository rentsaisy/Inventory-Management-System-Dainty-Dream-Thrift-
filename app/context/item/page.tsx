'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState as dialogOpen } from 'react';

interface Item {
  item_id: number;
  item_name: string;
  category_id: number;
  category_name?: string;
  size?: string;
  color?: string;
  brand?: string;
  purchase_price: number;
  selling_price: number;
  current_stock: number;
}

export default function ItemPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/items');
      if (res.ok) {
        setItems(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
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
            <h1 className="text-4xl font-bold tracking-tight">Items</h1>
            <p className="text-muted-foreground mt-2">Manage your inventory items</p>
          </div>
          <Button>Add Item</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Items List</CardTitle>
            <CardDescription>All items in your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading items...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Purchase Price</TableHead>
                      <TableHead>Selling Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-muted-foreground">No items found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow key={item.item_id}>
                          <TableCell className="font-medium">{item.item_name}</TableCell>
                          <TableCell>{item.category_name || 'N/A'}</TableCell>
                          <TableCell>
                            <span className={item.current_stock < 10 ? 'text-orange-600 font-semibold' : ''}>
                              {item.current_stock}
                            </span>
                          </TableCell>
                          <TableCell>${item.purchase_price.toFixed(2)}</TableCell>
                          <TableCell>${item.selling_price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Edit
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
