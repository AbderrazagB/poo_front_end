import React from 'react';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FaChartLine, FaUsers, FaLightbulb } from 'react-icons/fa';

const DashboardPage = () => {
  // Get user role from Redux store
  const { role, user } = useSelector(state => state.auth);

  // Custom intro per role
  let intro;
  if (role === 'ADMIN') {
    intro = (
      <>
        <h2>Admin Dashboard</h2>
        <p>Welcome, <b>{user}</b>! As an <b>Administrator</b>, you have full access to manage users, system settings, and all platform data.</p>
      </>
    );
  } else if (role === 'MANAGER') {
    intro = (
      <>
        <h2>Manager Dashboard</h2>
        <p>Welcome, <b>{user}</b>! As a <b>Manager</b>, you can oversee courses, manage your team, and track progress across your department.</p>
      </>
    );
  } else {
    intro = (
      <>
        <h2>User Dashboard</h2>
        <p>Welcome, <b>{user}</b>! Here you can view your courses, track your progress, and collaborate with others.</p>
      </>
    );
  }

  // Custom widgets per role
  let widgets;
  if (role === 'ADMIN') {
    widgets = (
      <div className="dashboard-widgets row justify-content-center mb-4">
        <div className="col-md-4 mb-3">
          <div className="dashboard-widget bg-primary text-white rounded-4 shadow-sm p-4 px-5 text-center h-100">
            <FaChartLine size={40} className="mb-2" />
            <div className="fw-bold mt-2">User Management</div>
            <div style={{fontSize: '1.05rem'}}>Add, edit, or remove users and assign roles.</div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="dashboard-widget bg-success text-white rounded-4 shadow-sm p-4 px-5 text-center h-100">
            <FaLightbulb size={40} className="mb-2" />
            <div className="fw-bold mt-2">System Settings</div>
            <div style={{fontSize: '1.05rem'}}>Configure platform-wide options and security.</div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="dashboard-widget bg-warning text-dark rounded-4 shadow-sm p-4 px-5 text-center h-100">
            <FaUsers size={40} className="mb-2" />
            <div className="fw-bold mt-2">Reports</div>
            <div style={{fontSize: '1.05rem'}}>View detailed usage and activity reports.</div>
          </div>
        </div>
      </div>
    );
  } else if (role === 'MANAGER') {
    widgets = (
      <div className="dashboard-widgets row justify-content-center mb-4">
        <div className="col-md-4 mb-3">
          <div className="dashboard-widget bg-primary text-white rounded-4 shadow-sm p-4 px-5 text-center h-100">
            <FaChartLine size={40} className="mb-2" />
            <div className="fw-bold mt-2">Team Progress</div>
            <div style={{fontSize: '1.05rem'}}>Monitor your team's training and achievements.</div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="dashboard-widget bg-success text-white rounded-4 shadow-sm p-4 px-5 text-center h-100">
            <FaUsers size={40} className="mb-2" />
            <div className="fw-bold mt-2">Manage Courses</div>
            <div style={{fontSize: '1.05rem'}}>Assign and review courses for your team.</div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="dashboard-widget bg-warning text-dark rounded-4 shadow-sm p-4 px-5 text-center h-100">
            <FaLightbulb size={40} className="mb-2" />
            <div className="fw-bold mt-2">Insights</div>
            <div style={{fontSize: '1.05rem'}}>Get recommendations to boost team performance.</div>
          </div>
        </div>
      </div>
    );
  } else {
    widgets = (
      <div className="dashboard-widgets row justify-content-center mb-4">
        <div className="col-md-4 mb-3">
          <div className="dashboard-widget bg-primary text-white rounded-4 shadow-sm p-4 px-5 text-center h-100">
            <FaChartLine size={40} className="mb-2" />
            <div className="fw-bold mt-2">My Progress</div>
            <div style={{fontSize: '1.05rem'}}>See your completed and ongoing courses.</div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="dashboard-widget bg-success text-white rounded-4 shadow-sm p-4 px-5 text-center h-100">
            <FaUsers size={40} className="mb-2" />
            <div className="fw-bold mt-2">My Team</div>
            <div style={{fontSize: '1.05rem'}}>Interact and collaborate with your peers.</div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="dashboard-widget bg-warning text-dark rounded-4 shadow-sm p-4 px-5 text-center h-100">
            <FaLightbulb size={40} className="mb-2" />
            <div className="fw-bold mt-2">Recommendations</div>
            <div style={{fontSize: '1.05rem'}}>Personalized suggestions to help you grow.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="mx-auto dashboard-main-card shadow border-0" style={{ maxWidth: 900, marginTop: 40, background: 'rgba(255,255,255,0.98)' }}>
      <Card.Body>
        {intro}
        <hr />
        {widgets}
        <div className="dashboard-actions d-flex justify-content-center gap-4 mt-3">
          <button className="btn btn-primary rounded-pill px-4 py-2">My Courses</button>
          <button className="btn btn-success rounded-pill px-4 py-2">Statistics</button>
          <button className="btn btn-warning rounded-pill px-4 py-2 text-dark">Invite Team</button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DashboardPage;