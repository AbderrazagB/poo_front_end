import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaUsers, FaBook, FaUserGraduate, FaUserTie, FaChartLine } from 'react-icons/fa';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const stats = [
  { title: 'Total Users', value: 100, color: 'primary', icon: <FaUsers size={28} /> },
  { title: 'Total Courses', value: 20, color: 'success', icon: <FaBook size={28} /> },
  { title: 'Total Formations', value: 15, color: 'info', icon: <FaUserGraduate size={28} /> },
  { title: 'Total Instructors', value: 12, color: 'warning', icon: <FaUserTie size={28} /> },
];

const userTypeData = {
  labels: ['Admin', 'User', 'Instructor', 'Guest'],
  datasets: [
    {
      label: 'User Types',
      data: [10, 50, 30, 10], // Placeholder data for user types
      backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
      borderWidth: 1,
    },
  ],
};

const courseFormationData = {
  labels: ['Courses', 'Formations'],
  datasets: [
    {
      label: 'Courses vs Formations',
      data: [20, 15], // Placeholder data for courses vs formations
      backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 159, 64, 0.6)'],
      borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
      borderWidth: 1,
    },
  ],
};

const participantsTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Participants per Month',
      data: [20, 25, 30, 28, 35, 40], // Placeholder data for participants per month
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

const StatisticsPage = () => (
  <div>
    <Card className="mb-4 shadow border-0 bg-gradient bg-light">
      <Card.Body className="d-flex align-items-center gap-3">
        <FaChartLine size={32} className="text-primary" />
        <h2 className="mb-0">Statistics Dashboard</h2>
      </Card.Body>
    </Card>
    <Row className="mb-4">
      {stats.map((stat, idx) => (
        <Col key={idx} md={3} sm={6} xs={12} className="mb-3">
          <Card bg={stat.color} text="white" className="shadow h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div className="mb-2">{stat.icon}</div>
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
            <h5 className="mb-4">User Types Distribution</h5>
            <Pie data={userTypeData} options={chartOptions} height={200} />
          </Card.Body>
        </Card>
      </Col>
      <Col md={6} xs={12}>
        <Card className="shadow border-0">
          <Card.Body>
            <h5 className="mb-4">Courses vs Formations</h5>
            <Bar data={courseFormationData} options={chartOptions} height={200} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Card className="shadow border-0">
      <Card.Body>
        <h5 className="mb-4">Participants Trend</h5>
        <Bar data={participantsTrendData} options={chartOptions} height={100} />
      </Card.Body>
    </Card>
  </div>
);

export default StatisticsPage;
