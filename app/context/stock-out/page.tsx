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

interface Item {
  item_id: number;
  item_name: string;
  selling_price: number;
  current_stock: number;
}

const ITEMS_PER_PAGE = 5;

export default function StockOutPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stockOut, setStockOut] = useState<StockOut[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStockOut, setSelectedStockOut] = useState<StockOut | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Add form states
  const [newItemId, setNewItemId] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newDateOut, setNewDateOut] = useState('');

  // Edit form states
  const [editItemId, setEditItemId] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editSellingPrice, setEditSellingPrice] = useState('');
  const [editDateOut, setEditDateOut] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchStockOut();
      fetchItems();
    }
  }, [user]);

  useEffect(() => {
    if (showEditDialog && selectedStockOut) {
      setEditItemId(String(selectedStockOut.item_id));
      setEditQuantity(String(selectedStockOut.quantity));
      setEditSellingPrice(String(selectedStockOut.selling_price));
      setEditDateOut(selectedStockOut.date_out);
    } else {
      setEditItemId('');
      setEditQuantity('');
      setEditSellingPrice('');
      setEditDateOut('');
    }
  }, [showEditDialog, selectedStockOut]);

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

  const handleAddStockOut = async () => {
    if (!newItemId || !newQuantity || !newDateOut) {
      alert('All fields are required');
      return;
    }
    try {
      const selectedItem = items.find(item => item.item_id === Number(newItemId));
      if (!selectedItem) {
        alert('Selected item not found');
        return;
      }
      if (Number(newQuantity) > selectedItem.current_stock) {
        alert('Quantity exceeds available stock');
        return;
      }
      const res = await fetch('/api/stock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: Number(newItemId),
          quantity: Number(newQuantity),
          selling_price: selectedItem.selling_price,
          date_out: newDateOut,
        }),
      });
      if (res.ok) {
        setNewItemId('');
        setNewQuantity('');
        setNewDateOut('');
        setShowAddDialog(false);
        fetchStockOut();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add stock out record');
      }
    } catch (error) {
      console.error('Failed to add stock out:', error);
      alert('Error adding stock out record');
    }
  };

  const handleEditStockOut = async () => {
    if (!selectedStockOut || !editItemId || !editQuantity || !editSellingPrice || !editDateOut) {
      alert('All fields are required');
      return;
    }
    try {
      const res = await fetch(`/api/stock-out?id=${selectedStockOut.stock_out_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: Number(editItemId),
          quantity: Number(editQuantity),
          selling_price: Number(editSellingPrice),
          date_out: editDateOut,
        }),
      });
      if (res.ok) {
        setShowEditDialog(false);
        setSelectedStockOut(null);
        fetchStockOut();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update stock out record');
      }
    } catch (error) {
      console.error('Failed to edit stock out:', error);
      alert('Error updating stock out record');
    }
  };

  const handleDeleteStockOut = async () => {
    if (!selectedStockOut) return;
    try {
      const res = await fetch(`/api/stock-out?id=${selectedStockOut.stock_out_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedStockOut(null);
        setShowDeleteDialog(false);
        fetchStockOut();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete stock out record');
      }
    } catch (error) {
      console.error('Failed to delete stock out:', error);
      alert('Error deleting stock out record');
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

  const totalPages = Math.ceil(stockOut.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStockOut = stockOut.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Stock Out</h1>
          <p className="text-muted-foreground mt-2">Record outgoing inventory</p>
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
                  <DialogTitle>Add Stock Out</DialogTitle>
                  <DialogDescription>Record outgoing inventory</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Select value={newItemId} onValueChange={setNewItemId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.item_id} value={String(item.item_id)}>
                          {item.item_name} (Stock: {item.current_stock})
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
                    placeholder="Date Out"
                    type="date"
                    value={newDateOut}
                    onChange={(e) => setNewDateOut(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStockOut}>Add Stock Out</Button>
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
            <DialogTitle>Edit Stock Out</DialogTitle>
            <DialogDescription>Update stock out record</DialogDescription>
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
            <Input
              placeholder="Quantity"
              type="number"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
            />
            <Input
              placeholder="Selling Price"
              type="number"
              step="0.01"
              value={editSellingPrice}
              onChange={(e) => setEditSellingPrice(e.target.value)}
            />
            <Input
              placeholder="Date Out"
              type="date"
              value={editDateOut}
              onChange={(e) => setEditDateOut(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStockOut}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stock Out Record</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this stock out record? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStockOut} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <CardContent className="pt-2">
        {loading ? (
          <div className="text-center py-2">
            <p className="text-muted-foreground text-sm">Loading stock out records...</p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="overflow-hidden rounded-lg border border-primary/20">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-primary to-primary/70 border-b border-primary/20 h-10">
                    <TableHead className="font-bold text-primary-foreground w-12 text-sm px-3 py-2">No.</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Item</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-center">Quantity</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Selling Price</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Total</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Date</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStockOut.length === 0 ? (
                    <TableRow className="hover:bg-card/50">
                      <TableCell colSpan={7} className="text-center py-4 h-11">
                        <p className="text-muted-foreground text-sm">No stock out records found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedStockOut.map((record, index) => (
                      <TableRow key={record.stock_out_id} className="transition-colors border-b border-primary/10 hover:bg-card/50 h-11">
                        <TableCell className="font-semibold text-primary text-sm px-3 py-3">{startIndex + index + 1}</TableCell>
                        <TableCell className="font-medium text-foreground text-sm px-3 py-3">{record.item_name || 'N/A'}</TableCell>
                        <TableCell className="text-center text-sm px-3 py-3">
                          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs font-semibold">
                            {record.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-foreground text-sm px-3 py-3">${record.selling_price.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-foreground text-sm px-3 py-3 font-semibold">${(record.quantity * record.selling_price).toFixed(2)}</TableCell>
                        <TableCell className="text-right text-foreground text-sm px-3 py-3">{new Date(record.date_out).toLocaleDateString()}</TableCell>
                        <TableCell className="flex gap-1 px-3 py-3 justify-end">
                          {user?.role === 'admin' && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  setSelectedStockOut(record);
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
                                  setSelectedStockOut(record);
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
                  Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, stockOut.length)} of {stockOut.length} records
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
