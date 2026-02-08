'use client';

import React from "react"

import AppLayout from '@/components/AppLayout';
import { useInventory, type ItemCategory, type ItemCondition } from '@/app/context/InventoryContext';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';

const categories: ItemCategory[] = ['clothing', 'furniture', 'electronics', 'books', 'other'];
const conditions: ItemCondition[] = ['excellent', 'good', 'fair', 'poor'];

export default function EditItemPage() {
  const params = useParams();
  const id = params.id as string;
  const { getItem, updateItem, deleteItem } = useInventory();
  const router = useRouter();

  const item = getItem(id);

  const [formData, setFormData] = useState({
    name: '',
    category: 'clothing' as ItemCategory,
    quantity: 1,
    condition: 'good' as ItemCondition,
    price: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        condition: item.condition,
        price: item.price.toString(),
        description: item.description,
      });
    }
  }, [item]);

  if (!item) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Item not found</p>
          <Button
            onClick={() => router.push('/dashboard/inventory')}
            className="mt-4 bg-primary hover:bg-primary/90 text-white"
          >
            Back to Inventory
          </Button>
        </div>
      </AppLayout>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.price || Number(formData.price) < 0) newErrors.price = 'Valid price is required';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      updateItem(id, {
        name: formData.name,
        category: formData.category,
        quantity: formData.quantity,
        condition: formData.condition,
        price: Number(formData.price),
        description: formData.description,
      });

      router.push('/dashboard/inventory');
    } catch (error) {
      console.error('[v0] Error updating item:', error);
      setErrors({ submit: 'Failed to update item' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    deleteItem(id);
    router.push('/dashboard/inventory');
  };

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Item</h1>
          <p className="text-muted-foreground mt-1">Update item details</p>
        </div>

        {/* Form Card */}
        <Card className="border-primary/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
                {errors.submit}
              </div>
            )}

            {/* Item Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-semibold">
                Item Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Vintage Leather Jacket"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-card border-primary/30 text-foreground"
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>

            {/* Category and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-foreground font-semibold">
                  Category
                </Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ItemCategory })}
                  className="w-full px-4 py-2 rounded-lg bg-card border border-primary/30 text-foreground cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-card">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition" className="text-foreground font-semibold">
                  Condition
                </Label>
                <select
                  id="condition"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as ItemCondition })}
                  className="w-full px-4 py-2 rounded-lg bg-card border border-primary/30 text-foreground cursor-pointer"
                >
                  {conditions.map((cond) => (
                    <option key={cond} value={cond} className="bg-card">
                      {cond.charAt(0).toUpperCase() + cond.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-foreground font-semibold">
                  Quantity *
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Math.max(0, Number(e.target.value)) })}
                  className="bg-card border-primary/30 text-foreground"
                />
                {errors.quantity && <p className="text-red-600 text-sm">{errors.quantity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-foreground font-semibold">
                  Price ($) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-card border-primary/30 text-foreground"
                />
                {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Add item details, brand, size, etc."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-card border-primary/30 text-foreground min-h-24"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-6"
              >
                {isSubmitting ? 'Updating...' : 'Update Item'}
              </Button>
              <Button
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className="flex-1 border-primary/30 text-foreground hover:bg-primary/10"
              >
                Cancel
              </Button>
            </div>

            {/* Delete Button */}
            <div className="pt-4 border-t border-primary/20">
              {showDeleteConfirm ? (
                <div className="space-y-4">
                  <p className="text-red-600 font-semibold">Are you sure? This cannot be undone.</p>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={handleDelete}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Confirm Delete
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="outline"
                      className="flex-1 border-primary/30"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-500/20 text-red-600 hover:bg-red-500/30 border border-red-500/30"
                >
                  Delete Item
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
