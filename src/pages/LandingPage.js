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
    <div className="landing-page hero-section d-flex align-items-center justify-content-center min-vh-100" style={{background: 'none'}}>
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col lg={7} className="text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <h1 className="display-3 fw-bold mb-4 gradient-text" style={{letterSpacing: '-0.02em'}}>Welcome to TaskFlow</h1>
              <p className="lead mb-5 text-secondary fs-4" style={{maxWidth: 500, margin: '0 auto', fontWeight: 400}}>
                A minimal, modern workspace for your team.<br/>
                Organize. Collaborate. Grow.
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleGetStarted}
                className="get-started-btn shadow-lg px-5 py-3 mb-5"
                style={{ fontSize: '1.2rem', borderRadius: 12 }}
              >
                {token ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                <div className="badge-card bg-white border-0 shadow-sm p-3 px-4 minimal-badge">
                  <FaChartLine size={28} className="text-primary mb-2" />
                  <div className="fw-bold" style={{fontSize: '1.1rem'}}>Progress</div>
                </div>
                <div className="badge-card bg-white border-0 shadow-sm p-3 px-4 minimal-badge">
                  <FaUsers size={28} className="text-primary mb-2" />
                  <div className="fw-bold" style={{fontSize: '1.1rem'}}>Collaboration</div>
                </div>
                <div className="badge-card bg-white border-0 shadow-sm p-3 px-4 minimal-badge">
                  <FaLightbulb size={28} className="text-primary mb-2" />
                  <div className="fw-bold" style={{fontSize: '1.1rem'}}>Insights</div>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;