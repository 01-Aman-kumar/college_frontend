import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Badge,
} from 'react-bootstrap';

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from 'react-leaflet';

import axios from 'axios';
import io from 'socket.io-client';

import './DashboardPage.css';

// const socket = io('http://localhost:5000');
const socket = io(process.env.VITE_API_BASE_URL);

const DashboardPage = () => {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [selectedRequest, setSelectedRequest] = useState(null);


    // FETCH REQUESTS
    useEffect(() => {

        const fetchRequests = async () => {

            try {

                const { data } = await axios.get(
                    'http://localhost:5000/api/requests'
                );

                setRequests(data);

                if (data.length > 0) {
                    setSelectedRequest(data[0]);
                }

            } catch (err) {

                setError('Failed to fetch emergency requests.');

            } finally {

                setLoading(false);
            }
        };

        fetchRequests();

    }, []);



    // SOCKET EVENTS
    useEffect(() => {

        // NEW REQUEST
        socket.on('newHelpRequest', (newRequest) => {

            setRequests((prevRequests) => [
                newRequest,
                ...prevRequests,
            ]);

            if (!selectedRequest) {
                setSelectedRequest(newRequest);
            }
        });


        // REQUEST UPDATED
        socket.on('requestUpdated', (updatedRequest) => {

            setRequests((prevRequests) =>

                prevRequests.map((req) =>

                    req._id === updatedRequest._id
                        ? updatedRequest
                        : req
                )
            );

            if (
                selectedRequest &&
                selectedRequest._id === updatedRequest._id
            ) {

                setSelectedRequest(updatedRequest);
            }
        });


        // LIVE RESPONDER LOCATION
        socket.on('responderLocationUpdated', (updatedRequest) => {

            setRequests((prevRequests) =>

                prevRequests.map((req) =>

                    req._id === updatedRequest._id
                        ? updatedRequest
                        : req
                )
            );

            if (
                selectedRequest &&
                selectedRequest._id === updatedRequest._id
            ) {

                setSelectedRequest(updatedRequest);
            }
        });


        return () => {

            socket.off('newHelpRequest');

            socket.off('requestUpdated');

            socket.off('responderLocationUpdated');
        };

    }, [selectedRequest]);


    const handleCardClick = (request) => {

        setSelectedRequest(request);
    };


    return (

        <Container fluid className="dashboard-container">

            <Row className="h-100">

                {/* LEFT SIDE */}
                <Col md={4} className="incident-list-col">

                    <h3 className="mb-3">
                        Live Incidents
                    </h3>

                    {loading && (
                        <Spinner animation="border" />
                    )}

                    {error && (
                        <p className="text-danger">
                            {error}
                        </p>
                    )}

                    <div className="incident-list">

                        {requests.map((req) => (

                            <Card
                                key={req._id}

                                className={`incident-card status-${req.status}
                                ${
                                    selectedRequest?._id === req._id
                                        ? 'selected'
                                        : ''
                                }`}

                                onClick={() => handleCardClick(req)}
                            >

                                <Card.Body>

                                    <Card.Title>
                                        {req.emergencyType}
                                    </Card.Title>

                                    <Card.Subtitle className="mb-2 text-muted">

                                        Victims: {req.victimCount}

                                    </Card.Subtitle>

                                    <Card.Text>

                                        <small>
                                            {new Date(
                                                req.createdAt
                                            ).toLocaleString()}
                                        </small>

                                        <br />

                                        <Badge
                                            bg={
                                                req.status === 'Pending'
                                                    ? 'warning'
                                                    : req.status === 'Resolved'
                                                    ? 'success'
                                                    : 'primary'
                                            }
                                        >
                                            {req.status}
                                        </Badge>

                                    </Card.Text>

                                    {/* RESPONDER INFO */}
                                    {req.assignedResponder && (

                                        <div className="mt-2">

                                            <strong>
                                                Responder:
                                            </strong>

                                            <br />

                                            {req.assignedResponder.name}

                                        </div>
                                    )}

                                </Card.Body>

                            </Card>
                        ))}
                    </div>
                </Col>


                {/* MAP SIDE */}
                <Col md={8} className="dashboard-map-col">

                    <div className="dashboard-map-container">

                        <MapContainer
                            center={
                                selectedRequest
                                    ? [
                                          selectedRequest.location.coordinates[1],
                                          selectedRequest.location.coordinates[0],
                                      ]
                                    : [20.5937, 78.9629]
                            }

                            zoom={selectedRequest ? 13 : 5}

                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        >

                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                                attribution='&copy; OpenStreetMap contributors'
                            />


                            {/* EMERGENCY LOCATION */}
                            {requests.map((req) => (

                                <Marker
                                    key={req._id}

                                    position={[
                                        req.location.coordinates[1],
                                        req.location.coordinates[0],
                                    ]}
                                >

                                    <Popup>

                                        <strong>
                                            {req.emergencyType}
                                        </strong>

                                        <br />

                                        Victims: {req.victimCount}

                                        <br />

                                        Status: {req.status}

                                    </Popup>

                                </Marker>
                            ))}


                            {/* LIVE RESPONDER LOCATION */}
                            {selectedRequest?.responderLocation?.coordinates[0] !== 0 && (

                                <Marker
                                    position={[
                                        selectedRequest.responderLocation.coordinates[1],

                                        selectedRequest.responderLocation.coordinates[0],
                                    ]}
                                >

                                    <Popup>

                                        Live Responder Location

                                    </Popup>

                                </Marker>
                            )}

                        </MapContainer>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardPage;