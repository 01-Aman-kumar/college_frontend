import React, { useState } from 'react';

import {Container,Form,Button,Alert,Row,Col,InputGroup,} from 'react-bootstrap';

import {Link,useNavigate,} from 'react-router-dom';

import axiosInstance from '../api/axios.js';

const RegisterPage = () => {


// ==========================================
// STATES
// ==========================================
const [name, setName] = useState('');

const [email, setEmail] = useState('');

const [phone, setPhone] = useState('');

const [specialization, setSpecialization] =
    useState('Volunteer');

const [city, setCity] = useState('');

const [
    emergencyContact,
    setEmergencyContact,
] = useState('');

const [password, setPassword] =
    useState('');

const [
    confirmPassword,
    setConfirmPassword,
] = useState('');

const [error, setError] =
    useState('');

const [success, setSuccess] =
    useState('');

const [loading, setLoading] =
    useState(false);

const navigate = useNavigate();

// ==========================================
// SUBMIT HANDLER
// ==========================================
const submitHandler = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {

        setError(
            'Passwords do not match'
        );

        return;
    }

    setLoading(true);

    setError('');

    try {

        const { data } =
            await axiosInstance.post(
                '/auth/register',
                {
                    name,
                    email,
                    phone,
                    specialization,
                    city,
                    emergencyContact,
                    password,
                }
            );

        localStorage.setItem(
            'userInfo',
            JSON.stringify(data)
        );

        setSuccess(
            'Registration successful. Wait for admin verification.'
        );

        setLoading(false);

        setTimeout(() => {

            navigate('/login');

        }, 2000);

    } catch (err) {

        setError(
            err.response?.data
                ?.message ||
            'Registration failed'
        );

        setLoading(false);
    }
};

return (

    <div
        className="min-vh-100 d-flex align-items-center"
        style={{
            marginTop: '74px',
            background:
                'linear-gradient(135deg, #f1f5f9, #dbeafe)',
        }}
    >

        <Container>

            <Row
                className="justify-content-center shadow-lg rounded-4 overflow-hidden bg-white"
                style={{
                    maxWidth: '1150px',
                    margin: 'auto',
                }}
            >

                {/* LEFT SIDE */}
                <Col
                    lg={6}
                    className="d-none d-lg-flex flex-column justify-content-center text-white p-5"
                    style={{
                        background:
                            'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    }}
                >

                    <div>

                        <div
                            className="mb-4 d-flex align-items-center justify-content-center"
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                background:
                                    'rgba(255,255,255,0.12)',
                                fontSize: '32px',
                            }}
                        >

                            <i className="fa-solid fa-user-plus"></i>

                        </div>

                        <h2 className="fw-bold mb-3">
                            Join JEEVAN
                        </h2>

                        <h5 className="fw-semibold mb-4">
                            Emergency Response Network
                        </h5>

                        <p
                            style={{
                                lineHeight: '30px',
                                color: 'white',
                                opacity: 0.9,
                            }}
                        >
                            Register as a verified responder
                            and become part of a
                            life-saving emergency network
                            with real-time coordination
                            and rapid response support.
                        </p>

                        <div className="mt-5">

                            <div className="d-flex align-items-center mb-3">

                                <i className="fa-solid fa-shield-heart me-3"></i>

                                <span>
                                    Admin Verified Responders
                                </span>

                            </div>

                            <div className="d-flex align-items-center mb-3">

                                <i className="fa-solid fa-location-crosshairs me-3"></i>

                                <span>
                                    Real-Time Emergency Tracking
                                </span>

                            </div>

                            <div className="d-flex align-items-center">

                                <i className="fa-solid fa-users me-3"></i>

                                <span>
                                    Community Rescue Network
                                </span>

                            </div>

                        </div>

                    </div>

                </Col>

                {/* RIGHT SIDE */}
                <Col
                    xs={12}
                    lg={6}
                    className="p-4 p-lg-5"
                >

                    <div className="w-100">

                        <div className="text-center mb-4">

                            <h3 className="fw-bold">
                                Create Responder Account
                            </h3>

                            <p className="text-muted">
                                Register to join the
                                emergency response system
                            </p>

                        </div>

                        {error && (

                            <Alert variant="danger">

                                {error}

                            </Alert>
                        )}

                        {success && (

                            <Alert variant="success">

                                {success}

                            </Alert>
                        )}

                        <Form
                            onSubmit={
                                submitHandler
                            }
                        >

                            {/* NAME */}
                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Full Name
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="fa-solid fa-user"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        placeholder="Enter full name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </InputGroup>

                            </Form.Group>

                            {/* EMAIL */}
                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Email Address
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="fa-solid fa-envelope"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </InputGroup>

                            </Form.Group>

                            {/* PHONE */}
                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Phone Number
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="fa-solid fa-phone"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        placeholder="Enter phone number"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </InputGroup>

                            </Form.Group>

                            {/* SPECIALIZATION */}
                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Specialization
                                </Form.Label>

                                <Form.Select
                                    value={
                                        specialization
                                    }
                                    onChange={(e) =>
                                        setSpecialization(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option>
                                        Volunteer
                                    </option>

                                    <option>
                                        Doctor
                                    </option>

                                    <option>
                                        Nurse
                                    </option>

                                    <option>
                                        Firefighter
                                    </option>

                                    <option>
                                        Police
                                    </option>

                                    <option>
                                        Ambulance Driver
                                    </option>

                                    <option>
                                        Other
                                    </option>

                                </Form.Select>

                            </Form.Group>

                            {/* CITY */}
                            <Form.Group className="mb-3">

                                <Form.Label>
                                    City
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="fa-solid fa-location-dot"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        placeholder="Enter city"
                                        value={city}
                                        onChange={(e) =>
                                            setCity(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </InputGroup>

                            </Form.Group>

                            {/* EMERGENCY CONTACT */}
                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Emergency Contact
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="fa-solid fa-phone-volume"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        placeholder="Emergency contact number"
                                        value={
                                            emergencyContact
                                        }
                                        onChange={(e) =>
                                            setEmergencyContact(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </InputGroup>

                            </Form.Group>

                            {/* PASSWORD */}
                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Password
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="fa-solid fa-lock"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </InputGroup>

                            </Form.Group>

                            {/* CONFIRM PASSWORD */}
                            <Form.Group className="mb-4">

                                <Form.Label>
                                    Confirm Password
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="fa-solid fa-shield-halved"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm password"
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </InputGroup>

                            </Form.Group>

                            {/* BUTTON */}
                            <div className="d-grid">

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="py-2 fw-bold border-0"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #16a34a, #15803d)',
                                    }}
                                >

                                    {loading
                                        ? 'Registering...'
                                        : 'Register as Responder'}

                                </Button>

                            </div>

                        </Form>

                        <div className="text-center mt-4">

                            <p className="text-muted">

                                Already have an account?{' '}

                                <Link
                                    to="/login"
                                    className="fw-bold text-decoration-none"
                                >
                                    Login Here
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

export default RegisterPage;
