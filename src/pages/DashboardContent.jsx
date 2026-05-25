import React, { useState, useEffect } from 'react';
import {Row,Col,Card,Badge,Table,Button,} from 'react-bootstrap';
import axiosInstance from '../api/axios.js';
import io from 'socket.io-client';
import {MapContainer,TileLayer,Marker,Popup,useMap,} from 'react-leaflet';
import {Compass,Telephone,Building,ExclamationCircle,} from 'react-bootstrap-icons';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './DashboardContent.css';
// const socket = io('http://localhost:5000');
const socket = io("https://project-backend-4usa.onrender.com");
const RoutingMachine = ({responderPosition,emergencyPosition,}) => {
    const map = useMap();
    useEffect(() => {

        if (!responderPosition ||!emergencyPosition) {
            return;
        }

        const routingControl =
            L.Routing.control({

                waypoints: [

                    L.latLng(
                        responderPosition[0],
                        responderPosition[1]
                    ),

                    L.latLng(
                        emergencyPosition[0],
                        emergencyPosition[1]
                    ),
                ],

                lineOptions: {
                    styles: [
                        {
                            color: 'blue',
                            weight: 5,
                        },
                    ],
                },

                routeWhileDragging: false,

                draggableWaypoints: false,

                addWaypoints: false,

                fitSelectedRoutes: true,

                show: false,

            }).addTo(map);

        return () => {

            map.removeControl(
                routingControl
            );
        };

    }, [
        responderPosition,
        emergencyPosition,
        map,
    ]);

    return null;
};



