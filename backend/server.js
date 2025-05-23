const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789', // Change if needed
  database: 'course_app',
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('MySQL connected');
});

// ===================== API Routes ===================== //

// Get all courses
app.get('/api/courses', (req, res) => {
  db.query('SELECT * FROM courses', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Enroll in course
app.post('/api/enroll', (req, res) => {
  const { userId, courseId } = req.body;

  const check = 'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?';
  db.query(check, [userId, courseId], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) return res.status(400).json({ message: 'Already enrolled' });

    const insert = 'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)';
    db.query(insert, [userId, courseId], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Enrolled successfully' });
    });
  });
});

// Get all courses a user has enrolled in
app.get('/api/my-courses', (req, res) => {
  const userId = req.query.userId;

  const query = `
    SELECT c.id, c.title, c.description
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    WHERE e.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ===================== Start Server ===================== //
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
