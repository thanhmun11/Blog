const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Ngv0thh@', // Thay đổi thành password MySQL của bạn
  database: 'blogdb',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Fix Public Key Retrieval error
  ssl: false
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
  });

module.exports = pool; 