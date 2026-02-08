'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, Trash2, Pencil } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Add form states
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  
  // Edit form states
  const [editSupplierName, setEditSupplierName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');

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

  useEffect(() => {
    if (showEditDialog && selectedSupplier) {
      setEditSupplierName(selectedSupplier.supplier_name);
      setEditPhone(selectedSupplier.phone || '');
      setEditAddress(selectedSupplier.address || '');
    } else {
      setEditSupplierName('');
      setEditPhone('');
      setEditAddress('');
    }
  }, [showEditDialog, selectedSupplier]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/suppliers');
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      } else {
        setError('Failed to fetch suppliers');
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    if (!newSupplierName.trim()) {
      alert('Supplier name is required');
      return;
    }
    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier_name: newSupplierName,
          phone: newPhone || null,
          address: newAddress || null,
        }),
      });
      if (res.ok) {
        setNewSupplierName('');
        setNewPhone('');
        setNewAddress('');
        setShowAddDialog(false);
        fetchSuppliers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add supplier');
      }
    } catch (error) {
      console.error('Failed to add supplier:', error);
      alert('Error adding supplier');
    }
  };

  const handleEditSupplier = async () => {
    if (!selectedSupplier || !editSupplierName.trim()) {
      alert('Supplier name is required');
      return;
    }
    try {
      const res = await fetch(`/api/suppliers?id=${selectedSupplier.supplier_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier_name: editSupplierName,
          phone: editPhone || null,
          address: editAddress || null,
        }),
      });
      if (res.ok) {
        setShowEditDialog(false);
        setSelectedSupplier(null);
        fetchSuppliers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update supplier');
      }
    } catch (error) {
      console.error('Failed to edit supplier:', error);
      alert('Error updating supplier');
    }
  };

  const handleDeleteSupplier = async () => {
    if (!selectedSupplier) return;
    try {
      const res = await fetch(`/api/suppliers?id=${selectedSupplier.supplier_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedSupplier(null);
        setShowDeleteDialog(false);
        fetchSuppliers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete supplier');
      }
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      alert('Error deleting supplier');
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
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground mt-2">Manage your suppliers</p>
        </div>
        {user.role === 'admin' && (
          <>
            <Button 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={() => setShowAddDialog(true)}
            >
              Add
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                  <DialogDescription>Create a new supplier</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Supplier Name"
                    value={newSupplierName}
                    onChange={(e) => setNewSupplierName(e.target.value)}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                  <Input
                    placeholder="Address"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSupplier}>Add Supplier</Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update supplier information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Supplier Name"
              value={editSupplierName}
              onChange={(e) => setEditSupplierName(e.target.value)}
            />
            <Input
              placeholder="Phone Number"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
            <Input
              placeholder="Address"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSupplier}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete "{selectedSupplier?.supplier_name}"? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSupplier} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

        <CardContent className="pt-2">
          {loading ? (
            <div className="text-center py-2">
              <p className="text-muted-foreground text-sm">Loading suppliers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-2">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="overflow-hidden rounded-lg border border-primary/20">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-primary to-primary/70 border-b border-primary/20 h-10">
                      <TableHead className="font-bold text-primary-foreground w-12 text-sm px-3 py-2">No.</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Supplier Name</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Phone</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Address</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSuppliers.length === 0 ? (
                      <TableRow className="hover:bg-card/50">
                        <TableCell colSpan={5} className="text-center py-4 h-11">
                          <p className="text-muted-foreground text-sm">No suppliers found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedSuppliers.map((supplier, index) => (
                        <TableRow key={supplier.supplier_id} className="transition-colors border-b border-primary/10 hover:bg-card/50 h-11">
                          <TableCell className="font-semibold text-primary text-sm px-3 py-3">{startIndex + index + 1}</TableCell>
                          <TableCell className="font-medium text-foreground text-sm px-3 py-3">{supplier.supplier_name}</TableCell>
                          <TableCell className="text-foreground text-sm px-3 py-3">{supplier.phone || 'N/A'}</TableCell>
                          <TableCell className="text-foreground text-sm px-3 py-3">{supplier.address || 'N/A'}</TableCell>
                          <TableCell className="flex gap-1 px-3 py-3 justify-end">
                            {user?.role === 'admin' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setSelectedSupplier(supplier);
                                    setShowEditDialog(true);
                                  }}
                                  title="Edit supplier"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setSelectedSupplier(supplier);
                                    setShowDeleteDialog(true);
                                  }}
                                  title="Delete supplier"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-2">
                  <div className="text-xs text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, suppliers.length)} of {suppliers.length} suppliers
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 h-8"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1 px-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-primary text-white' : ''}`}
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
                      className="flex items-center gap-1 h-8"
                    >
                      Next
                      <ChevronRight className="w-3 h-3" />
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
