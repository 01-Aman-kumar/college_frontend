import React, {
    useState,
    useEffect,
} from 'react';

import {
    Navbar,
    Nav,
    Container,
    Button,
    NavDropdown,
} from 'react-bootstrap';

import {
    LinkContainer,
} from 'react-router-bootstrap';

import {
    useNavigate,
} from 'react-router-dom';

import './Header.css';


const Header = () => {

    const navigate = useNavigate();

    const [isScrolled, setIsScrolled] =
        useState(false);

    const userInfo =
        JSON.parse(
            localStorage.getItem('userInfo')
        );


    useEffect(() => {

        const handleScroll = () => {

            if (window.scrollY > 20) {

                setIsScrolled(true);

            } else {

                setIsScrolled(false);
            }
        };

        window.addEventListener(
            'scroll',
            handleScroll
        );

        return () => {

            window.removeEventListener(
                'scroll',
                handleScroll
            );
        };

    }, []);


    const logoutHandler = () => {

        localStorage.removeItem(
            'userInfo'
        );

        navigate('/login');
    };


    return (

        <header>

            <Navbar

                expand="lg"

                fixed="top"

                collapseOnSelect

                className={`custom-navbar ${
                    isScrolled
                        ? 'navbar-scrolled'
                        : ''
                }`}
            >

                <Container>

                    {/* LOGO */}
                    <LinkContainer to="/">

                        <Navbar.Brand
                            className="brand-logo"
                        >

                            <div className="logo-icon">

                                <i className="fa-solid fa-truck-medical"></i>

                            </div>

                            <div>

                                <span className="brand-title">
                                    JEEVAN
                                </span>

                                <small className="brand-subtitle">
                                    Emergency Response
                                </small>
                            </div>

                        </Navbar.Brand>
                    </LinkContainer>



                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"

                        className="border-0 shadow-none"
                    />


                    <Navbar.Collapse
                        id="basic-navbar-nav"
                    >

                        <Nav className="ms-auto align-items-center">

                            {/* HOME */}
                            <LinkContainer to="/">

                                <Nav.Link
                                    className="nav-link-custom"
                                >
                                    Home
                                </Nav.Link>
                            </LinkContainer>



                            {/* REQUEST HELP */}
                            <LinkContainer to="/request-help">

                                <Nav.Link>

                                    <Button
                                        className="emergency-btn"
                                    >

                                        <i className="fa-solid fa-siren-on me-2"></i>

                                        Request Help

                                    </Button>

                                </Nav.Link>
                            </LinkContainer>



                            {/* USER */}
                            {userInfo ? (

                                <NavDropdown

                                    title={
                                        <span className="user-dropdown">

                                            <i className="fa-solid fa-user-shield me-2"></i>

                                            {userInfo.name}

                                        </span>
                                    }

                                    id="username"

                                    align="end"

                                    className="user-menu"
                                >

                                    {/* ADMIN */}
                                    {userInfo.role ===
                                        'Admin' && (

                                        <>

                                            <LinkContainer to="/admin-dashboard">

                                                <NavDropdown.Item>

                                                    <i className="fa-solid fa-chart-line me-2"></i>

                                                    Admin Dashboard

                                                </NavDropdown.Item>
                                            </LinkContainer>

                                            <NavDropdown.Divider />

                                        </>
                                    )}



                                    {/* RESPONDER */}
                                    {userInfo.role ===
                                        'Responder' && (

                                        <LinkContainer to="/dashboard">

                                            <NavDropdown.Item>

                                                <i className="fa-solid fa-ambulance me-2"></i>

                                                Dashboard

                                            </NavDropdown.Item>
                                        </LinkContainer>
                                    )}


                                    <LinkContainer to="/profile">

                                        <NavDropdown.Item>

                                            <i className="fa-solid fa-user me-2"></i>

                                            Profile

                                        </NavDropdown.Item>
                                    </LinkContainer>


                                    <NavDropdown.Divider />


                                    <NavDropdown.Item
                                        onClick={
                                            logoutHandler
                                        }
                                    >

                                        <i className="fa-solid fa-right-from-bracket me-2"></i>

                                        Logout

                                    </NavDropdown.Item>

                                </NavDropdown>

                            ) : (

                                <LinkContainer to="/login">

                                    <Nav.Link>

                                        <Button
                                            className="login-btn"
                                        >

                                            <i className="fa-solid fa-user-doctor me-2"></i>

                                            Login

                                        </Button>

                                    </Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;