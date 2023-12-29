import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create a connection pool to the database
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {},
});

export default connection;
