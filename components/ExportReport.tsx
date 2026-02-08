'use client';

import { useInventory } from '@/app/context/InventoryContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

export default function ExportReport() {
  const { items } = useInventory();
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);

    try {
      // Create CSV header
      const headers = [
        'Item Name',
        'Category',
        'Condition',
        'Quantity',
        'Unit Price',
        'Total Value',
        'Description',
        'Date Added',
        'Last Updated',
      ];

      // Create CSV rows
      const rows = items.map((item) => [
        item.name,
        item.category,
        item.condition,
        item.quantity,
        item.price.toFixed(2),
        (item.quantity * item.price).toFixed(2),
        item.description,
        item.dateAdded,
        item.lastUpdated,
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
      console.error('[v0] Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    setIsExporting(true);

    try {
      const data = {
        exportDate: new Date().toISOString(),
        totalItems: items.length,
        totalUnits: items.reduce((sum, item) => sum + item.quantity, 0),
        totalValue: items.reduce((sum, item) => sum + item.quantity * item.price, 0),
        items: items,
      };

      const jsonContent = JSON.stringify(data, null, 2);
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
      console.error('[v0] Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="border-primary/20 p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Export Inventory Report</h2>
      <p className="text-muted-foreground text-sm mb-6">Download your inventory data in CSV or JSON format</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={exportToCSV}
          disabled={isExporting || items.length === 0}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-6"
        >
          {isExporting ? 'Exporting...' : 'Export as CSV'}
        </Button>
        <Button
          onClick={exportToJSON}
          disabled={isExporting || items.length === 0}
          className="bg-accent hover:bg-accent/90 text-foreground font-semibold py-6"
        >
          {isExporting ? 'Exporting...' : 'Export as JSON'}
        </Button>
      </div>

      {items.length === 0 && <p className="text-muted-foreground text-sm mt-4">No items to export</p>}
    </Card>
  );
}
