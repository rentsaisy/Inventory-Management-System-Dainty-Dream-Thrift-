'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const ITEMS_PER_PAGE = 5;

export default function StockInPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stockIn, setStockIn] = useState<StockIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(stockIn.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStockIn = stockIn.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Stock In</h1>
            <p className="text-muted-foreground mt-2">Record incoming inventory</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">Add Stock In</Button>
        </div>

          <CardContent className="pt-5">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading stock in records...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-primary/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-primary to-primary/70 border-b border-primary/20">
                        <TableHead className="font-bold text-primary-foreground w-12">No.</TableHead>
                        <TableHead className="font-bold text-primary-foreground">Item</TableHead>
                        <TableHead className="font-bold text-primary-foreground">Supplier</TableHead>
                        <TableHead className="font-bold text-primary-foreground text-center">Quantity</TableHead>
                        <TableHead className="font-bold text-primary-foreground text-right">Purchase Price</TableHead>
                        <TableHead className="font-bold text-primary-foreground text-right">Date</TableHead>
                        <TableHead className="font-bold text-primary-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedStockIn.length === 0 ? (
                        <TableRow className="hover:bg-card/50">
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">No stock in records found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedStockIn.map((record, index) => (
                          <TableRow key={record.stock_in_id} className="hover:bg-card/50 transition-colors border-b border-primary/10">
                            <TableCell className="font-semibold text-primary">{startIndex + index + 1}</TableCell>
                            <TableCell className="font-medium text-foreground">{record.item_name || 'N/A'}</TableCell>
                            <TableCell className="text-foreground">{record.supplier_name || 'N/A'}</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-sm font-semibold">
                                {record.quantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-foreground">${record.purchase_price.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-foreground">{new Date(record.date_in).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary text-foreground">
                                View
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
                      Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, stockIn.length)} of {stockIn.length} records
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
