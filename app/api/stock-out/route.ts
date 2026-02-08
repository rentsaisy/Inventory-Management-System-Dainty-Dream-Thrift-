import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const stockOut = await query(`
      SELECT s.*, i.item_name, u.username
      FROM stock_out s
      LEFT JOIN items i ON s.item_id = i.item_id
      LEFT JOIN users u ON s.user_id = u.user_id
      ORDER BY s.date_out DESC
    `);
    return NextResponse.json(stockOut);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stock out records' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { item_id, quantity, selling_price, date_out, user_id } = await request.json();

    if (!item_id || !quantity || !date_out || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if enough stock available
    const itemResult = await query('SELECT current_stock FROM items WHERE item_id = ?', [item_id]) as any[];
    if (!Array.isArray(itemResult) || itemResult.length === 0 || itemResult[0].current_stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO stock_out (item_id, quantity, selling_price, date_out, user_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [item_id, quantity, selling_price || null, date_out, user_id]
    );

    // Update current stock in items table
    await query(
      'UPDATE items SET current_stock = current_stock - ? WHERE item_id = ?',
      [quantity, item_id]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to create stock out record' },
      { status: 500 }
    );
  }
}
