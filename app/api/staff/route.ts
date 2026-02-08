import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const staff = await query(`
      SELECT u.user_id, u.username, u.phone_number, u.address, u.created_at, r.role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.role_id
      ORDER BY u.username ASC
    `);
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { username, password, role_id, phone_number, address } = await request.json();

    if (!username || !password || !role_id) {
      return NextResponse.json(
        { error: 'Username, password, and role are required' },
        { status: 400 }
      );
    }

    // Hash password (in production, use bcrypt)
    const hashedPassword = Buffer.from(password).toString('base64');

    await query(
      `INSERT INTO users (username, password, role_id, phone_number, address) 
       VALUES (?, ?, ?, ?, ?)`,
      [username, hashedPassword, role_id, phone_number || null, address || null]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to create staff member' },
      { status: 500 }
    );
  }
}
