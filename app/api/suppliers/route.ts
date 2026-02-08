import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const suppliers = await query('SELECT * FROM suppliers ORDER BY supplier_name ASC');
    return NextResponse.json(suppliers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { supplier_name, contact_person, phone, address } = await request.json();

    if (!supplier_name) {
      return NextResponse.json(
        { error: 'Supplier name is required' },
        { status: 400 }
      );
    }

    await query(
      'INSERT INTO suppliers (supplier_name, contact_person, phone, address) VALUES (?, ?, ?, ?)',
      [supplier_name, contact_person || null, phone || null, address || null]
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    );
  }
}
