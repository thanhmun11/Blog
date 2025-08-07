const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Ngv0thh@',
  port: 3306,
  ssl: false
};

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL server');

    // Create database if not exists
    await connection.execute('CREATE DATABASE IF NOT EXISTS blogdb');
    console.log('Database blogdb created or already exists');

    // Use the database
    await connection.query('USE blogdb');
    console.log('Using database blogdb');

    // Read and execute schema file
    const schemaPath = path.join(__dirname, 'database', 'schema-blogdb.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
          console.log('Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          console.log('Statement failed (might already exist):', statement.substring(0, 50) + '...');
          console.log('Error:', error.message);
        }
      }
    }

    console.log('Database setup completed successfully!');
    
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase(); 