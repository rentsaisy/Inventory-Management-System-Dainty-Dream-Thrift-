import mysql from 'mysql2/promise';

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'daintydream_db',
    });

    console.log('✓ Connected to database');

    // Get all tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Tables:', tables);

    // Check users table structure if it exists
    const [columns] = await connection.execute('DESCRIBE users');
    console.log('Users table columns:', columns);

    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();
