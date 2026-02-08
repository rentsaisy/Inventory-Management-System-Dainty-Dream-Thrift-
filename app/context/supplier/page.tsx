'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Supplier {
  supplier_id: number;
  supplier_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export default function SupplierPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Suppliers</h1>
            <p className="text-muted-foreground mt-2">Manage your suppliers</p>
          </div>
          {user.role === 'admin' && <Button>Add Supplier</Button>}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suppliers List</CardTitle>
            <CardDescription>All suppliers in your system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading suppliers...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier Name</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      {user.role === 'admin' && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={user.role === 'admin' ? 5 : 4} className="text-center py-8">
                          <p className="text-muted-foreground">No suppliers found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      suppliers.map((supplier) => (
                        <TableRow key={supplier.supplier_id}>
                          <TableCell className="font-medium">{supplier.supplier_name}</TableCell>
                          <TableCell>{supplier.contact_person || 'N/A'}</TableCell>
                          <TableCell>{supplier.phone || 'N/A'}</TableCell>
                          <TableCell>{supplier.email || 'N/A'}</TableCell>
                          {user.role === 'admin' && (
                            <TableCell>
                              <Button variant="ghost" size="sm">
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
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
