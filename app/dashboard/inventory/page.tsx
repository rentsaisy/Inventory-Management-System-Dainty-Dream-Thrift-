'use client';

import AppLayout from '@/components/AppLayout';
import { useInventory, type InventoryItem } from '@/app/context/InventoryContext';
import { useAuth } from '@/app/context/AuthContext';
import ExportReport from '@/components/ExportReport';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function InventoryPage() {
  const { items, updateItem, deleteItem } = useInventory();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(items.map((item) => item.category))];

  const conditionColors = {
    excellent: 'bg-green-500/20 text-green-700',
    good: 'bg-blue-500/20 text-blue-700',
    fair: 'bg-yellow-500/20 text-yellow-700',
    poor: 'bg-red-500/20 text-red-700',
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateItem(id, { quantity: Math.max(0, newQuantity) });
    setEditingId(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground mt-1">Manage and track all store items</p>
          </div>
          {user?.role === 'admin' || user?.role === 'staff' ? (
            <Link href="/dashboard/add-item">
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Item
              </Button>
            </Link>
          ) : null}
        </div>

        {/* Filters */}
        <Card className="border-primary/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Search Items</label>
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-card border-primary/30 text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Filter by Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-card border border-primary/30 text-foreground cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-card text-foreground">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Inventory Table */}
        {filteredItems.length > 0 ? (
          <Card className="border-primary/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/20 bg-card/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Item Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Condition</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total Value</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Updated</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-foreground">{item.name}</td>
                      <td className="px-6 py-4 text-muted-foreground capitalize">{item.category}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            conditionColors[item.condition]
                          }`}
                        >
                          {item.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {editingId === item.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(Number(e.target.value))}
                              className="w-16 bg-card border-primary/30"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, editQuantity)}
                              className="bg-primary text-white"
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditQuantity(item.quantity);
                            }}
                            className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            {item.quantity}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.lastUpdated}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/edit-item/${item.id}`}>
                            <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
                              Edit
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-red-500/20 text-red-600 hover:bg-red-500/30 border border-red-500/30"
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-primary/20 bg-card">
                              <AlertDialogTitle className="text-foreground">Delete Item</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                Are you sure you want to delete {item.name}? This action cannot be undone.
                              </AlertDialogDescription>
                              <div className="flex gap-3 justify-end mt-4">
                                <AlertDialogCancel className="border-primary/20">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteItem(item.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="border-primary/20 p-12 text-center">
            <p className="text-muted-foreground text-lg">
              {items.length === 0 ? 'No items in inventory yet' : 'No items match your search'}
            </p>
            {items.length === 0 && (
              <Link href="/dashboard/add-item">
                <Button className="mt-4 bg-primary hover:bg-primary/90 text-white">Add First Item</Button>
              </Link>
            )}
          </Card>
        )}

        {/* Export Section */}
        {items.length > 0 && (
          <ExportReport />
        )}
      </div>
    </AppLayout>
  );
}
