// config/db.js
const mysql = require("mysql2/promise");

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to execute queries
const query = async (sql, params) => {
  const [results] = await pool.execute(sql, params);
  return results;
};

module.exports = {
  pool,
  query,
};
