import React, {useEffect,useState,} from 'react';

import {Card,Table,Badge,Spinner,Button,Form,Image,} from 'react-bootstrap';
import axiosInstance from '../api/axios.js';

import './ManageUsersPage.css';

const ManageUsersPage = () => {

const [users, setUsers] =
    useState([]);

const [loading, setLoading] =
    useState(true);

// ==========================================
// FETCH USERS
// ==========================================
const fetchUsers = async () => {

    try {

        const userInfo =
            JSON.parse(
                localStorage.getItem(
                    'userInfo'
                )
            );

        const { data } =
            await axiosInstance.get('/admin/users',

                {
                    headers: {
                        Authorization:
                            `Bearer ${userInfo.token}`,
                    },
                }
            );

        setUsers(data);

    } catch (error) {

        console.log(error);

    } finally {

        setLoading(false);
    }
};

useEffect(() => {

    fetchUsers();

}, []);

// ==========================================
// DELETE USER
// ==========================================
const deleteUserHandler =
    async (id) => {

        const confirmDelete =
            window.confirm(
                'Delete this user?'
            );

        if (!confirmDelete) return;

        try {

            const userInfo =
                JSON.parse(
                    localStorage.getItem(
                        'userInfo'
                    )
                );

            await axiosInstance.delete(`/admin/users/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${userInfo.token}`,
                    },
                }
            );

            fetchUsers();

        } catch (error) {

            console.log(error);
        }
    };

// ==========================================
// UPDATE ROLE
// ==========================================
const updateRoleHandler =
    async (id, role) => {

        try {

            const userInfo =
                JSON.parse(
                    localStorage.getItem(
                        'userInfo'
                    )
                );

            await axiosInstance.put(`/admin/users/${id}`,{ role },

                {
                    headers: {
                        Authorization:
                            `Bearer ${userInfo.token}`,
                    },
                }
            );

            fetchUsers();

        } catch (error) {

            console.log(error);
        }
    };

// ==========================================
// VERIFY USER
// ==========================================
const verifyUserHandler =
    async (id) => {

        try {

            const userInfo =
                JSON.parse(localStorage.getItem('userInfo'));

            await axiosInstance.put(`/admin/verify/${id}`,{},
                {
                    headers: {Authorization:`Bearer ${userInfo.token}`,},
                }
            );

            fetchUsers();

        } catch (error) {

            console.log(error);
        }
    };

// ==========================================
// BLOCK USER
// ==========================================
const blockUserHandler =
    async (id) => {

        try {

            const userInfo =
                JSON.parse(
                    localStorage.getItem(
                        'userInfo'
                    )
                );

            await axiosInstance.put(`/admin/users/block/${id}`,{},

                {
                    headers: { Authorization:`Bearer ${userInfo.token}`,},
                }
            );

            fetchUsers();

        } catch (error) {

            console.log(error);
        }
    };

if (loading) {

    return (

        <div className="text-center py-5">

            <Spinner animation="border" />

        </div>
    );
}

return (

    <div className="manage-users-page">

        {/* HEADER */}
        <div className="page-header">

            <h2>
                Manage Responders
            </h2>

            <p>
                Manage users, responders,
                verification and access control
            </p>

        </div>

        {/* CARD */}
        <Card className="users-card">

            <Card.Body>

                <Table
                    responsive
                    hover
                    className="users-table"
                >

                    <thead>

                        <tr>

                            <th>User</th>

                            <th>Role</th>

                            <th>Specialization</th>

                            <th>Verification</th>

                            <th>Status</th>

                            <th>Joined</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {users.map((user) => (

                            <tr key={user._id}>

                                {/* USER */}
                                <td>

                                    <div className="d-flex align-items-center gap-3">

                                        <Image
                                            src={
                                                user.profileImage
                                                    ? `http://localhost:5000${user.profileImage}`
                                                    : 'https://via.placeholder.com/50'
                                            }
                                            roundedCircle
                                            width="50"
                                            height="50"
                                            style={{
                                                objectFit:
                                                    'cover',
                                            }}
                                        />

                                        <div>

                                            <strong>
                                                {user.name}
                                            </strong>

                                            <div
                                                className="text-muted"
                                                style={{
                                                    fontSize:
                                                        '13px',
                                                }}
                                            >
                                                {user.email}
                                            </div>

                                        </div>

                                    </div>

                                </td>

                                {/* ROLE */}
                                <td>

                                    <Badge
                                        bg={
                                            user.role ===
                                            'Admin'

                                                ? 'danger'

                                                : user.role ===
                                                  'Responder'

                                                ? 'primary'

                                                : 'secondary'
                                        }
                                    >

                                        {user.role}

                                    </Badge>

                                </td>

                                {/* SPECIALIZATION */}
                                <td>

                                    {user.specialization ||
                                        'N/A'}

                                </td>

                                {/* VERIFICATION */}
                                <td>

                                    <Badge
                                        bg={
                                            user.verificationStatus ===
                                            'Verified'

                                                ? 'success'

                                                : user.verificationStatus ===
                                                  'Rejected'

                                                ? 'danger'

                                                : 'warning'
                                        }
                                    >

                                        {
                                            user.verificationStatus
                                        }

                                    </Badge>

                                </td>

                                {/* BLOCK STATUS */}
                                <td>

                                    <Badge
                                        bg={
                                            user.isBlocked
                                                ? 'dark'
                                                : 'success'
                                        }
                                    >

                                        {user.isBlocked
                                            ? 'Blocked'
                                            : 'Active'}

                                    </Badge>

                                </td>

                                {/* DATE */}
                                <td>

                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString()}

                                </td>

                                {/* ACTIONS */}
                                <td>

                                    <div className="d-flex flex-column gap-2">

                                        {/* ROLE */}
                                        <Form.Select

                                            size="sm"

                                            value={
                                                user.role
                                            }

                                            onChange={(e) =>

                                                updateRoleHandler(

                                                    user._id,

                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="User">
                                                User
                                            </option>

                                            <option value="Responder">
                                                Responder
                                            </option>

                                            <option value="Admin">
                                                Admin
                                            </option>

                                        </Form.Select>

                                        {/* VERIFY */}
                                        {user.verificationStatus !==
                                            'Verified' && (

                                            <Button

                                                variant="success"

                                                size="sm"

                                                onClick={() =>

                                                    verifyUserHandler(
                                                        user._id
                                                    )
                                                }
                                            >

                                                Verify

                                            </Button>
                                        )}

                                        {/* BLOCK */}
                                        <Button

                                            variant={
                                                user.isBlocked
                                                    ? 'success'
                                                    : 'warning'
                                            }

                                            size="sm"

                                            onClick={() =>

                                                blockUserHandler(
                                                    user._id
                                                )
                                            }
                                        >

                                            {user.isBlocked
                                                ? 'Unblock'
                                                : 'Block'}

                                        </Button>

                                        {/* DELETE */}
                                        <Button

                                            variant="danger"

                                            size="sm"

                                            onClick={() =>

                                                deleteUserHandler(
                                                    user._id
                                                )
                                            }
                                        >

                                            Delete

                                        </Button>

                                    </div>

                                </td>

                            </tr>
                        ))}

                    </tbody>

                </Table>

            </Card.Body>

        </Card>

    </div>
);


};

export default ManageUsersPage;
