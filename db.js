const mysql = require("mysql")

const db = mysql.createConnection({
    user: "bff893ba35e024",
    host: "eu-cdbr-west-03.cleardb.net",
    password: "d7e0544c",
    database: "heroku_fac07016e52dfdd",
})

module.exports = db

