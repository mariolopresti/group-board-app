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
  host: 'sql7.freesqldatabase.com',
  user: 'sql7797118',
  password: "JTyXh6qzXg",
  database: 'sql7797118',
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