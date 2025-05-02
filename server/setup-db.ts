import postgres from 'postgres';

const sql = postgres('postgres://postgres:postgres@localhost:5432/postgres');

async function setupDatabase() {
  try {
    // Create database if it doesn't exist
    const result = await sql`
      SELECT 1 FROM pg_database WHERE datname = 'pawconnect'
    `;
    
    if (result.length === 0) {
      await sql`CREATE DATABASE pawconnect`;
      console.log('Database created successfully');
    } else {
      console.log('Database already exists');
    }
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await sql.end();
  }
}

setupDatabase(); 