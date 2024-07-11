const { Client } = require('pg'); // Import the PostgreSQL client
const client = new Client({
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432, // Default PostgreSQL port
});
async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to the database');
    // Example: Inserting data into a 'tables' table
    const insertQuery = `
      INSERT INTO tables (number, prefix, description,
 seats)
      VALUES 
        (1, 'A', 'Table near the window', 4),
        (2, 'B', 'Large table for groups', 8),
        (3, 'C', 'Cozy corner table', 2);
    `;
    await client.query(insertQuery);
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}
seedDatabase();