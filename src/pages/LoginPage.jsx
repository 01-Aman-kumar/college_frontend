import React, { useState } from 'react';
import axiosInstance from '../api/axios.js';
import {Container,Form,Button,Alert,Card,Row,Col,InputGroup} from 'react-bootstrap';

import {
    Link,
    useNavigate
} from 'react-router-dom';

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError('');

        try {

            const { data } =
                await axiosInstance.post(
                    '/auth/login',
                    { email, password }
                );

            localStorage.setItem(
                'userInfo',
                JSON.stringify(data)
            );

            setLoading(false);

            if (data.role === 'Admin') {

                navigate('/admin-dashboard');

            } else {

                navigate('/dashboard');
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                'Login failed'
            );

            setLoading(false);
        }
    };

    return (

        <div
            className="p-5 d-flex align-items-center"
            style={{
                marginTop: '74px',
                background:
                    'linear-gradient(135deg, #f1f5f9, #dbeafe)'
            }}
        >

            <Container>

                <Row
                    className="justify-content-center shadow-lg rounded-4 overflow-hidden bg-white"
                    style={{
                        maxWidth: '1050px',
                        margin: 'auto'
                    }}
                >

                    {/* LEFT SIDE */}
                    <Col
                        lg={6}
                        className="d-none d-lg-flex flex-column justify-content-center text-white p-4"
                        style={{
                            background:
                                'linear-gradient(135deg, #dc2626, #b91c1c)',
                            minHeight: '520px'
                        }}
                    >

                        <div>

                            <div
                                className="mb-3 d-flex align-items-center justify-content-center"
                                style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '20px',
                                    background:
                                        'rgba(255,255,255,0.12)',
                                    fontSize: '28px'
                                }}
                            >

                                <i className="fa-solid fa-truck-medical"></i>

                            </div>

                            <h2 className="fw-bold mb-2">
                                JEEVAN
                            </h2>

                            <h5 className="fw-semibold mb-3">
                                Emergency Response Platform
                            </h5>

                            <p
                                className="opacity-75"
                                style={{
                                    fontSize: '15px',
                                    lineHeight: '28px'
                                }}
                            >
                                Connect with emergency responders,
                                volunteers, and hospitals instantly
                                during critical situations.
                            </p>

                            <div className="mt-4">

                                <div className="d-flex align-items-center mb-3">

                                    <i className="fa-solid fa-bolt me-3"></i>

                                    <span style={{ fontSize: '14px' }}>
                                        Instant Emergency Alerts
                                    </span>

                                </div>

                                <div className="d-flex align-items-center mb-3">

                                    <i className="fa-solid fa-location-dot me-3"></i>

                                    <span style={{ fontSize: '14px' }}>
                                        Real-Time Location Tracking
                                    </span>

                                </div>

                                <div className="d-flex align-items-center">

                                    <i className="fa-solid fa-user-shield me-3"></i>

                                    <span style={{ fontSize: '14px' }}>
                                        Secure Responder Access
                                    </span>

                                </div>

                            </div>

                        </div>

                    </Col>

                    {/* RIGHT SIDE */}
                    <Col
                        xs={12}
                        lg={6}
                        className="p-4 d-flex align-items-center"
                    >

                        <div className="w-100">

                            <div className="text-center mb-4">

                                <h3
                                    className="fw-bold text-dark mb-2"
                                    style={{ fontSize: '28px' }}
                                >
                                    Welcome Back
                                </h3>

                                <p
                                    className="text-muted"
                                    style={{ fontSize: '14px' }}
                                >
                                    Login to continue your dashboard
                                </p>

                            </div>

                            {error && (

                                <Alert
                                    variant="danger"
                                    className="rounded-3 py-2"
                                    style={{ fontSize: '14px' }}
                                >
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={submitHandler}>

                                {/* EMAIL */}
                                <Form.Group
                                    className="mb-3"
                                    controlId="email"
                                >

                                    <Form.Label
                                        className="fw-semibold"
                                        style={{ fontSize: '14px' }}
                                    >
                                        Email Address
                                    </Form.Label>

                                    <InputGroup>

                                        <InputGroup.Text className="bg-light border-end-0">
                                            <i className="fa-solid fa-envelope text-muted"></i>
                                        </InputGroup.Text>

                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="border-start-0 py-2"
                                            style={{ fontSize: '14px' }}
                                            required
                                        />

                                    </InputGroup>

                                </Form.Group>

                                {/* PASSWORD */}
                                <Form.Group
                                    className="mb-3"
                                    controlId="password"
                                >

                                    <Form.Label
                                        className="fw-semibold"
                                        style={{ fontSize: '14px' }}
                                    >
                                        Password
                                    </Form.Label>

                                    <InputGroup>

                                        <InputGroup.Text className="bg-light border-end-0">
                                            <i className="fa-solid fa-lock text-muted"></i>
                                        </InputGroup.Text>

                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="border-start-0 py-2"
                                            style={{ fontSize: '14px' }}
                                            required
                                        />

                                    </InputGroup>

                                </Form.Group>

                                {/* OPTIONS */}
                                <div
                                    className="d-flex justify-content-between align-items-center mb-3"
                                    style={{ fontSize: '13px' }}
                                >

                                    <Form.Check
                                        type="checkbox"
                                        label="Remember Me"
                                    />

                                    <Link
                                        to="#"
                                        className="text-decoration-none fw-semibold"
                                    >
                                        Forgot Password?
                                    </Link>

                                </div>

                                {/* BUTTON */}
                                <div className="d-grid">

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="py-2 rounded-3 border-0 fw-bold"
                                        style={{
                                            fontSize: '15px',
                                            background:
                                                'linear-gradient(135deg, #2563eb, #1d4ed8)',
                                            boxShadow:
                                                '0 8px 20px rgba(37,99,235,0.25)'
                                        }}
                                    >

                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Logging In...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-right-to-bracket me-2"></i>
                                                Login
                                            </>
                                        )}

                                    </Button>

                                </div>

                            </Form>

                            {/* FOOTER */}
                            <div className="text-center mt-3">

                                <p
                                    className="text-muted mb-0"
                                    style={{ fontSize: '14px' }}
                                >

                                    New Responder?{' '}

                                    <Link
                                        to="/register"
                                        className="fw-bold text-decoration-none"
                                    >
                                        Register Here
                                    </Link>

                                </p>

                            </div>

                        </div>

                    </Col>

                </Row>

            </Container>

        </div>
    );
};

export default LoginPage;