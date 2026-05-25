import React from 'react';

import {
    Navigate,
    Outlet,
} from 'react-router-dom';


const ProtectedRoute = () => {

    const userInfo =
        JSON.parse(
            localStorage.getItem(
                'userInfo'
            )
        );


    // Allow both Admin and Responder
    if (
        userInfo &&
        userInfo.token
    ) {

        return <Outlet />;
    }


    return (
        <Navigate
            to="/login"
            replace
        />
    );
};

export default ProtectedRoute;