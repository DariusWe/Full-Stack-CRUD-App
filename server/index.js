const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
/* 
cors() middleware allows requests to skip Same-Origin-Policy and access data from remote hosts.
If in use, you will get the following header when requesting data from the server:
Access-Control-Allow-Origin: *
That means that access is allowed from any origin.
With cors() middleware you can further specify origins and do a lot of other things:
https://medium.com/zero-equals-false/using-cors-in-express-cac7e29b005b
*/
app.use(express.json());
// express.json() is a inbuilt middleware to parse incoming requests with JSON data. No need when only using GET requests.

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
});

app.get("/", (req, res) => {
  console.log(process.env);
  res.send("API Endpoint for getting database entries: .../api/get");
});

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM tweets";
  db.query(sqlSelect, (err, result) => {
    err && console.log(err);
    res.json(result);
  });
});

app.post("/api/insert", (req, res) => {
  const { title, paragraph } = req.body;
  const sqlInsert = "INSERT INTO tweets (title, paragraph) VALUES (?, ?)";
  db.query(sqlInsert, [title, paragraph], (err, result) => {
    err && console.log(err);
    res.json("Submitted successfully");
  });
});

app.post("/api/insert-batch", (req, res) => {
  let sqlInsert = "INSERT INTO tweets (title, paragraph) VALUES";
  req.body.map((tweet) => {
    sqlInsert = sqlInsert.concat(` ("${tweet.title}", "${tweet.paragraph}"),`);
  });
  sqlInsert = sqlInsert.slice(0, -1);
  db.query(sqlInsert, (err, result) => {
    err && console.log(err);
    res.json("Batch successfully uploaded");
  });
});

app.put("/api/update", (req, res) => {
  const { id, title, paragraph } = req.body;
  const sqlUpdate = "UPDATE tweets SET title = ?, paragraph = ? WHERE id = ?";
  db.query(sqlUpdate, [title, paragraph, id], (err, result) => {
    err && console.log(err);
    res.json("Updated successfully");
  });
});

app.delete("/api/delete/:id", (req, res) => {
  if (req.params.id === "all") {
    const sqlDelete = "TRUNCATE tweets";
    db.query(sqlDelete, (err, result) => {
      err && console.log(err);
      res.json("Deleted successfully");
    });
  } else {
    const sqlDelete = "DELETE FROM tweets WHERE id=?";
    db.query(sqlDelete, [req.params.id], (err, result) => {
      err && console.log(err);
      res.json("Deleted successfully");
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Running on port", process.env.PORT);
});
