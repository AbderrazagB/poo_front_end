import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaUsers, FaBook, FaUserGraduate, FaUserTie, FaChartLine } from 'react-icons/fa';
import api from '../api'; // Assuming you're using axios setup like in DomainsPage

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/statistics/v1/manager/all');
        setStats(res.data);
      } catch (err) {
        setError('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats && [
    { title: 'Total Courses', value: stats.totalCourses, color: 'success', icon: <FaBook size={28} /> },
    { title: 'Total Employers', value: stats.totalEmployers, color: 'primary', icon: <FaUsers size={28} /> },
    { title: 'Total Participants', value: stats.totalParticipants, color: 'info', icon: <FaUserGraduate size={28} /> },
    { title: 'Total Instructors', value: stats.totalInstructors, color: 'warning', icon: <FaUserTie size={28} /> },
  ];

  const dummyChartData = {
    labels: ['Courses', 'Formations'],
    datasets: [
      {
        label: 'Courses vs Formations',
        data: [stats?.totalCourses || 0, 15], // Example placeholder for "Formations"
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 159, 64, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="table-section">
      <div className="shadow-lg border-0 table-container mx-auto" style={{maxWidth: 1200, marginTop: 40}}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-3">
            <FaChartLine size={32} className="text-primary" />
            <h2 className="page-title mb-0">Statistics Dashboard</h2>
          </div>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            <Row className="mb-4">
              {statCards.map((stat, idx) => (
                <Col key={idx} md={3} sm={6} xs={12} className="mb-3">
                  <Card className="stat-card h-100 border-0 shadow text-center">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                      <div className="mb-2 stat-icon">{stat.icon}</div>
                      <Card.Title className="text-center">{stat.title}</Card.Title>
                      <Card.Text style={{ fontSize: 32, fontWeight: 'bold' }}>{stat.value}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <Row className="mb-4">
              <Col md={6} xs={12}>
                <Card className="shadow border-0">
                  <Card.Body>
                    <h5 className="mb-4">Courses vs Formations</h5>
                    <Bar data={dummyChartData} options={chartOptions} height={200} />
                  </Card.Body>
                </Card>
              </Col>
              {/* Add more charts if needed */}
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
