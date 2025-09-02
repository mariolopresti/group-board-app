import express, {json} from 'express';
import mysql from 'mysql';
import cors from 'cors';


const app = express();

app.use(express.json());

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "",
  database: 'office',
})


// all activities
app.get('/api/all', (req, res) => {
  //res.json({"test": ["1","2","3","4","5","6","7","8","9"]});
  const sql = 'SELECT project.name as project_name, employees.name as  employ_name, date, hours FROM `activities` JOIN project JOIN employees WHERE activities.id_employ= employees.id AND activities.id_project = project.id ';
  db.query(sql, (err, data) => {
    if (err) {
      return res.json({Error: "Error"});
    }
    return res.json(data);
  })
})

// all activities group by project
app.get('/api/project', (req, res) => {
  const sql = 'SELECT DISTINCT project.name as project_name, SUM(hours) as hours FROM `activities` JOIN project JOIN employees WHERE activities.id_employ= employees.id AND activities.id_project = project.id GROUP BY project_name;';
  db.query(sql, (err, data) => {
    if (err) {
      return res.json({Error: "Error"});
    }
    return res.json(data);
  })
})

// all activities group by project and employ
app.get('/api/pe', (req, res) => {
  const sql = 'SELECT project.name as project_name, employees.name as  employ_name, SUM(hours) as hours FROM `activities` JOIN project JOIN employees WHERE activities.id_employ= employees.id AND activities.id_project = project.id GROUP by project_name, employ_name';
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