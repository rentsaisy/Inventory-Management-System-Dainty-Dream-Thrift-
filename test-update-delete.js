import mysql from 'mysql2/promise';

async function testUpdateDelete() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'daintydream_db',
    });

    console.log('✓ Connected to database\n');

    // First, get all categories
    const [categories] = await connection.execute('SELECT * FROM categories');
    console.log('Current categories:', categories);
    console.log('');

    if (categories.length > 0) {
      const firstCategory = categories[0];
      console.log('Testing UPDATE on category:', firstCategory);
      
      // Test UPDATE
      const testName = 'TEST_UPDATED_' + Date.now();
      console.log(`\nAttempting UPDATE: SET category_name = '${testName}' WHERE category_id = ${firstCategory.category_id}`);
      
      const [updateResult] = await connection.execute(
        'UPDATE categories SET category_name = ? WHERE category_id = ?',
        [testName, firstCategory.category_id]
      );
      console.log('Update result:', updateResult);
      console.log('affectedRows:', updateResult.affectedRows);

      // Verify the update
      const [afterUpdate] = await connection.execute(
        'SELECT * FROM categories WHERE category_id = ?',
        [firstCategory.category_id]
      );
      console.log('After UPDATE:', afterUpdate);
      console.log('');

      // Restore original name
      await connection.execute(
        'UPDATE categories SET category_name = ? WHERE category_id = ?',
        [firstCategory.category_name, firstCategory.category_id]
      );
      console.log('Restored original name\n');
    }

    // Test DELETE (try with a non-existent id to see if query works)
    console.log('Testing DELETE query (with non-existent ID to be safe)');
    const [deleteResult] = await connection.execute(
      'DELETE FROM categories WHERE category_id = ?',
      [99999]
    );
    console.log('Delete result:', deleteResult);
    console.log('affectedRows:', deleteResult.affectedRows);

    await connection.end();
    console.log('\n✓ Tests complete');
  } catch (error) {
    console.error('Error:', error);
  }
}

testUpdateDelete();
