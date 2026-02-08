'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface InventoryReport {
  item_id: number;
  item_name: string;
  category_name: string;
  current_stock: number;
  purchase_price: number;
  selling_price: number;
  stock_value: number;
  total_sold: number;
}

export default function ExportReport({ data }: { data: InventoryReport[] }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);

    try {
      // Create CSV header
      const headers = [
        'Item Name',
        'Category',
        'Current Stock',
        'Purchase Price',
        'Selling Price',
        'Stock Value',
      ];

      // Create CSV rows
      const rows = data.map((item) => [
        item.item_name,
        item.category_name,
        item.current_stock,
        item.purchase_price.toFixed(2),
        item.selling_price.toFixed(2),
        item.stock_value.toFixed(2),
      ]);

      // Combine headers and rows
      const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `inventory-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    setIsExporting(true);

    try {
      const totalValue = data.reduce((sum, item) => sum + item.stock_value, 0);
      const totalUnits = data.reduce((sum, item) => sum + item.current_stock, 0);
      const exportData = {
        exportDate: new Date().toISOString(),
        totalItems: data.length,
        totalUnits,
        totalValue,
        items: data,
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `inventory-report-${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={exportToCSV}
        disabled={isExporting || data.length === 0}
        size="sm"
      >
        {isExporting ? 'Exporting...' : 'Export CSV'}
      </Button>
      <Button
        onClick={exportToJSON}
        disabled={isExporting || data.length === 0}
        size="sm"
        variant="outline"
      >
        {isExporting ? 'Exporting...' : 'Export JSON'}
      </Button>
    </div>
  );
}