const DashboardContent = () => {
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
    });

    const [selectedRequest, setSelectedRequest] =useState(null);
    // FETCH REQUESTS
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await axiosInstance.get('/requests');
                setRequests(data || []);
            } catch (error) {
                console.log(error);
            }
        };
        fetchRequests();
        socket.on('newHelpRequest', (newRequest) => {

            setRequests((prev) => [
                newRequest,
                ...prev,
            ]);
        });
        socket.on('requestUpdated', (updatedRequest) => {
            setRequests((prev) =>
                prev.map((req) =>
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

        socket.on('responderLocationUpdated',
    (updatedRequest) => {

        setRequests((prev) => prev.map((req) =>

                req._id === updatedRequest._id
                    ? updatedRequest
                    : req
            )
        );

        if (
            selectedRequest &&
            selectedRequest._id === updatedRequest._id
        ) {

            setSelectedRequest(
                updatedRequest
            );
        }
    }
);

        return () => {
            socket.off('newHelpRequest');
            socket.off('requestUpdated');
            socket.off('responderLocationUpdated');
        };

    }, [selectedRequest]);


    // LIVE GPS TRACKING
    useEffect(() => {

        if (!selectedRequest) return;

        if (
            selectedRequest.status !== 'In Progress'
        ) {
            return;
        }

    const watchId =navigator.geolocation.watchPosition(

                (position) => {
                    console.log(
                        'Current Position:',
                        position
                    );

                    socket.emit(
                        'updateResponderLocation',
                        {
                            requestId:
                                selectedRequest._id,

                            longitude:
                                position.coords.longitude,

                            latitude:
                                position.coords.latitude,
                        }
                    );
                },

                (error) => {

                    console.log(error);
                },

                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000,
                }
            );

        return () => {

            navigator.geolocation.clearWatch(
                watchId
            );
        };

    }, [selectedRequest]);


    // AUTO SELECT + STATS
    useEffect(() => {

        if (
            !selectedRequest &&
            requests.length > 0
        ) {

            const firstPending =
                requests.find(
                    (r) => r.status === 'Pending'
                );

            if (firstPending) {

                setSelectedRequest(firstPending);

            } else {

                const activeRequest =
                    requests.find(
                        (r) =>
                            r.status !== 'Resolved'
                    );

                if (activeRequest) {
                    setSelectedRequest(activeRequest);
                }
            }
        }

        updateStats(requests);

    }, [requests]);


    const updateStats = (currentRequests) => {

        setStats({

            total: currentRequests?.length || 0,

            completed:
                currentRequests?.filter(
                    (r) => r.status === 'Resolved'
                ).length || 0,

            pending:
                currentRequests?.filter(
                    (r) => r.status === 'Pending'
                ).length || 0,
        });
    };


    const handleShowDetails = (req) => {

        setSelectedRequest(req);
    };


    // ACCEPT REQUEST
    const handleAcceptRequest = async (reqId) => {

        try {

            const userInfo = JSON.parse(
                localStorage.getItem('userInfo')
            );

            await axiosInstance.put(`/requests/${reqId}`,

                {
                    status: 'In Progress',
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${userInfo.token}`,
                    },
                }
            );

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                'Failed to accept request'
            );
        }
    };


    const handleNavigation = () => {

        if (
            !selectedRequest ||
            !selectedRequest.location
        ) {
            return;
        }

        const { coordinates } =
            selectedRequest.location;

        window.open(

            `https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}`,

            '_blank'
        );
    };


    const handleCall = () => {

        if (!selectedRequest) return;

        window.location.href =
            `tel:${selectedRequest.contactNumber}`;
    };


    return (

        <>

            {/* STATS */}
            <Row>

                <Col lg={4} md={6} className="mb-4">

                    <Card className="stat-card">

                        <h4>Current Status</h4>

                        <p className="mb-1">
                            Location: Yatharth Hospital
                        </p>

                        <p>
                            Vehicle: Ambulance #ER-205
                        </p>

                        <Badge bg="success">
                            Available
                        </Badge>

                    </Card>
                </Col>


                <Col lg={4} md={6} className="mb-4">

                    <Card className="stat-card">

                        <h4>Today's Activity</h4>

                        <h3>
                            {stats.total}
                            {' '}
                            <small>Requests</small>
                        </h3>

                        <p>
                            {stats.completed}
                            {' '}
                            Completed,
                            {' '}
                            {stats.pending}
                            {' '}
                            Pending
                        </p>

                    </Card>
                </Col>


                <Col lg={4} md={12} className="mb-4">

                    <Card className="stat-card">

                        <h4>Quick Actions</h4>

                        <Row>

                            <Col>

                                <Button
                                    variant="outline-primary"
                                    className="w-100"
                                    onClick={handleNavigation}
                                    disabled={!selectedRequest}
                                >

                                    <Compass />
                                    {' '}
                                    Navigation

                                </Button>
                            </Col>


                            <Col>

                                <Button
                                    variant="outline-success"
                                    className="w-100"
                                    onClick={handleCall}
                                    disabled={!selectedRequest}
                                >

                                    <Telephone />
                                    {' '}
                                    Call Victim

                                </Button>
                            </Col>
                        </Row>


                        <Row className="mt-2">

                            <Col>

                                <Button
                                    variant="outline-info"
                                    className="w-100"
                                    disabled
                                >

                                    <Building />
                                    {' '}
                                    Hospital Info

                                </Button>
                            </Col>


                            <Col>

                                <Button
                                    variant="outline-danger"
                                    className="w-100"
                                    disabled
                                >

                                    <ExclamationCircle />
                                    {' '}
                                    Emergency

                                </Button>
                            </Col>
                        </Row>

                    </Card>
                </Col>
            </Row>



            {/* REQUESTS */}
            <Card className="stat-card mb-4">

                <h4>
                    Active Emergency Requests
                </h4>

                <Table
                    hover
                    responsive
                    className="mt-3"
                >

                    <thead>

                        <tr>

                            <th>Status</th>

                            <th>Incident</th>

                            <th>Details</th>

                            <th>Actions</th>

                        </tr>
                    </thead>


                    <tbody>

                        {requests
                            ?.filter(
                                (r) =>
                                    r.status !==
                                    'Resolved'
                            )

                            ?.map((req) => (

                                <tr
                                    key={req._id}

                                    className="incident-row"

                                    onClick={() =>
                                        handleShowDetails(req)
                                    }
                                >

                                    <td>

                                        <Badge
                                            pill

                                            bg={
                                                req.status ===
                                                    'Pending'
                                                    ? 'warning'
                                                    : 'primary'
                                            }
                                        >

                                            {req.status}

                                        </Badge>
                                    </td>


                                    <td>

                                        <strong>
                                            {req.emergencyType}
                                        </strong>

                                        <br />

                                        <small>
                                            #ER-
                                            {req._id.slice(-6)}
                                        </small>

                                    </td>


                                    <td>
                                        {req.victimCount}
                                        {' '}
                                        victims
                                    </td>


                                    <td>

                                        {req.status === 'Pending' && ( <Button variant="primary" size="sm"
                                                    onClick={(e) => {e.stopPropagation();handleAcceptRequest( req._id);}} > Accept</Button>
                                            )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </Card>



            {/* MAP */}
            <Card className="stat-card">

                <h4 className="mb-3">
                    Response Map
                </h4>

                <div className="response-map-card">

                    {selectedRequest?.location ? (

                        <MapContainer

                            center={[
                                selectedRequest.location.coordinates[1],
                                selectedRequest.location.coordinates[0],
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


                            {/* EMERGENCY */}
                            {requests
                                ?.filter(
                                    (req) =>
                                        req.location
                                )

                                ?.map((req) => (

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

                                            Status:
                                            {' '}
                                            {req.status}

                                        </Popup>

                                    </Marker>
                                    
                                ))}


                            {/* RESPONDER */}
                            {selectedRequest
                                ?.responderLocation
                                ?.coordinates?.[0] !==
                                0 && (

                                    <Marker
                                        position={[ selectedRequest
                                                .responderLocation
                                                .coordinates[1],
                                            selectedRequest
                                                .responderLocation
                                                .coordinates[0],
                                        ]}
                                    >
                                       <Popup>
                                            Your Live Location
                                        </Popup>

                                    </Marker>
                                )}

                                {/* ROUTE TRACKING */}

{selectedRequest
    ?.responderLocation
    ?.coordinates?.[0] !== 0 && (

    <RoutingMachine

        responderPosition={[
            selectedRequest
                .responderLocation
                .coordinates[1],

            selectedRequest
                .responderLocation
                .coordinates[0],
        ]}

        emergencyPosition={[
            selectedRequest
                .location
                .coordinates[1],

            selectedRequest
                .location
                .coordinates[0],
        ]}
    />
)}
                        </MapContainer>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            No Active Location Available
                        </div>
                    )}
                </div>
            </Card>
        </>
    );
};

export default DashboardContent;