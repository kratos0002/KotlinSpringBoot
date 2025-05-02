import { db } from './db';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
  try {
    // Read and execute each migration file
    const migrationFiles = [
      '001_create_features_table.sql',
      '002_create_feedback_table.sql'
    ];
    
    for (const file of migrationFiles) {
      const migrationPath = join(__dirname, 'migrations', file);
      const sql = readFileSync(migrationPath, 'utf-8');
      
      console.log(`Running migration: ${file}`);
      await db.execute(sql);
      console.log(`Migration ${file} completed successfully`);
    }
    
    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations(); 