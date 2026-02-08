'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Item {
  item_id: number;
  item_name: string;
  category_id: number;
  size?: string;
  color?: string;
  brand?: string;
  purchase_price: number;
  selling_price: number;
  current_stock: number;
  category_name?: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  description?: string;
}

export interface Supplier {
  supplier_id: number;
  supplier_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface StockIn {
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

export interface StockOut {
  stock_out_id: number;
  item_id: number;
  quantity: number;
  selling_price: number;
  date_out: string;
  user_id: number;
  item_name?: string;
  username?: string;
}

interface InventoryContextType {
  items: Item[];
  categories: Category[];
  suppliers: Supplier[];
  stockIn: StockIn[];
  stockOut: StockOut[];
  loading: boolean;
  refreshItems: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshSuppliers: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stockIn, setStockIn] = useState<StockIn[]>([]);
  const [stockOut, setStockOut] = useState<StockOut[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/items');
      if (res.ok) {
        setItems(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSuppliers = async () => {
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

  return (
    <InventoryContext.Provider
      value={{
        items,
        categories,
        suppliers,
        stockIn,
        stockOut,
        loading,
        refreshItems,
        refreshCategories,
        refreshSuppliers,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
