const mysql = require("mysql")
require("dotenv").config()

const db = mysql.createConnection({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DB,
})

module.exports = db

