
import React, {useState,useEffect,} from 'react';

import {Form,Button,Row,Col,Card,Alert,Badge,Spinner,Image,} from 'react-bootstrap';
import axiosInstance from '../api/axios.js';
const ProfilePage = () => {


// ==========================================
// STATES
// ==========================================
const [name, setName] =
    useState('');

const [email, setEmail] =
    useState('');

const [phone, setPhone] =
    useState('');

const [city, setCity] =
    useState('');

const [
    specialization,
    setSpecialization,
] = useState('');

const [
    emergencyContact,
    setEmergencyContact,
] = useState('');

const [
    availabilityStatus,
    setAvailabilityStatus,
] = useState('');

const [
    verificationStatus,
    setVerificationStatus,
] = useState('');

const [
    profileImage,
    setProfileImage,
] = useState('');

const [
    selectedImage,
    setSelectedImage,
] = useState(null);

const [message, setMessage] =
    useState(null);

const [error, setError] =
    useState(null);

const [loading, setLoading] =
    useState(true);

// ==========================================
// AUTH CONFIG
// ==========================================
const { token } = JSON.parse(
    localStorage.getItem(
        'userInfo'
    )
);

// ==========================================
// FETCH PROFILE
// ==========================================
useEffect(() => {

    const fetchUserProfile =
        async () => {

            try {

                const { data } =
                    await axiosInstance.get('/users/profile',

                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                setName(data.name);

                setEmail(data.email);

                setPhone(
                    data.phone || ''
                );

                setCity(
                    data.city || ''
                );

                setSpecialization(
                    data.specialization ||
                    'Volunteer'
                );

                setEmergencyContact(
                    data.emergencyContact ||
                    ''
                );

                setAvailabilityStatus(
                    data.availabilityStatus ||
                    'Offline'
                );

                setVerificationStatus(
                    data.verificationStatus ||
                    'Pending'
                );

                setProfileImage(
                    data.profileImage || ''
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);
            }
        };

    fetchUserProfile();

}, [token]);

// ==========================================
// UPDATE PROFILE
// ==========================================
const submitHandler =
    async (e) => {

        e.preventDefault();

        setError(null);

        setMessage(null);

        try {

            const formData =
                new FormData();

            formData.append(
                'name',
                name
            );

            formData.append(
                'email',
                email
            );

            formData.append(
                'phone',
                phone
            );

            formData.append(
                'city',
                city
            );

            formData.append(
                'specialization',
                specialization
            );

            formData.append(
                'emergencyContact',
                emergencyContact
            );

            // IMAGE
            if (selectedImage) {

                formData.append(
                    'profileImage',
                    selectedImage
                );
            }

            const { data } =
                await axiosInstance.put('/users/profile',formData,

                    {
                        headers: {Authorization:`Bearer ${token}`,

                            'Content-Type':
                                'multipart/form-data',
                        },
                    }
                );

            // UPDATE IMAGE
            setProfileImage(
                data.user.profileImage
            );

            // UPDATE LOCAL STORAGE
            const userInfo =
                JSON.parse(
                    localStorage.getItem(
                        'userInfo'
                    )
                );

            userInfo.name =
                data.user.name;

            localStorage.setItem(
                'userInfo',
                JSON.stringify(userInfo)
            );

            setMessage(
                'Profile updated successfully'
            );

        } catch (err) {

            setError(
                err.response?.data
                    ?.message ||
                'An error occurred'
            );
        }
    };

// ==========================================
// LOADING
// ==========================================
if (loading) {

    return (

        <div className="text-center py-5">

            <Spinner animation="border" />

        </div>
    );
}

return (

    <div className="container py-4">

        <Row className="g-4">

            {/* ==========================================
                LEFT PROFILE CARD
            ========================================== */}
            <Col lg={4}>

                <Card
                    className="border-0 shadow-sm rounded-4"
                >

                    <Card.Body className="text-center p-4">

                        {/* IMAGE */}
                        <Image src={profileImage? `${profileImage}` : 'https://via.placeholder.com/150'}
                            roundedCircle
                            width="140"
                            height="140"
                            style={{
                                objectFit:
                                    'cover',
                                border:
                                    '5px solid #e5e7eb',
                            }}
                        />

                        <h3 className="fw-bold mt-3">

                            {name}

                        </h3>

                        <p className="text-muted">

                            {email}

                        </p>

                        {/* SPECIALIZATION */}
                        <Badge
                            bg="primary"
                            className="px-3 py-2 rounded-pill"
                        >

                            {specialization}

                        </Badge>

                        {/* INFO */}
                        <div className="mt-4 text-start">

                            <div className="mb-3">

                                <small className="text-muted">
                                    Phone
                                </small>

                                <div className="fw-semibold">
                                    {phone ||
                                        'N/A'}
                                </div>

                            </div>

                            <div className="mb-3">

                                <small className="text-muted">
                                    City
                                </small>

                                <div className="fw-semibold">
                                    {city ||
                                        'N/A'}
                                </div>

                            </div>

                            <div className="mb-3">

                                <small className="text-muted">
                                    Emergency
                                    Contact
                                </small>

                                <div className="fw-semibold">
                                    {emergencyContact ||
                                        'N/A'}
                                </div>

                            </div>

                            {/* VERIFICATION */}
                            <div className="mb-3">

                                <small className="text-muted">
                                    Verification
                                </small>

                                <div>

                                    <Badge
                                        bg={
                                            verificationStatus ===
                                            'Verified'

                                                ? 'success'

                                                : verificationStatus ===
                                                  'Rejected'

                                                ? 'danger'

                                                : 'warning'
                                        }
                                        className="mt-1"
                                    >

                                        {
                                            verificationStatus
                                        }

                                    </Badge>

                                </div>

                            </div>

                            {/* AVAILABILITY */}
                            <div>

                                <small className="text-muted">
                                    Availability
                                </small>

                                <div>

                                    <Badge
                                        bg={
                                            availabilityStatus ===
                                            'Available'

                                                ? 'success'

                                                : availabilityStatus ===
                                                  'Busy'

                                                ? 'warning'

                                                : 'secondary'
                                        }
                                        className="mt-1"
                                    >

                                        {
                                            availabilityStatus
                                        }

                                    </Badge>

                                </div>

                            </div>

                        </div>

                    </Card.Body>

                </Card>

            </Col>

            {/* ==========================================
                RIGHT FORM
            ========================================== */}
            <Col lg={8}>

                <Card
                    className="border-0 shadow-sm rounded-4"
                >

                    <Card.Body className="p-4">

                        <div className="mb-4">

                            <h3 className="fw-bold"> Update Profile</h3>

                            <p className="text-muted"> Manage your responder profile information </p>

                        </div>

                        {message && (

                            <Alert variant="success">

                                {message}

                            </Alert>
                        )}

                        {error && (

                            <Alert variant="danger">

                                {error}

                            </Alert>
                        )}

                        <Form onSubmit={submitHandler}>

                            <Row>

                                {/* NAME */}
                                <Col md={6}>

                                    <Form.Group className="mb-3">

                                        <Form.Label>
                                            Full Name
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            value={name}
                                            onChange={(e) =>
                                                setName(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </Form.Group>

                                </Col>

                                {/* EMAIL */}
                                <Col md={6}>

                                    <Form.Group className="mb-3">

                                        <Form.Label>
                                            Email
                                        </Form.Label>

                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </Form.Group>

                                </Col>

                                {/* PHONE */}
                                <Col md={6}>

                                    <Form.Group className="mb-3">

                                        <Form.Label>
                                            Phone
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </Form.Group>

                                </Col>

                                {/* CITY */}
                                <Col md={6}>

                                    <Form.Group className="mb-3">

                                        <Form.Label>
                                            City
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            value={city}
                                            onChange={(e) =>
                                                setCity(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </Form.Group>

                                </Col>

                                {/* SPECIALIZATION */}
                                <Col md={6}>

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

                                </Col>

                                {/* EMERGENCY CONTACT */}
                                <Col md={6}>

                                    <Form.Group className="mb-3">

                                        <Form.Label>
                                            Emergency
                                            Contact
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            value={
                                                emergencyContact
                                            }
                                            onChange={(e) =>
                                                setEmergencyContact(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </Form.Group>

                                </Col>

                                {/* PROFILE IMAGE */}
                                <Col md={12}>

                                    <Form.Group className="mb-4">

                                        <Form.Label>
                                            Profile
                                            Image
                                        </Form.Label>

                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setSelectedImage(
                                                    e.target.files[0]
                                                )
                                            }
                                        />

                                    </Form.Group>

                                </Col>

                            </Row>

                            {/* BUTTON */}
                            <div className="d-grid">

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="rounded-3 fw-bold"
                                >

                                    Update Profile

                                </Button>

                            </div>

                        </Form>

                    </Card.Body>

                </Card>

            </Col>

        </Row>

    </div>
);


};

export default ProfilePage;
