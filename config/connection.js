const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "root",
      database: "carlton_db"
    },
    console.log(`Connected to the carlton_db database.`)
  );
  