'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Supplier {
  supplier_id: number;
  supplier_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
}

const ITEMS_PER_PAGE = 5;

export default function SupplierPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchSuppliers();
    }
  }, [user]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/suppliers');
      if (res.ok) {
        setSuppliers(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
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

  const totalPages = Math.ceil(suppliers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSuppliers = suppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Suppliers</h1>
            <p className="text-muted-foreground mt-2">Manage your suppliers</p>
          </div>
          {user.role === 'admin' && <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">Add Supplier</Button>}
        </div>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
            <CardTitle>Suppliers List</CardTitle>
            <CardDescription>All suppliers in your system ({suppliers.length} total)</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading suppliers...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-primary/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 hover:bg-gradient-to-r hover:from-primary/15 hover:to-primary/10">
                        <TableHead className="font-bold text-foreground w-12">No.</TableHead>
                        <TableHead className="font-bold text-foreground">Supplier Name</TableHead>
                        <TableHead className="font-bold text-foreground">Contact Person</TableHead>
                        <TableHead className="font-bold text-foreground">Phone</TableHead>
                        <TableHead className="font-bold text-foreground">Email</TableHead>
                        {user.role === 'admin' && <TableHead className="font-bold text-foreground text-right">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSuppliers.length === 0 ? (
                        <TableRow className="hover:bg-primary/5">
                          <TableCell colSpan={user.role === 'admin' ? 6 : 5} className="text-center py-8">
                            <p className="text-muted-foreground">No suppliers found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedSuppliers.map((supplier, index) => (
                          <TableRow key={supplier.supplier_id} className="hover:bg-primary/5 transition-colors border-b border-primary/10">
                            <TableCell className="font-semibold text-primary">{startIndex + index + 1}</TableCell>
                            <TableCell className="font-medium">{supplier.supplier_name}</TableCell>
                            <TableCell>{supplier.contact_person || 'N/A'}</TableCell>
                            <TableCell>{supplier.phone || 'N/A'}</TableCell>
                            <TableCell>{supplier.email || 'N/A'}</TableCell>
                            {user.role === 'admin' && (
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                                  Edit
                                </Button>
                              </TableCell>
                            )}
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
                      Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, suppliers.length)} of {suppliers.length} suppliers
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
        </Card>
      </div>
    );
  }
