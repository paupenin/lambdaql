import path from 'path';
import fs from 'fs';
import { PoolConnection } from 'mysql2/promise';
import connection from './db';

const MIGRATIONS_DIR = path.join(__dirname, 'db/migrations');
const SEEDERS_DIR = path.join(__dirname, 'db/seeders');

/**
 * Drop all the tables in the database
 */
async function dropAllTables(conn: PoolConnection) {
    // Get all the tables
    const [tables] = await conn.query("SELECT table_name as name FROM information_schema.tables WHERE table_schema = ?", process.env.DB_NAME);

    // If there are no tables, return
    if (!Array.isArray(tables)) return;

    // Drop all the tables
    tables.forEach(async (table: any) => {
        await conn.query(`DROP TABLE ${table.name}`);
        console.log(`Table dropped: ${table.name}`);
    });
}

/**
 * Get the list of files in directory
 */
async function getMigrationFiles(dir: string): Promise<string[]> {
    return await fs.promises.readdir(dir);
}

/**
 * Run the migrations
 */
async function runMigrations(conn: PoolConnection) {
    const migrations = await getMigrationFiles(MIGRATIONS_DIR);

    for (const migration of migrations) {
        const content = await fs.promises.readFile(path.join(MIGRATIONS_DIR, migration), 'utf-8');
        await conn.query(content);
        console.log(`Migration completed: ${migration}`);
    }
}

/**
 * Run the seeders
 */
async function runSeeders(conn: PoolConnection) {
    const seeders = await getMigrationFiles(SEEDERS_DIR);

    for (const seeder of seeders) {
        const content = await fs.promises.readFile(path.join(SEEDERS_DIR, seeder), 'utf-8');
        await conn.query(content);
        console.log(`Seeder completed: ${seeder}`);
    }
}

/**
 * Execute the migration
 */
async function migrate() {
  try {
    // Connect to the database
    const conn = await connection.getConnection();

    if (process.argv.includes('--fresh')) {
        // Drop all the tables
        await dropAllTables(conn);
    }

    // Run migrations
    await runMigrations(conn);

    if (process.argv.includes('--seed')) {
        // Run seeders
        await runSeeders(conn);
    }

    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration failed: ", (error as Error).message || 'Unknown error');
  } finally {
    // Close the database connection
    await connection.end();
    
    console.log("Migration completed, exiting.");
  }
}

migrate();
