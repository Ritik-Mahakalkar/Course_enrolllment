import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css'

const userId = 2; 

function CourseCard({ course, enrolled, onEnroll }) {
  return (
    <div className="card m-2 p-3" style={{ width: '18rem' }}>
      <h5>{course.title}</h5>
      <p>{course.description}</p>
      <button
        className={`btn ${enrolled ? 'btn-success' : 'btn-primary'}`}
        onClick={() => !enrolled && onEnroll(course.id)}
        disabled={enrolled}
      >
        {enrolled ? 'Enrolled' : 'Enroll Now'}
      </button>
    </div>
  );
}

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses').then(res => setCourses(res.data));
    axios.get(`http://localhost:5000/api/my-courses?userId=${userId}`).then(res =>
      setEnrolledIds(res.data.map(c => c.id))
    );
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post('http://localhost:5000/api/enroll', { userId, courseId });
      setEnrolledIds(prev => [...prev, courseId]);
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>All Courses</h2>
      <div className="d-flex flex-wrap">
        {courses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            enrolled={enrolledIds.includes(course.id)}
            onEnroll={handleEnroll}
          />
        ))}
      </div>
    </div>
  );
}

function MyCoursesPage() {
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/my-courses?userId=${userId}`)
      .then(res => setMyCourses(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Courses</h2>
      <div className="d-flex flex-wrap">
        {myCourses.map(course => (
          <div key={course.id} className="card m-2 p-3" style={{ width: '18rem' }}>
            <h5>{course.title}</h5>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link className="navbar-brand" to="/">CourseApp</Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/">Courses</Link>
          <Link className="nav-link" to="/my-courses">My Courses</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<CoursesPage />} />
        <Route path="/my-courses" element={<MyCoursesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
