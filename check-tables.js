import mysql from 'mysql2/promise';

async function checkTables() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'daintydream_db',
    });

    const tables = ['categories', 'items', 'suppliers', 'stock_in', 'stock_out', 'users', 'roles'];
    
    for (const table of tables) {
      const [cols] = await conn.execute(`DESCRIBE ${table}`);
      console.log(`\n=== ${table} ===`);
      cols.forEach(col => {
        console.log(`${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key ? 'KEY:' + col.Key : ''}`);
      });
    }

    await conn.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTables();
