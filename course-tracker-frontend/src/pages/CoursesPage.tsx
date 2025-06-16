import React, { useEffect, useState } from 'react';
import './CoursesPage.css';

interface Course {
  id: number;
  title: string;
  platform: string;
  duration: number;
  completed: boolean;
}

export const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    platform: '',
    duration: '',
    completed: false,
  });
  const [filters, setFilters] = useState({
    title: '',
    platform: '',
    showCompletedOnly: false,
  });
  const token = localStorage.getItem('token');
  const [message, setMessage] = useState('');

  const fetchCourses = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      setCourses(data);
    } else {
      setMessage('Failed to load courses');
    }
  };

  useEffect(() => {
    fetchCourses('http://localhost:3000/courses');
  }, [token]);

  const handleAddCourse = async () => {
    const res = await fetch('http://localhost:3000/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...newCourse,
        duration: Number(newCourse.duration),
      }),
    });

    const created = await res.json();
    setCourses([...courses, created]);
    setNewCourse({ title: '', platform: '', duration: '', completed: false });
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3000/courses/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCourses(courses.filter((c) => c.id !== id));
  };

  const toggleCompleted = async (course: Course) => {
    const updated = { ...course, completed: !course.completed };
    const res = await fetch(`http://localhost:3000/courses/${course.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    setCourses(courses.map((c) => (c.id === data.id ? data : c)));
  };

  const applyFilter = async () => {
    if (filters.showCompletedOnly) {
      await fetchCourses('http://localhost:3000/courses/completed');
    } else if (filters.platform) {
      await fetchCourses(
        `http://localhost:3000/courses?platform=${filters.platform}`
      );
    } else {
      await fetchCourses('http://localhost:3000/courses');
    }
  };

  if (!token) {
    return <p>You must be logged in to see the courses.</p>;
  }

  return (
    <>
      {/* FULLSCREEN TOP BAR */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#1e293b',
          color: 'white',
          padding: '1.2rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3524/3524659.png"
          alt="Logo"
          style={{ height: '30px' }}
        />
        <h1 style={{ fontSize: '1.2rem', margin: 0 }}>CoursesTracker</h1>
      </div>

      {/* CONTINUTUL CURSURILOR */}
      <div className="container">
        <h1>Your Courses</h1>

        <h3>Add New Course</h3>
        <div className="form">
          <input
            type="text"
            placeholder="Title"
            value={newCourse.title}
            onChange={(e) =>
              setNewCourse({ ...newCourse, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Platform"
            value={newCourse.platform}
            onChange={(e) =>
              setNewCourse({ ...newCourse, platform: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Duration (hours)"
            value={newCourse.duration}
            onChange={(e) =>
              setNewCourse({ ...newCourse, duration: e.target.value })
            }
          />
          <label>
            <input
              type="checkbox"
              checked={newCourse.completed}
              onChange={(e) =>
                setNewCourse({ ...newCourse, completed: e.target.checked })
              }
            />
            Completed
          </label>
          <button onClick={handleAddCourse}>Add Course</button>
        </div>

        <h3>Filter Courses</h3>
        <div className="form">
          <input
            type="text"
            placeholder="Search by title"
            value={filters.title}
            onChange={(e) =>
              setFilters({ ...filters, title: e.target.value })
            }
          />
          <select
            value={filters.platform}
            onChange={(e) =>
              setFilters({ ...filters, platform: e.target.value })
            }
          >
            <option value="">All platforms</option>
            {Array.from(new Set(courses.map((c) => c.platform))).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              checked={filters.showCompletedOnly}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  showCompletedOnly: e.target.checked,
                })
              }
            />
            Show only completed
          </label>
          <button onClick={applyFilter}>Apply Filter</button>
        </div>

        {courses
          .filter((course) =>
            course.title.toLowerCase().includes(filters.title.toLowerCase())
          )
          .map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-title">{course.title}</div>
              <div className="course-info">
                ({course.platform}) – {course.duration}h –{' '}
                {course.completed ? '✅ Completed' : '❌ Not completed'}
              </div>
              <button onClick={() => toggleCompleted(course)}>
                Toggle Completed
              </button>
              <button onClick={() => handleDelete(course.id)}>Delete</button>
            </div>
          ))}
      </div>
    </>
  );
};
