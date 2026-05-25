import React, {useEffect,useState,} from 'react';
import {Row,Col,Card,Table,Badge,Spinner,ProgressBar,} from 'react-bootstrap';
import axiosInstance from '../api/axios.js';
import {Bar,Doughnut,} from 'react-chartjs-2';
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Legend,} from 'chart.js';
import {PeopleFill, ExclamationTriangleFill,CheckCircleFill, Activity,} from 'react-bootstrap-icons';
import './AdminDashboardPage.css';


ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Legend);
const AdminDashboardPage = () => {
    const [loading, setLoading] =useState(true);
    const [requests, setRequests] =useState([]);
    const [stats, setStats] =useState({
            total: 0,
            pending: 0,
            inProgress: 0,
            resolved: 0,
        });
    useEffect(() => {
        const fetchData = async () => {
            try {
              const userInfo =JSON.parse(
                        localStorage.getItem(
                            'userInfo'
                        )
                    );

                const { data } =
                    await axiosInstance.get('/admin/requests',

                        {
                            headers: {
                                Authorization:
                                    `Bearer ${userInfo.token}`,
                            },
                        }
                    );

                setRequests(data || []);

                setStats({
                    total:data.length,
                    pending:data.filter((r) =>r.status ==='Pending' ).length,
                    inProgress: data.filter((r) =>r.status ==='In Progress').length,
                    resolved:data.filter((r) =>r.status ==='Resolved').length,
                });

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);
            }
        };

        fetchData();

    }, []);



    // BAR CHART
    const barData = {

        labels: ['Pending','In Progress','Resolved',],
        datasets: [
            {
                label:'Emergency Requests',
                data: [stats.pending,stats.inProgress,stats.resolved,],
                backgroundColor: ['#f59e0b','#06b6d4','#10b981',],
                borderColor: ['#d97706','#0284c7','#059669',],
                borderWidth: 2,borderRadius: 12,
            },
        ],
    };
    // DOUGHNUT CHART
    const doughnutData = {

        labels: ['Pending','In Progress','Resolved',],
        datasets: [
            {
                data: [

                    stats.pending,

                    stats.inProgress,

                    stats.resolved,
                ],

                backgroundColor: [

                    '#f59e0b',

                    '#06b6d4',

                    '#10b981',
                ],

                hoverBackgroundColor: [

                    '#fbbf24',

                    '#38bdf8',

                    '#34d399',
                ],

                borderWidth: 0,
            },
        ],
    };



    // CHART OPTIONS
    const chartOptions = {

        responsive: true,

        plugins: {

            legend: {

                labels: {

                    color: '#374151',

                    font: {
                        size: 14,
                    },
                },
            },
        },

        scales: {

            y: {

                ticks: {

                    color: '#6b7280',
                },

                grid: {

                    color: '#e5e7eb',
                },
            },

            x: {

                ticks: {

                    color: '#6b7280',
                },

                grid: {

                    display: false,
                },
            },
        },
    };



    if (loading) {

        return (

            <div className="text-center py-5">

                <Spinner animation="border" />

            </div>
        );
    }


    return (

        <div className="admin-dashboard">

            <div className="dashboard-header">

                <h2>
                    Emergency Command Center
                </h2>

                <p>
                    Real-time emergency analytics
                    and response monitoring
                </p>
            </div>



            {/* STATS */}
            <Row>

                <Col lg={3} md={6}>

                    <Card className="dashboard-card total-card">

                        <Card.Body>

                            <div className="card-icon">
                                <Activity />
                            </div>

                            <h6>
                                Total Requests
                            </h6>

                            <h2>
                                {stats.total}
                            </h2>

                        </Card.Body>
                    </Card>
                </Col>


                <Col lg={3} md={6}>

                    <Card className="dashboard-card pending-card">

                        <Card.Body>

                            <div className="card-icon">
                                <ExclamationTriangleFill />
                            </div>

                            <h6>
                                Pending Cases
                            </h6>

                            <h2>
                                {stats.pending}
                            </h2>

                        </Card.Body>
                    </Card>
                </Col>


                <Col lg={3} md={6}>

                    <Card className="dashboard-card progress-card">

                        <Card.Body>

                            <div className="card-icon">
                                <PeopleFill />
                            </div>

                            <h6>
                                Active Responses
                            </h6>

                            <h2>
                                {stats.inProgress}
                            </h2>

                        </Card.Body>
                    </Card>
                </Col>


                <Col lg={3} md={6}>

                    <Card className="dashboard-card resolved-card">

                        <Card.Body>

                            <div className="card-icon">
                                <CheckCircleFill />
                            </div>

                            <h6>
                                Resolved Cases
                            </h6>

                            <h2>
                                {stats.resolved}
                            </h2>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>



            {/* CHARTS */}
            <Row className="mt-4">

                <Col lg={8}>

                    <Card className="chart-card">

                        <Card.Body>

                            <h5 className="mb-4">
                                Emergency Analytics
                            </h5>

                            <Bar
                                data={barData}
                                options={chartOptions}
                            />

                        </Card.Body>
                    </Card>
                </Col>


                <Col lg={4}>

                    <Card className="chart-card">

                        <Card.Body>

                            <h5 className="mb-4">
                                Status Overview
                            </h5>

                            <Doughnut
                                data={doughnutData}

                                options={{
                                    plugins: {
                                        legend: {
                                            position:
                                                'bottom',
                                        },
                                    },
                                }}
                            />

                        </Card.Body>
                    </Card>
                </Col>
            </Row>



            {/* RESPONSE RATE */}
            <Row className="mt-4">

                <Col>

                    <Card className="chart-card">

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <h5>
                                    Response Efficiency
                                </h5>

                                <strong>

                                    {
                                        stats.total > 0

                                            ? Math.round(
                                                (stats.resolved /
                                                    stats.total) *
                                                100
                                            )

                                            : 0
                                    }

                                    %
                                </strong>
                            </div>

                            <ProgressBar

                                now={
                                    stats.total > 0

                                        ? (stats.resolved /
                                            stats.total) *
                                        100

                                        : 0
                                }

                                variant="success"
                            />

                        </Card.Body>
                    </Card>
                </Col>
            </Row>



            {/* RECENT REQUESTS */}
            <Row className="mt-4">

                <Col>

                    <Card className="chart-card">

                        <Card.Body>

                            <h5 className="mb-4">
                                Recent Emergency Requests
                            </h5>

                            <Table
                                responsive
                                hover
                                className="admin-table"
                            >

                                <thead>

                                    <tr>

                                        <th>ID</th>

                                        <th>Type</th>

                                        <th>Status</th>

                                        <th>Victims</th>

                                        <th>Priority</th>

                                        <th>Responder</th>

                                        <th>Created</th>

                                    </tr>
                                </thead>


                                <tbody>

                                    {requests
                                        ?.slice(0, 10)

                                        ?.map((req) => (

                                            <tr
                                                key={req._id}
                                            >

                                                <td>
                                                    #
                                                    {req._id.slice(
                                                        -6
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        req.emergencyType
                                                    }
                                                </td>

                                                <td>

                                                    <Badge
                                                        bg={
                                                            req.status ===
                                                                'Pending'

                                                                ? 'warning'

                                                                : req.status ===
                                                                    'Resolved'

                                                                    ? 'success'

                                                                    : 'primary'
                                                        }
                                                    >

                                                        {
                                                            req.status
                                                        }

                                                    </Badge>
                                                </td>

                                                <td>
                                                    {
                                                        req.victimCount
                                                    }
                                                </td>

                                                <td>

                                                    <Badge
                                                        bg={
                                                            req.priority ===
                                                                'Critical'

                                                                ? 'danger'

                                                                : req.priority ===
                                                                    'Medium'

                                                                    ? 'warning'

                                                                    : 'success'
                                                        }
                                                    >

                                                        {
                                                            req.priority
                                                        }

                                                    </Badge>
                                                </td>

                                                <td>

                                                    {req.assignedResponder
                                                        ?.name ||

                                                        'Not Assigned'}
                                                </td>

                                                <td>

                                                    {new Date(
                                                        req.createdAt
                                                    ).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboardPage;