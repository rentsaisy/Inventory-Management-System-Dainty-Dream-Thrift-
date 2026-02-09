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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Trash2, Pencil } from 'lucide-react';

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

interface Item {
  item_id: number;
  item_name: string;
  purchase_price: number;
}

interface Supplier {
  supplier_id: number;
  supplier_name: string;
}

const ITEMS_PER_PAGE = 5;

export default function StockInPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stockIn, setStockIn] = useState<StockIn[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStockIn, setSelectedStockIn] = useState<StockIn | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Add form states
  const [newItemId, setNewItemId] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newDateIn, setNewDateIn] = useState('');

  // Edit form states
  const [editItemId, setEditItemId] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editPurchasePrice, setEditPurchasePrice] = useState('');
  const [editDateIn, setEditDateIn] = useState('');
  const [editSupplierId, setEditSupplierId] = useState('');
  const [editReferenceNo, setEditReferenceNo] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchStockIn();
      fetchItems();
      fetchSuppliers();
    }
  }, [user]);

  useEffect(() => {
    if (showEditDialog && selectedStockIn) {
      setEditItemId(String(selectedStockIn.item_id));
      setEditQuantity(String(selectedStockIn.quantity));
      setEditPurchasePrice(String(selectedStockIn.purchase_price));
      setEditDateIn(selectedStockIn.date_in);
      setEditSupplierId(String(selectedStockIn.supplier_id));
      setEditReferenceNo(selectedStockIn.reference_no || '');
    } else {
      setEditItemId('');
      setEditQuantity('');
      setEditPurchasePrice('');
      setEditDateIn('');
      setEditSupplierId('');
      setEditReferenceNo('');
    }
  }, [showEditDialog, selectedStockIn]);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/suppliers');
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

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

  const handleAddStockIn = async () => {
    if (!newItemId || !newQuantity || !newDateIn) {
      alert('All fields are required');
      return;
    }
    try {
      const selectedItem = items.find(item => item.item_id === Number(newItemId));
      if (!selectedItem) {
        alert('Selected item not found');
        return;
      }
      const res = await fetch('/api/stock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: Number(newItemId),
          quantity: Number(newQuantity),
          purchase_price: selectedItem.purchase_price,
          date_in: newDateIn,
        }),
      });
      if (res.ok) {
        setNewItemId('');
        setNewQuantity('');
        setNewDateIn('');
        setShowAddDialog(false);
        fetchStockIn();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add stock in record');
      }
    } catch (error) {
      console.error('Failed to add stock in:', error);
      alert('Error adding stock in record');
    }
  };

  const handleEditStockIn = async () => {
    if (!selectedStockIn || !editItemId || !editQuantity || !editPurchasePrice || !editDateIn || !editSupplierId) {
      alert('All fields are required');
      return;
    }
    try {
      const res = await fetch(`/api/stock-in?id=${selectedStockIn.stock_in_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: Number(editItemId),
          quantity: Number(editQuantity),
          purchase_price: Number(editPurchasePrice),
          date_in: editDateIn,
          supplier_id: Number(editSupplierId),
          reference_no: editReferenceNo || null,
        }),
      });
      if (res.ok) {
        setShowEditDialog(false);
        setSelectedStockIn(null);
        fetchStockIn();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update stock in record');
      }
    } catch (error) {
      console.error('Failed to edit stock in:', error);
      alert('Error updating stock in record');
    }
  };

  const handleDeleteStockIn = async () => {
    if (!selectedStockIn) return;
    try {
      const res = await fetch(`/api/stock-in?id=${selectedStockIn.stock_in_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedStockIn(null);
        setShowDeleteDialog(false);
        fetchStockIn();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete stock in record');
      }
    } catch (error) {
      console.error('Failed to delete stock in:', error);
      alert('Error deleting stock in record');
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
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Stock In</h1>
          <p className="text-muted-foreground mt-2">Record incoming inventory</p>
        </div>
        {user.role === 'admin' && (
          <>
            <Button
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={() => setShowAddDialog(true)}
            >
              Add
            </Button>

            {/* Add Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Stock In</DialogTitle>
                  <DialogDescription>Record new incoming inventory</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Select value={newItemId} onValueChange={setNewItemId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.item_id} value={String(item.item_id)}>
                          {item.item_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                  />
                  <Input
                    placeholder="Date In"
                    type="date"
                    value={newDateIn}
                    onChange={(e) => setNewDateIn(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStockIn}>Add Stock In</Button>
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
            <DialogTitle>Edit Stock In</DialogTitle>
            <DialogDescription>Update stock in record</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={editItemId} onValueChange={setEditItemId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an item" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.item_id} value={String(item.item_id)}>
                    {item.item_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={editSupplierId} onValueChange={setEditSupplierId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.supplier_id} value={String(supplier.supplier_id)}>
                    {supplier.supplier_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Quantity"
              type="number"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
            />
            <Input
              placeholder="Purchase Price"
              type="number"
              step="0.01"
              value={editPurchasePrice}
              onChange={(e) => setEditPurchasePrice(e.target.value)}
            />
            <Input
              placeholder="Date In"
              type="date"
              value={editDateIn}
              onChange={(e) => setEditDateIn(e.target.value)}
            />
            <Input
              placeholder="Reference No (optional)"
              value={editReferenceNo}
              onChange={(e) => setEditReferenceNo(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStockIn}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stock In Record</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this stock in record? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStockIn} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <CardContent className="pt-2">
        {loading ? (
          <div className="text-center py-2">
            <p className="text-muted-foreground text-sm">Loading stock in records...</p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="overflow-hidden rounded-lg border border-primary/20">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-primary to-primary/70 border-b border-primary/20 h-10">
                    <TableHead className="font-bold text-primary-foreground w-12 text-sm px-3 py-2">No.</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Item</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Supplier</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-center">Quantity</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Purchase Price</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Total</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Date</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStockIn.length === 0 ? (
                    <TableRow className="hover:bg-card/50">
                      <TableCell colSpan={8} className="text-center py-4 h-11">
                        <p className="text-muted-foreground text-sm">No stock in records found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedStockIn.map((record, index) => (
                      <TableRow key={record.stock_in_id} className="transition-colors border-b border-primary/10 hover:bg-card/50 h-11">
                        <TableCell className="font-semibold text-primary text-sm px-3 py-3">{startIndex + index + 1}</TableCell>
                        <TableCell className="font-medium text-foreground text-sm px-3 py-3">{record.item_name || 'N/A'}</TableCell>
                        <TableCell className="text-foreground text-sm px-3 py-3">{record.supplier_name || 'N/A'}</TableCell>
                        <TableCell className="text-center text-sm px-3 py-3">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-semibold">
                            {record.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-foreground text-sm px-3 py-3">${record.purchase_price.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-foreground text-sm px-3 py-3 font-semibold">${(record.quantity * record.purchase_price).toFixed(2)}</TableCell>
                        <TableCell className="text-right text-foreground text-sm px-3 py-3">{new Date(record.date_in).toLocaleDateString()}</TableCell>
                        <TableCell className="flex gap-1 px-3 py-3 justify-end">
                          {user?.role === 'admin' && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  setSelectedStockIn(record);
                                  setShowEditDialog(true);
                                }}
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  setSelectedStockIn(record);
                                  setShowDeleteDialog(true);
                                }}
                                title="Delete record"
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
                  Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, stockIn.length)} of {stockIn.length} records
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
