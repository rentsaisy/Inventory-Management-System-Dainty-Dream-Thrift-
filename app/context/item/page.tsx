'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const ITEMS_PER_PAGE = 5;

export default function ItemPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Items</h1>
            <p className="text-muted-foreground mt-2">Manage your inventory items</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">Add Item</Button>
        </div>

          <CardContent className="pt-5">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading items...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-primary/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-primary to-primary/70 border-b border-primary/20">
                        <TableHead className="font-bold text-primary-foreground w-12">No.</TableHead>
                        <TableHead className="font-bold text-primary-foreground">Item Name</TableHead>
                        <TableHead className="font-bold text-primary-foreground">Category</TableHead>
                        <TableHead className="font-bold text-primary-foreground text-center">Stock</TableHead>
                        <TableHead className="font-bold text-primary-foreground text-right">Purchase Price</TableHead>
                        <TableHead className="font-bold text-primary-foreground text-right">Selling Price</TableHead>
                        <TableHead className="font-bold text-primary-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedItems.length === 0 ? (
                        <TableRow className="hover:bg-card/50">
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">No items found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedItems.map((item, index) => (
                          <TableRow key={item.item_id} className="hover:bg-card/50 transition-colors border-b border-primary/10">
                            <TableCell className="font-semibold text-primary">{startIndex + index + 1}</TableCell>
                            <TableCell className="font-medium text-foreground">{item.item_name}</TableCell>
                            <TableCell className="text-foreground">{item.category_name || 'N/A'}</TableCell>
                            <TableCell className="text-center">
                              <span className={`px-2 py-1 rounded-full inline-block ${item.current_stock < 10 ? 'bg-orange-500/20 text-orange-400 font-semibold' : 'bg-green-500/20 text-green-400'}`}>
                                {item.current_stock}
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-foreground">${item.purchase_price.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-semibold text-foreground">${item.selling_price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary text-foreground">
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-2">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, items.length)} of {items.length} items
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-2 px-3">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? 'bg-primary text-white' : ''}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
      </div>
    );
  }
