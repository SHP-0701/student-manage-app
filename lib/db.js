/** database connection pool */

import mysql from 'mysql2/promise';

// .env.local 파일에서 환경변수 불러옴
const dbpool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default dbpool;