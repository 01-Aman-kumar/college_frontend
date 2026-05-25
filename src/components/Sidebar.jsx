import React from 'react';

import {
    NavLink,
    useNavigate,
} from 'react-router-dom';

import {

    HouseDoor,

    ListTask,

    ClockHistory,

    Person,

    Gear,

    BoxArrowLeft,

    BarChartFill,

    PeopleFill,

    ExclamationTriangleFill,

} from 'react-bootstrap-icons';

import './Sidebar.css';


const Sidebar = () => {

    const navigate = useNavigate();

    const userInfo =
        JSON.parse(
            localStorage.getItem('userInfo')
        );


    const logoutHandler = () => {

        localStorage.removeItem(
            'userInfo'
        );

        navigate('/login');
    };


    return (

        <nav className="sidebar">

            {/* LOGO */}
            <div className="sidebar-header">

                <div className="sidebar-logo">

                    <div className="logo-box">

                        <i className="fa-solid fa-truck-medical"></i>

                    </div>

                    <div>

                        <h3>
                            JEEVAN
                        </h3>

                        <small>

                            {userInfo?.role === 'Admin'

                                ? 'Admin Panel'

                                : 'Responder Panel'}
                        </small>

                    </div>
                </div>
            </div>



            {/* NAVIGATION */}
            <ul className="sidebar-nav">

                {/* ADMIN MENU */}
                {userInfo?.role === 'Admin' ? (

                    <>

                        <li>

                            <NavLink
                                to="/admin-dashboard"

                                className={({ isActive }) =>

                                    isActive
                                        ? 'active'
                                        : ''
                                }
                            >

                                <BarChartFill />

                                Dashboard

                            </NavLink>
                        </li>


                        <li>

                            <NavLink
                                to="/active-requests"

                                className={({ isActive }) =>

                                    isActive
                                        ? 'active'
                                        : ''
                                }
                            >

                                <ExclamationTriangleFill />

                                Emergency Requests

                            </NavLink>
                        </li>


                        <li>

                            <NavLink
                                to="/history"

                                className={({ isActive }) =>

                                    isActive
                                        ? 'active'
                                        : ''
                                }
                            >

                                <ClockHistory />

                                Reports

                            </NavLink>
                        </li>


                        <li>

                            <NavLink
                                to="/manage-users"

                                className={({ isActive }) =>

                                    isActive
                                        ? 'active'
                                        : ''
                                }
                            >

                                <PeopleFill />

                                Manage Users

                            </NavLink>
                        </li>


                        <li>

                            <NavLink
                                to="/settings"

                                className={({ isActive }) =>

                                    isActive
                                        ? 'active'
                                        : ''
                                }
                            >

                                <Gear />

                                Settings

                            </NavLink>
                        </li>

                    </>
                ) : (

                    <>
                        {/* RESPONDER MENU */}

                        <li>

                            <NavLink
                                to="/dashboard"

                                className={({ isActive }) =>

                                    isActive
                                        ? 'active'
                                        : ''
                                }
                            >

                                <HouseDoor />

                                Dashboard

                            </NavLink>
                        </li>


                        <li>

                            <NavLink
                                to="/active-requests"

                                className={({ isActive }) =>

                                    isActive
                                        ? 'active'
                                        : ''
                                }
                            >

                                <ListTask />

                                Active Requests

                            </NavLink>
                        </li>


                        <li>

                            <NavLink
                                to="/history"

                                className={({ isActive }) =>

                                    isActive
                                        ? 'active'
                                        : ''
                                }
                            >

                                <ClockHistory />

                                Response History

                            </NavLink>
                        </li>


                        <li>

                            <NavLink
                                to="/profile"

                                className={({ isActive }) =>

                                    isActive
                                        ? 'active'
                                        : ''
                                }
                            >

                                <Person />

                                Profile

                            </NavLink>
                        </li>


                        <li>

                            <NavLink
                                to="/settings"

                                className={({ isActive }) =>

                                    isActive
                                        ? 'active'
                                        : ''
                                }
                            >

                                <Gear />

                                Settings

                            </NavLink>
                        </li>
                    </>
                )}
            </ul>



            {/* FOOTER */}
            <div className="sidebar-footer">

                <button
                    className="logout-btn"

                    onClick={logoutHandler}
                >

                    <BoxArrowLeft />

                    Logout

                </button>
            </div>
        </nav>
    );
};

export default Sidebar;