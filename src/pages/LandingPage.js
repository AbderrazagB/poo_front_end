import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaChartLine, FaUsers, FaLightbulb } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);

  const handleGetStarted = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page hero-section d-flex align-items-center justify-content-center min-vh-100 position-relative" style={{background: 'none'}}>
      {/* Remove local animated background: now global in App.js */}
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col lg={8} className="text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <h1 className="display-1 fw-bold mb-4 gradient-text" style={{letterSpacing: '-0.025em', fontSize: '4rem'}}>
                Welcome to TaskFlow
              </h1>
              <p className="lead mb-5 text-secondary fs-2" style={{maxWidth: 700, margin: '0 auto', fontWeight: 500, fontSize: '2rem'}}>
                A minimal, modern workspace for your team.<br/>
                <span style={{color: '#6366f1', fontWeight: 700}}>Organize. Collaborate. Grow.</span>
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleGetStarted}
                className="get-started-btn shadow-lg px-5 py-3 mb-5"
                style={{ fontSize: '1.5rem', borderRadius: 16, fontWeight: 700 }}
              >
                {token ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              <div className="d-flex flex-wrap justify-content-center gap-4 mt-4 mb-5">
                <div className="badge-card border-0 shadow-sm p-4 px-5 minimal-badge" style={{fontSize: '1.5rem'}}>
                  <FaChartLine size={36} className="text-primary mb-2" />
                  <div className="fw-bold">Progress</div>
                </div>
                <div className="badge-card border-0 shadow-sm p-4 px-5 minimal-badge" style={{fontSize: '1.5rem'}}>
                  <FaUsers size={36} className="text-primary mb-2" />
                  <div className="fw-bold">Collaboration</div>
                </div>
                <div className="badge-card border-0 shadow-sm p-4 px-5 minimal-badge" style={{fontSize: '1.5rem'}}>
                  <FaLightbulb size={36} className="text-primary mb-2" />
                  <div className="fw-bold">Insights</div>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
      {/* Footer */}
      <footer className="landing-footer text-center w-100 mt-auto py-4 position-absolute bottom-0 start-0" style={{background: 'rgba(255,255,255,0.8)', fontWeight: 500, fontSize: '1.1rem', letterSpacing: '0.01em'}}>
        &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;