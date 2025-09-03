import express, {json} from 'express';
import mysql from 'mysql';
import cors from 'cors';
import dotenv from 'dotenv';


const app = express();

app.use(express.json());
dotenv.config(); // Carica le variabili da .env

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})

// all activities
app.get('/api/activities', (req, res) => {
  const sql = 'SELECT project.name as project_name, employee.name as  employ_name, date, hours FROM `activities` JOIN project JOIN employee WHERE activities.id_employ= employee.id AND activities.id_project = project.id ';
  db.query(sql, (err, data) => {
    if (err) {
      return res.json({Error: "Error"});
    }
    return res.json(data);
  })
})

app.listen(process.env.PORT || 3040, () => {
  console.log("Server started on port 3040");
})