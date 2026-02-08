import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  let connection;
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Parse DATABASE_URL from .env.local
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL not configured');
    }

    // Parse MySQL connection string: mysql://user:password@host:port/database
    const url = new URL(dbUrl);
    const config = {
      host: url.hostname,
      user: url.username || 'root',
      password: url.password || '',
      database: url.pathname.substring(1),
      port: parseInt(url.port || '3306', 10),
    };

    // Connect to database
    connection = await mysql.createConnection(config);

    // Query for user with correct column names from your database
    const [rows] = await connection.execute(
      'SELECT user_id, username, password, role_id FROM users WHERE username = ?',
      [username]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Determine role based on role_id (1 = admin, 2 = staff)
    const role = user.role_id === 1 ? 'admin' : 'staff';

    // Return user data with role
    return NextResponse.json({
      id: String(user.user_id),
      email: username,
      name: username,
      role: role,
    });
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
