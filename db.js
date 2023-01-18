const mysql = require("mysql")
require("dotenv").config()

const db = mysql.createConnection({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DB,
})
bff893ba35e024
eu-cdbr-west-03.cleardb.net
d7e0544c
heroku_fac07016e52dfdd


module.exports = db

