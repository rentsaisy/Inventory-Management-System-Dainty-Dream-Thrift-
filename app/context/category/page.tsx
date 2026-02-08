'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, Trash2, AlertCircle, Pencil } from 'lucide-react';

interface Category {
  category_id: number;
  category_name: string;
}

const ITEMS_PER_PAGE = 5;

export default function CategoryPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  // Initialize/clear edit field when dialog opens/closes
  useEffect(() => {
    if (showEditDialog && selectedCategory) {
      setEditCategoryName(selectedCategory.category_name);
    } else {
      setEditCategoryName('');
    }
  }, [showEditDialog, selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_name: newCategoryName }),
      });
      if (res.ok) {
        setNewCategoryName('');
        setShowAddDialog(false);
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !editCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      const res = await fetch(`/api/categories?id=${selectedCategory.category_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_name: editCategoryName }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setEditCategoryName('');
        setShowEditDialog(false);
        setSelectedCategory(null);
        await fetchCategories();
      } else {
        alert(data.error || 'Failed to update category');
      }
    } catch (error: any) {
      alert(`Error updating category: ${error.message}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      const res = await fetch(`/api/categories?id=${selectedCategory.category_id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setShowDeleteDialog(false);
          setShowDeleteWarning(true);
          return;
        }
        throw new Error(data.error || 'Failed to delete category');
      }

      setSelectedCategory(null);
      setShowDeleteDialog(false);
      await fetchCategories();
    } catch (error: any) {
      alert(`Error deleting category: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-2">Manage item categories</p>
        </div>
        <div className="flex gap-2" ref={buttonsRef}>
          {user.role === 'admin' && (
            <>
              <Button 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={() => setShowAddDialog(true)}
              >
                Add 
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>Create a new product category</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input
                      placeholder="Category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCategory}>Add Category</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category name</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Category name"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditCategory()}
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Warning Alert */}
      <AlertDialog open={showDeleteWarning} onOpenChange={setShowDeleteWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Cannot Delete Category
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This category cannot be deleted because there are items using it. Please move or delete those items first.
          </AlertDialogDescription>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete "{selectedCategory?.category_name}"? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

        <CardContent className="pt-2">
          {loading ? (
            <div className="text-center py-2">
              <p className="text-muted-foreground text-sm">Loading categories...</p>
            </div>
          ) : (
            <div className="space-y-1" ref={tableRef}>
                <div className="overflow-hidden rounded-lg border border-primary/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-primary to-primary/70 border-b border-primary/20 h-10">
                        <TableHead className="font-bold text-primary-foreground w-14 text-sm px-3 py-2">No.</TableHead>
                        <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Category Name</TableHead>
                        <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCategories.length === 0 ? (
                        <TableRow className="hover:bg-card/50">
                          <TableCell colSpan={3} className="text-center py-4 h-11">
                            <p className="text-muted-foreground text-sm">No categories found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedCategories.map((category, index) => (
                          <TableRow 
                            key={category.category_id}
                            className="transition-colors border-b border-primary/10 hover:bg-card/50 h-11"
                          >
                            <TableCell className="font-semibold text-primary text-sm px-3 py-3">{startIndex + index + 1}</TableCell>
                            <TableCell className="font-medium text-foreground text-sm px-3 py-3">{category.category_name}</TableCell>
                            <TableCell className="flex gap-1 px-3 py-3 justify-end">
                              {user.role === 'admin' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      setSelectedCategory(category);
                                      setEditCategoryName(category.category_name);
                                      setShowEditDialog(true);
                                    }}
                                    title="Edit category"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      setSelectedCategory(category);
                                      setShowDeleteDialog(true);
                                    }}
                                    title="Delete category"
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
                  <div className="flex items-center justify-between mt-5 px-2">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, categories.length)} of {categories.length} categories
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 h-8 px-3 text-sm"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-2 px-3">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={`h-8 w-8 text-sm ${currentPage === page ? 'bg-primary text-white' : ''}`}
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
                        className="flex items-center gap-1 h-8 px-3 text-sm"
                      >
                        Next
                        <ChevronRight className="w-3.5 h-3.5" />
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
