const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection(
    {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "root",
      database: "carlton"
    },
    console.log(`Connected to the carlton database.`)
  );
  
module.exports = connection;
