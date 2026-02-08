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
    const { item_name, category_id, size, color, brand, purchase_price, selling_price, current_stock } = await request.json();

    if (!item_name || !category_id) {
      return NextResponse.json(
        { error: 'Item name and category are required' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO items (item_name, category_id, size, color, brand, purchase_price, selling_price, current_stock) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [item_name, category_id, size || null, color || null, brand || null, purchase_price || 0, selling_price || 0, current_stock || 0]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
