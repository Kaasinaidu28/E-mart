const express = require('express');
const cors =  require('cors');
const mysql = require('mysql');

const app = express();

app.use(cors());
app.use(express.json());
const PORT = 5000;

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Naidu@2003',
    database:'registration',
})
db.connect((err)=>{
    if(err) throw err;
    console.log("Database connected successfull");
})

app.post('/register', (req, res)=>{

    const {name, email, number, password, repassword} = req.body;
    const sql = 'INSERT INTO details (name, email, number, password, repassword) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, number, password, repassword],(err, result)=>{
        console.log(email, password, name, number);

        if(err) return res.status(500).json({message:'Database Error'});

        res.json({message: 'User Details Saved Successfully'});
    });

})

app.post('/login', (req, res) => {
  const { mail_id, lpassword } = req.body;


  if (!mail_id || !lpassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = 'SELECT * FROM details WHERE email = ? AND password = ?';

  db.query(sql, [mail_id, lpassword], (err, results) => {
  
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length > 0) {
      res.json({ message: "Sign in successfully" });
    } else {
      res.status(401).json({ message: "Invalid details. Please register and login." });
    }
  });
});



app.listen(PORT,()=>{
    console.log('Server is running on  http://localhost:5000');

});

