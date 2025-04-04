const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

db.connect(err => {
    if (err) {
        console.log("error connecting to database", err);
    } else {
        console.log("connected to database")
    }
})

module.exports = db;
