import React, {useEffect,} from 'react';

import {Outlet,} from 'react-router-dom';

import Sidebar from '../components/Sidebar';

import io from 'socket.io-client';

import './DashboardLayout.css';


// const socket =io('http://localhost:5000');
const socket = io("https://project-backend-4usa.onrender.com");

const DashboardLayout = () => {

    const userInfo =
        JSON.parse(
            localStorage.getItem(
                'userInfo'
            )
        );


    useEffect(() => {

        // ASK NOTIFICATION PERMISSION
        if (
            'Notification' in window &&
            Notification.permission ===
                'default'
        ) {

            Notification.requestPermission();
        }


        // NEW EMERGENCY NOTIFICATION
        const handleNewRequest =
            (newRequest) => {

                if (
                    Notification.permission ===
                    'granted'
                ) {

                    new Notification(

                        '🚨 New Emergency Request',

                        {
                            body:
                                `${newRequest.emergencyType} emergency reported with ${newRequest.victimCount} victims.`,

                            icon:
                                '/favicon.ico',
                        }
                    );
                }
            };


        socket.on(
            'newHelpRequest',
            handleNewRequest
        );


        return () => {

            socket.off(
                'newHelpRequest',
                handleNewRequest
            );
        };

    }, []);


    return (

        <div className="dashboard-layout">

            {/* SIDEBAR */}
            <Sidebar />


            {/* MAIN AREA */}
            <main className="dashboard-main-content">

                {/* TOP HEADER */}
                <div className="dashboard-topbar">

                    <div>

                        <h4>

                            {userInfo?.role ===
                            'Admin'

                                ? 'Admin Control Center'

                                : 'Responder Dashboard'}

                        </h4>

                        <p>

                            Welcome back,
                            {' '}
                            {userInfo?.name}

                        </p>

                    </div>


                    <div className="dashboard-status">

                        <span className="status-dot"></span>

                        System Online

                    </div>
                </div>



                {/* PAGE CONTENT */}
                <div className="dashboard-page-content">

                    <Outlet />

                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;