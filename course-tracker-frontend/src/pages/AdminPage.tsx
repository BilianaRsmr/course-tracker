import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Course {
  id: number;
  title: string;
  completed: boolean;
}

interface User {
  id: number;
  username: string;
  role: string;
  courses: Course[];
}

export const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole || '');

    const token = localStorage.getItem('token');
    if (storedRole === 'admin' && token) {
      axios
        .get('http://localhost:3000/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
        .catch((err) => {
          console.error('Error loading users:', err);
          setError('Failed to fetch users');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (userId: number) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:3000/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Could not delete user');
    }
  };

  const exportToExcel = () => {
    const rows: any[] = [];

    users.forEach(user => {
      if (user.courses.length === 0) {
        rows.push({
          Username: user.username,
          Role: user.role,
          Course: '—',
          Completed: '—',
        });
      } else {
        user.courses.forEach(course => {
          rows.push({
            Username: user.username,
            Role: user.role,
            Course: course.title,
            Completed: course.completed ? 'Yes' : 'No',
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'users-courses.xlsx');
  };

  if (role !== 'admin') {
    return (
      <p style={{ padding: '2rem' }}>
        Access denied. Only admin can view this page.
      </p>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        margin: 0,
        background: '#f1f5f9',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: '240px',
          backgroundColor: '#1e293b',
          color: 'white',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3524/3524659.png"
            alt="Logo"
            style={{ height: '30px' }}
          />
          <h1 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'Georgia, serif' }}>
            CoursesTracker
          </h1>
        </div>
        <p style={{ marginTop: '2rem', fontSize: '0.95rem' }}>Welcome, Admin</p>
        <button
          onClick={exportToExcel}
          style={{
            marginTop: '2rem',
            padding: '0.6rem 1rem',
            backgroundColor: '#3b82f6',
            border: 'none',
            color: 'white',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Export to Excel
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          padding: '2rem',
          overflowY: 'auto',
        }}
      >
        <h2 style={{ color: '#1f2937', marginBottom: '1.5rem' }}>
          Admin Dashboard
        </h2>

        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map((user) => (
              <li
                key={user.id}
                style={{
                  backgroundColor: 'white',
                  padding: '1.2rem',
                  marginBottom: '1rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <h3 style={{ marginBottom: '0.2rem' }}>{user.username}</h3>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>

                {user.role !== 'admin' && (
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginBottom: '1rem',
                    }}
                  >
                    Delete User
                  </button>
                )}

                <h4>Courses:</h4>
                {user.courses.length === 0 ? (
                  <p style={{ fontStyle: 'italic' }}>No courses yet.</p>
                ) : (
                  <ul>
                    {user.courses.map((course) => (
                      <li key={course.id}>
                        <strong>{course.title}</strong> –{' '}
                        {course.completed ? '✅ Completed' : '❌ Incomplete'}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};
