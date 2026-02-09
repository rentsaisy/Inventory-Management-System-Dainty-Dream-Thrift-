import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const items = await query(`
      SELECT i.*, c.category_name
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.category_id
      ORDER BY i.item_name ASC
    `);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const itemId = url.searchParams.get('id');
    const body = await request.json();
    
    // Update existing item
    if (itemId) {
      const { item_name, category_id, purchase_price, selling_price, current_stock, image } = body;
      
      if (!item_name || !category_id) {
        return NextResponse.json(
          { error: 'Item name and category are required' },
          { status: 400 }
        );
      }

      await query(
        'UPDATE items SET item_name = ?, category_id = ?, purchase_price = ?, selling_price = ?, current_stock = ?, image = ? WHERE item_id = ?',
        [item_name, category_id, purchase_price || 0, selling_price || 0, current_stock || 0, image || null, itemId]
      );
      return NextResponse.json({ success: true });
    }
    
    // Create new item
    const { item_name, category_id, purchase_price, selling_price, current_stock, image } = body;

    if (!item_name || !category_id) {
      return NextResponse.json(
        { error: 'Item name and category are required' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO items (item_name, category_id, purchase_price, selling_price, current_stock, image) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [item_name, category_id, purchase_price || 0, selling_price || 0, current_stock || 0, image || null]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process item request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const itemId = url.searchParams.get('id');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    await query('DELETE FROM items WHERE item_id = ?', [itemId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
