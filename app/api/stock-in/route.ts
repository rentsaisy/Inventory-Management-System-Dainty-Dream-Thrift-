import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const stockIn = await query(`
      SELECT s.*, i.item_name, sup.supplier_name, u.username
      FROM stock_in s
      LEFT JOIN items i ON s.item_id = i.item_id
      LEFT JOIN suppliers sup ON s.supplier_id = sup.supplier_id
      LEFT JOIN users u ON s.user_id = u.user_id
      ORDER BY s.date_in DESC
    `);
    return NextResponse.json(stockIn);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stock in records' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { item_id, supplier_id, quantity, purchase_price, date_in, user_id } = await request.json();

    if (!item_id || !supplier_id || !quantity || !date_in || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO stock_in (item_id, supplier_id, quantity, purchase_price, date_in, user_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [item_id, supplier_id, quantity, purchase_price || null, date_in, user_id]
    );

    // Update current stock in items table
    await query(
      'UPDATE items SET current_stock = current_stock + ? WHERE item_id = ?',
      [quantity, item_id]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to create stock in record' },
      { status: 500 }
    );
  }
}
