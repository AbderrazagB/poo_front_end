import React from 'react';
import { Card } from 'react-bootstrap';

const DashboardPage = () => (
  <Card className="mx-auto" style={{ maxWidth: 800, marginTop: 40 }}>
    <Card.Body>
      <h2>Dashboard</h2>
      <p>Welcome to the Excellent Training management dashboard.</p>
      {/* Add dashboard widgets/statistics here */}
    </Card.Body>
  </Card>
);

export default DashboardPage; 