import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY category_name ASC');
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    // If ID exists, it's an UPDATE (PUT)
    if (id) {
      const { category_name } = await request.json();
      const categoryId = parseInt(id, 10);

      if (!category_name || !category_name.trim()) {
        return NextResponse.json(
          { error: 'Category name is required' },
          { status: 400 }
        );
      }

      await query(
        'UPDATE categories SET category_name = ? WHERE category_id = ?',
        [category_name.trim(), categoryId]
      );

      return NextResponse.json({ success: true, message: 'Category updated' });
    }

    // Otherwise it's a CREATE
    const { category_name } = await request.json();

    if (!category_name || !category_name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    await query('INSERT INTO categories (category_name) VALUES (?)', [category_name.trim()]);
    return NextResponse.json({ success: true, message: 'Category created' }, { status: 201 });
  } catch (error: any) {
    console.error('Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const categoryId = parseInt(id, 10);

    // Check if category is in use
    const itemsResult = await query(
      'SELECT COUNT(*) as count FROM items WHERE category_id = ?',
      [categoryId]
    );

    const items = itemsResult as any[];
    if (items && items.length > 0 && (items[0] as any).count > 0) {
      return NextResponse.json(
        { error: 'Category is in use and cannot be deleted' },
        { status: 409 }
      );
    }

    // Delete the category
    await query('DELETE FROM categories WHERE category_id = ?', [categoryId]);

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
