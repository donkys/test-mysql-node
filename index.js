const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config(); // To read .env file

const app = express();
const PORT = 3000;

// DB connection config from environment variables
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 20000
};

// Root route
app.get('/', (req, res) => {
    res.send('<h1>สวสดีครับ ดิว โอม และเอิ้ด</h1><p>Go to <a href="/test-db">/test-db</a> to check the database connection.</p>');
});

// DB test route
app.get('/test-db', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT NOW() as db_time;');
        res.status(200).json({
            status: 'OK',
            message: 'Database connection successful!',
            database_time: rows[0].db_time
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Failed to connect to the database.',
            error: error.message
        });
    } finally {
        if (connection) await connection.end();
    }
});

app.listen(PORT, () => {
    console.log(`App server listening on port ${PORT}`);
});
