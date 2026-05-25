import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';
import {Container,Row,Col,Card,Badge,Spinner,} from 'react-bootstrap';
import {MapContainer,TileLayer,Marker,Popup,} from 'react-leaflet';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios.js';
import io from 'socket.io-client';
// const socket = io('http://localhost:5000');
const socket = io("https://project-backend-4usa.onrender.com");

const calculateDistance = (lat1, lon1, lat2, lon2) => {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;

    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

const RoutingMachine = ({ userLocation, responderLocation }) => {

    const map = useMap();

    React.useEffect(() => {

        if (!userLocation || !responderLocation) return;

        const routingControl = L.Routing.control({

            waypoints: [

                L.latLng(
                    responderLocation[0],
                    responderLocation[1]
                ),

                L.latLng(
                    userLocation[0],
                    userLocation[1]
                ),
            ],

            routeWhileDragging: false,

            draggableWaypoints: false,

            addWaypoints: false,

            fitSelectedRoutes: true,

            show: false,

        }).addTo(map);

        return () => map.removeControl(routingControl);

    }, [map, userLocation, responderLocation]);

    return null;
};



const TrackRequestPage = () => {
    const [eta, setEta] = useState(null);

    const [distance, setDistance] = useState(null);

    const { id } = useParams();

    const [request, setRequest] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');


    // FETCH REQUEST
    useEffect(() => {

        const fetchRequest = async () => {

            try {

                const { data } = await axiosInstance.get(`/requests/${id}`);

                setRequest(data);

            } catch (err) {

                setError('Failed to fetch request');
            }

            setLoading(false);
        };

        fetchRequest();

    }, [id]);


    // SOCKET LIVE UPDATES
    useEffect(() => {

        socket.on('requestUpdated', (updatedRequest) => {

            if (updatedRequest._id === id) {

                setRequest(updatedRequest);
            }
        });


        socket.on('responderLocationUpdated', (updatedRequest) => {

            if (updatedRequest._id === id) {

                setRequest(updatedRequest);
            }
        });

        return () => {

            socket.off('requestUpdated');

            socket.off('responderLocationUpdated');
        };

    }, [id]);

    useEffect(() => {

        if (
            !request ||
            !request.location ||
            !request.responderLocation
        ) {
            return;
        }

        if (
            request.responderLocation.coordinates[0] !== 0
        ) {

            const userLat =
                request.location.coordinates[1];

            const userLng =
                request.location.coordinates[0];

            const responderLat =
                request.responderLocation.coordinates[1];

            const responderLng =
                request.responderLocation.coordinates[0];

            const dist = calculateDistance(
                userLat,
                userLng,
                responderLat,
                responderLng
            );

            setDistance(dist.toFixed(2));

            const estimatedMinutes = (dist / 40) * 60;

            setEta(Math.ceil(estimatedMinutes));
        }

    }, [request]);


    if (loading) {

        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" />
            </Container>
        );
    }


    if (error) {

        return (
            <Container className="py-5 text-center">
                <h4>{error}</h4>
            </Container>
        );
    }


    return (

        <Container className="py-4">

            <Row>

                {/* LEFT SIDE */}
                <Col md={4}>

                    <Card className="mb-3">

                        <Card.Body>

                            <h4>
                                Emergency Details
                            </h4>

                            <hr />

                            <p>
                                <strong>Type:</strong>
                                {' '}
                                {request.emergencyType}
                            </p>

                            <p>
                                <strong>Victims:</strong>
                                {' '}
                                {request.victimCount}
                            </p>

                            <p>
                                <strong>Contact:</strong>
                                {' '}
                                {request.contactNumber}
                            </p>

                            <p>
                                <strong>Status:</strong>

                                <br />

                                <Badge
                                    bg={
                                        request.status === 'Pending'
                                            ? 'warning'
                                            : request.status === 'Resolved'
                                                ? 'success'
                                                : 'primary'
                                    }
                                >
                                    {request.status}
                                </Badge>
                            </p>

                            {distance && (

                                <>

                                    <p>
                                        <strong>Distance:</strong>
                                        {' '}
                                        {distance} km
                                    </p>

                                    <p>
                                        <strong>Estimated Arrival:</strong>
                                        {' '}
                                        {eta} mins
                                    </p>

                                </>
                            )}

                        </Card.Body>
                    </Card>


                    {/* RESPONDER DETAILS */}
                    <Card>

                        <Card.Body>

                            <h4>
                                Responder
                            </h4>

                            <hr />

                            {request.assignedResponder ? (

                                <>
                                    <p>
                                        <strong>Name:</strong>
                                        {' '}
                                        {request.assignedResponder.name}
                                    </p>

                                    <p>
                                        <strong>Email:</strong>
                                        {' '}
                                        {request.assignedResponder.email}
                                    </p>

                                    <Badge bg="success">
                                        Assigned
                                    </Badge>
                                </>

                            ) : (

                                <Badge bg="warning">
                                    Waiting for responder...
                                </Badge>
                            )}

                        </Card.Body>
                    </Card>
                </Col>


                {/* MAP */}
                <Col md={8}>

                    <Card>

                        <Card.Body>

                            <h4 className="mb-3">
                                Live Tracking
                            </h4>

                            <div
                                style={{
                                    height: '600px',
                                    width: '100%',
                                }}
                            >{request?.location && (
                                <MapContainer
                                    center={[
                                        request.location.coordinates[1],
                                        request.location.coordinates[0],
                                    ]}

                                    zoom={13}

                                    style={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >

                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />


                                    {/* EMERGENCY LOCATION */}
                                    <Marker
                                        position={[
                                            request.location.coordinates[1],
                                            request.location.coordinates[0],
                                        ]}
                                    >

                                        <Popup>
                                            Emergency Location
                                        </Popup>

                                    </Marker>


                                    {/* RESPONDER LIVE LOCATION */}
                                    {request.responderLocation?.coordinates[0] !== 0 && (

                                        <Marker
                                            position={[
                                                request.responderLocation.coordinates[1],
                                                request.responderLocation.coordinates[0],
                                            ]}
                                        >

                                            <Popup>
                                                Live Responder Location
                                            </Popup>

                                        </Marker>
                                    )}


                                    {/* LIVE ROUTE */}
                                    {request.responderLocation?.coordinates[0] !== 0 && (

                                        <RoutingMachine

                                            responderLocation={[
                                                request.responderLocation.coordinates[1],
                                                request.responderLocation.coordinates[0],
                                            ]}

                                            userLocation={[
                                                request.location.coordinates[1],
                                                request.location.coordinates[0],
                                            ]}
                                        />
                                    )}

                                </MapContainer>
                            )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TrackRequestPage;