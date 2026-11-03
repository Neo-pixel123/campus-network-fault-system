import mysql from "mysql2/promise";

// One shared connection pool for the whole app
const globalForDb = globalThis;
export const pool =
  globalForDb.mysqlPool ??
  mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10,
    dateStrings: true,
  });
globalForDb.mysqlPool = pool;

export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}
