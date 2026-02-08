'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ItemCategory = 'clothing' | 'furniture' | 'electronics' | 'books' | 'other';
export type ItemCondition = 'excellent' | 'good' | 'fair' | 'poor';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  condition: ItemCondition;
  price: number;
  description: string;
  dateAdded: string;
  lastUpdated: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id' | 'dateAdded' | 'lastUpdated'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: '1',
    name: 'Vintage Denim Jacket',
    category: 'clothing',
    quantity: 3,
    condition: 'good',
    price: 24.99,
    description: 'Classic blue denim jacket from the 90s',
    dateAdded: '2024-01-15',
    lastUpdated: '2024-02-08',
  },
  {
    id: '2',
    name: 'Oak Wood Bookshelf',
    category: 'furniture',
    quantity: 1,
    condition: 'excellent',
    price: 89.99,
    description: 'Solid oak bookshelf, 5 shelves',
    dateAdded: '2024-01-20',
    lastUpdated: '2024-02-08',
  },
];

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    // Load from localStorage on mount
    const storedItems = localStorage.getItem('thrift_inventory');
    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems));
      } catch (error) {
        console.error('[v0] Failed to parse stored inventory:', error);
        setItems(INITIAL_ITEMS);
      }
    } else {
      setItems(INITIAL_ITEMS);
    }
  }, []);

  const addItem = (item: Omit<InventoryItem, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem('thrift_inventory', JSON.stringify(updatedItems));
  };

  const updateItem = (id: string, updatedData: Partial<InventoryItem>) => {
    const updatedItems = items.map((item) =>
      item.id === id
        ? {
            ...item,
            ...updatedData,
            lastUpdated: new Date().toISOString().split('T')[0],
          }
        : item
    );
    setItems(updatedItems);
    localStorage.setItem('thrift_inventory', JSON.stringify(updatedItems));
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem('thrift_inventory', JSON.stringify(updatedItems));
  };

  const getItem = (id: string) => items.find((item) => item.id === id);

  return (
    <InventoryContext.Provider value={{ items, addItem, updateItem, deleteItem, getItem }}>
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
