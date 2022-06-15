import express from 'express';
const app = express();
import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//GET foos method using PDO with basic token security
app.get('/api/pdo/foos&token=:token', (req, res) => {
    //PDO prepared statement
    let sql = "SELECT * FROM info WHERE id = ?";
    connection.query(sql, [req.params.token], (err, rows) => {
        if(err) throw err;
        if (rows.length > 0) {
          connection.query("SELECT * FROM info", [req.params.token], (err, rows) => {
            res.json(rows);
          });
        }
        else {
            res.send('No data found');
        }
  });
});

//GET foos method with basic token security
app.get('/api/foos&token=:token',(req, res)=> {
  connection.query(`SELECT * FROM info WHERE id = ${req.params.token}`, (err,rows) => {
    if (rows.length > 0)
      connection.query('SELECT * FROM info',(err, rows, fields) => {
        res.json(rows);
   });
   else 
        res.status(400).json({message: `Wrong token provided.`});
  });
});
//GET foo method with a basic token security
app.get('/api/foo/:id/token=:token',(req, res)=> {
    var id = req.params.id;
    connection.query(`SELECT * FROM info WHERE id = ${req.params.token}`, (err,rows) => {
      if (rows.length > 0)
        connection.query(`SELECT * FROM info WHERE id = '${id}'`,(err, rows, fields) => {
          if(rows.length > 0)
            res.json(rows);
          else
            res.status(400).json({message: `No user with an id of ${id}`});
        });
      else 
      res.status(400).json({message: `Wrong token provided.`});
  }); 
 });

//POST Method
 app.post('/api/token=:token', (req, res)=> {
      var value = req.body.value;
      var status = req.body.status;
      connection.query(`SELECT * FROM info WHERE id = ${req.params.token}`, (err,rows) => {
        if (rows.length > 0)
          connection.query(`INSERT INTO info (value, status)VALUES('${value}','${status}')`,(err, rows, fields) => {
            res.json({message: `${value} was inserted successfully.`});
          });
        else 
          res.status(400).json({message: `Wrong token provided.`});
      });
 });

// PUT Method
app.put('/api/:id/token=:token', (req, res)=> {
    var value = req.body.value;
    var status = req.body.status;
    var id = req.params.id;
    connection.query(`SELECT * FROM info WHERE id = ${req.params.token}`, (err,rows) => {
      if (rows.length > 0)
        connection.query(`SELECT * FROM info WHERE id = '${id}'`,(err, rows, fields) => {
          if(rows.length > 0)
            connection.query(`UPDATE info SET value = '${value}', status = '${status}' WHERE id = '${id}'`,(err, rows, fields) => {
              res.json({message: `${id} was updated successfully`});
            });
          else
              res.status(400).json({message: `No user with an id of ${id}`});
        });
      else
        res.status(400).json({message: `Wrong token provided.`});
    });
});

// DELETE Method
app.delete('/api/:id/token=:token', (req, res)=>{
    var id = req.params.id;
    connection.query(`SELECT * FROM info WHERE id = ${req.params.token}`, (err,rows) => {
      if (rows.length > 0)
        connection.query(`SELECT * FROM info WHERE id = '${id}'`,(err, rows, fields) => {
          if(rows.length > 0)
            connection.query(`DELETE FROM info WHERE id = '${id}'`,(err, rows, fields) => {
            res.json(`${id}:  was deleted successfully`);
        });
          else
              res.status(400).json({message: `No user with an id of ${id}`});
        });
      else
        res.status(400).json({message: `Wrong token provided.`});
    });
});

app.listen(PORT, ()=> {
    console.log(`Server is started in port ${PORT}`);
})
