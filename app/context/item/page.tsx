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

interface Category {
  category_id: number;
  category_name: string;
}

interface Item {
  item_id: number;
  item_name: string;
  category_id: number;
  category_name?: string;
  purchase_price: number;
  selling_price: number;
  current_stock: number;
  created_at?: string;
  image?: string;
}

const ITEMS_PER_PAGE = 5;

export default function ItemPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Add form states
  const [newItemName, setNewItemName] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newPurchasePrice, setNewPurchasePrice] = useState('');
  const [newSellingPrice, setNewSellingPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newImage, setNewImage] = useState('');
  
  // Edit form states
  const [editItemName, setEditItemName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editPurchasePrice, setEditPurchasePrice] = useState('');
  const [editSellingPrice, setEditSellingPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editImage, setEditImage] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchItems();
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    if (showEditDialog && selectedItem) {
      setEditItemName(selectedItem.item_name);
      setEditCategoryId(String(selectedItem.category_id));
      setEditPurchasePrice(String(selectedItem.purchase_price));
      setEditSellingPrice(String(selectedItem.selling_price));
      setEditStock(String(selectedItem.current_stock));
      setEditImage(selectedItem.image || '');
    } else {
      setEditItemName('');
      setEditCategoryId('');
      setEditPurchasePrice('');
      setEditSellingPrice('');
      setEditStock('');
      setEditImage('');
    }
  }, [showEditDialog, selectedItem]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/items');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        setError('Failed to fetch items');
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEdit) {
          setEditImage(base64String);
        } else {
          setNewImage(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !newCategoryId || !newPurchasePrice || !newSellingPrice || !newStock) {
      alert('All fields are required');
      return;
    }
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: newItemName,
          category_id: Number(newCategoryId),
          purchase_price: Number(newPurchasePrice),
          selling_price: Number(newSellingPrice),
          current_stock: Number(newStock),
          image: newImage || null,
        }),
      });
      if (res.ok) {
        setNewItemName('');
        setNewCategoryId('');
        setNewPurchasePrice('');
        setNewSellingPrice('');
        setNewStock('');
        setNewImage('');
        setShowAddDialog(false);
        fetchItems();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add item');
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Error adding item');
    }
  };

  const handleEditItem = async () => {
    if (!selectedItem || !editItemName.trim() || !editCategoryId || !editPurchasePrice || !editSellingPrice || !editStock) {
      alert('All fields are required');
      return;
    }
    try {
      const res = await fetch(`/api/items?id=${selectedItem.item_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: editItemName,
          category_id: Number(editCategoryId),
          purchase_price: Number(editPurchasePrice),
          selling_price: Number(editSellingPrice),
          current_stock: Number(editStock),
          image: editImage || null,
        }),
      });
      if (res.ok) {
        setShowEditDialog(false);
        setSelectedItem(null);
        fetchItems();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update item');
      }
    } catch (error) {
      console.error('Failed to edit item:', error);
      alert('Error updating item');
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    try {
      const res = await fetch(`/api/items?id=${selectedItem.item_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedItem(null);
        setShowDeleteDialog(false);
        fetchItems();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Error deleting item');
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
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Items</h1>
          <p className="text-muted-foreground mt-2">Manage your inventory items</p>
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
                  <DialogTitle>Add New Item</DialogTitle>
                  <DialogDescription>Create a new item</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Item Name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <Select value={newCategoryId} onValueChange={setNewCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                          {cat.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Purchase Price"
                    type="number"
                    step="0.01"
                    value={newPurchasePrice}
                    onChange={(e) => setNewPurchasePrice(e.target.value)}
                  />
                  <Input
                    placeholder="Selling Price"
                    type="number"
                    step="0.01"
                    value={newSellingPrice}
                    onChange={(e) => setNewSellingPrice(e.target.value)}
                  />
                  <Input
                    placeholder="Stock"
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                  />
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                      id="add-image-input"
                    />
                    <label htmlFor="add-image-input" className="cursor-pointer">
                      <div className="text-sm text-muted-foreground">Click to upload image</div>
                      {newImage && <div className="text-xs text-primary mt-1">Image selected</div>}
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem}>Add Item</Button>
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
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update item information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Item Name"
              value={editItemName}
              onChange={(e) => setEditItemName(e.target.value)}
            />
            <Select value={editCategoryId} onValueChange={setEditCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                    {cat.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Purchase Price"
              type="number"
              step="0.01"
              value={editPurchasePrice}
              onChange={(e) => setEditPurchasePrice(e.target.value)}
            />
            <Input
              placeholder="Selling Price"
              type="number"
              step="0.01"
              value={editSellingPrice}
              onChange={(e) => setEditSellingPrice(e.target.value)}
            />
            <Input
              placeholder="Stock"
              type="number"
              value={editStock}
              onChange={(e) => setEditStock(e.target.value)}
            />
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                className="hidden"
                id="edit-image-input"
              />
              <label htmlFor="edit-image-input" className="cursor-pointer">
                <div className="text-sm text-muted-foreground">Click to upload image</div>
                {editImage && <div className="text-xs text-primary mt-1">Image selected</div>}
              </label>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditItem}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete "{selectedItem?.item_name}"? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

        <CardContent className="pt-2">
          {loading ? (
            <div className="text-center py-2">
              <p className="text-muted-foreground text-sm">Loading items...</p>
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
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Item Name</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Image</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Category</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Purchase Price</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Selling Price</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Stock</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.length === 0 ? (
                      <TableRow className="hover:bg-card/50">
                        <TableCell colSpan={8} className="text-center py-4 h-11">
                          <p className="text-muted-foreground text-sm">No items found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedItems.map((item, index) => (
                        <TableRow key={item.item_id} className="transition-colors border-b border-primary/10 hover:bg-card/50 h-11">
                          <TableCell className="font-semibold text-primary text-sm px-3 py-3">{startIndex + index + 1}</TableCell>
                          <TableCell className="font-medium text-foreground text-sm px-3 py-3">{item.item_name}</TableCell>
                          <TableCell className="text-sm px-3 py-3">
                            {item.image ? (
                              <img src={item.image} alt={item.item_name} className="h-8 w-8 object-cover rounded" />
                            ) : (
                              <span className="text-muted-foreground text-xs">No image</span>
                            )}
                          </TableCell>
                          <TableCell className="text-foreground text-sm px-3 py-3">{item.category_name || 'N/A'}</TableCell>
                          <TableCell className="text-foreground text-sm px-3 py-3">${item.purchase_price.toFixed(2)}</TableCell>
                          <TableCell className="text-foreground text-sm px-3 py-3">${item.selling_price.toFixed(2)}</TableCell>
                          <TableCell className="text-sm px-3 py-3">
                            <span className={`px-2 py-1 rounded-full inline-block text-xs font-semibold ${
                              item.current_stock < 10 ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                            }`}>
                              {item.current_stock}
                            </span>
                          </TableCell>
                          <TableCell className="flex gap-1 px-3 py-3 justify-end">
                            {user?.role === 'admin' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setShowEditDialog(true);
                                  }}
                                  title="Edit item"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setShowDeleteDialog(true);
                                  }}
                                  title="Delete item"
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
                    Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, items.length)} of {items.length} items
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
