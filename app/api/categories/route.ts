import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY category_name ASC');
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { category_name } = await request.json();

    if (!category_name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    await query('INSERT INTO categories (category_name) VALUES (?)', [category_name]);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
